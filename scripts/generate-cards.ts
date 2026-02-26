#!/usr/bin/env npx tsx
/**
 * Card Database Generator
 *
 * Parses expected_ranges.json (range patterns) and seeds.json (stats + abilities),
 * cross-references with card-mapping.json (Greek mythology names), and generates
 * typed CardDefinition files for the engine.
 *
 * Usage: npx tsx scripts/generate-cards.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';

// ── Paths ──────────────────────────────────────────────────────────────

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DATA = resolve(ROOT, 'data');
const CARDS_DIR = resolve(ROOT, 'packages/engine/src/cards');

// ── Types for parsed data ──────────────────────────────────────────────

interface RangeCell {
  row: number;
  col: number;
  type: 'pawn' | 'ability' | 'both';
}

interface SeedsCard {
  name: string;
  type: 'Card' | 'ReplacementCard';
  category: string;
  cardNumber: number;
  pawnRank: number;
  power: number;
  tiles: Array<{ type: 'Pawn' | 'Affected'; x: number; y: number }>;
  abilities: Array<{
    type: string;
    when: string;
    which: string;
    actionType: string;
    actionValue: string;
  }>;
}

interface CardMapping {
  tokenNameMap: Record<string, string>;
  cards: Array<{
    id: string;
    originalName: string;
    overrides?: Record<string, unknown>;
  }>;
  tokens: Array<{
    id: string;
    originalName: string;
    originalSlug?: string;
    rank: number;
    power: number;
    ability?: {
      trigger: string;
      effect: Record<string, unknown>;
    };
  }>;
}

interface ExpectedRangeEntry {
  name: string;
  grid: (string | null)[][];
}

// ── Step 1: Parse expected_ranges.json ─────────────────────────────────

function parseExpectedRanges(): Record<string, { name: string; rangePattern: RangeCell[] }> {
  const raw = JSON.parse(readFileSync(resolve(DATA, 'expected_ranges.json'), 'utf-8')) as Record<
    string,
    ExpectedRangeEntry
  >;
  const result: Record<string, { name: string; rangePattern: RangeCell[] }> = {};

  for (const [slug, entry] of Object.entries(raw)) {
    const grid = entry.grid;
    const height = grid.length;
    const width = grid[0]!.length;
    const centerRow = Math.floor(height / 2);
    const centerCol = Math.floor(width / 2);

    const cells: RangeCell[] = [];
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        const val = grid[r]![c];
        if (val === null || val === 'W') continue;
        if (r === centerRow && c === centerCol) continue;

        const relRow = r - centerRow;
        const relCol = c - centerCol;

        let type: 'pawn' | 'ability' | 'both';
        if (val === 'O') type = 'pawn';
        else if (val === 'R') type = 'ability';
        else if (val === 'OR') type = 'both';
        else {
          console.warn(`Unknown cell type "${val}" in ${slug} at (${r},${c})`);
          continue;
        }

        cells.push({ row: relRow, col: relCol, type });
      }
    }

    result[slug] = { name: entry.name, rangePattern: cells };
  }

  return result;
}

// ── Step 2: Load seeds.json ──────────────────────────────────────────────

function loadSeedsJson(): SeedsCard[] {
  return JSON.parse(readFileSync(resolve(DATA, 'seeds.json'), 'utf-8')) as SeedsCard[];
}

// ── Step 3: Load card-mapping.json ─────────────────────────────────────

function loadMapping(): CardMapping {
  return JSON.parse(readFileSync(resolve(DATA, 'card-mapping.json'), 'utf-8')) as CardMapping;
}

// ── Step 4: Build name lookups ─────────────────────────────────────────

function buildNameToSlug(
  ranges: Record<string, { name: string; rangePattern: RangeCell[] }>,
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [slug, entry] of Object.entries(ranges)) {
    // For multi-variant tokens, only map the first one
    if (!map[entry.name]) {
      map[entry.name] = slug;
    }
  }
  return map;
}

// ── Step 5: Map triggers ───────────────────────────────────────────────

function mapTrigger(
  when: string,
  overrides?: Record<string, unknown>,
): { trigger: string; threshold?: number } {
  if (overrides?.['scalingCondition']) {
    return { trigger: 'scaling' };
  }

  switch (when) {
    case 'played':
      return { trigger: 'whenPlayed' };
    case 'in_play':
      return { trigger: 'whileInPlay' };
    case 'destroyed':
      return { trigger: 'whenDestroyed' };
    case 'allies_destroyed':
      return { trigger: 'whenAlliedDestroyed' };
    case 'enemies_destroyed':
      return { trigger: 'whenEnemyDestroyed' };
    case 'allies_and_enemies_destroyed':
      return { trigger: 'whenAnyDestroyed' };
    case 'enhanced':
      return { trigger: 'whenFirstEnhanced' };
    case 'enfeebled':
      return { trigger: 'whenFirstEnfeebled' };
    case 'allies_played_from_hand':
      return { trigger: 'whenAlliedPlayed' };
    case 'enemies_played_from_hand':
      return { trigger: 'whenEnemyPlayed' };
    case 'win_the_lane':
      return { trigger: 'endOfGame' };
    default: {
      const thresholdMatch = when.match(/power_first_reaches_(\d+)/);
      if (thresholdMatch) {
        return {
          trigger: 'whenPowerReachesN',
          threshold: parseInt(thresholdMatch[1]!, 10),
        };
      }
      console.warn(`Unknown trigger: "${when}"`);
      return { trigger: 'whenPlayed' };
    }
  }
}

// ── Step 6: Map targets ────────────────────────────────────────────────

function mapTarget(which: string): string | null {
  switch (which) {
    case 'self':
      return 'self';
    case 'allies_on_affected_tiles':
    case 'enemies_on_affected_tiles':
    case 'allies_and_enemies_on_affected_tiles':
    case 'positions':
    case 'empty_positions':
      return 'rangePattern';
    case 'enhanced_allies':
      return 'allAlliedEnhanced';
    case 'enfeebled_allies':
      return 'allAlliedEnfeebled';
    case 'enhanced_enemies':
      return 'allEnemyEnhanced';
    case 'enfeebled_enemies':
      return 'allEnemyEnfeebled';
    case 'enhanced_allies_and_enemies':
      return 'allEnhanced';
    case 'enfeebled_allies_and_enemies':
      return 'allEnfeebled';
    case '':
      return null;
    default:
      console.warn(`Unknown target: "${which}"`);
      return 'rangePattern';
  }
}

// ── Step 7: Resolve token references ───────────────────────────────────

function resolveTokenId(actionValue: string, mapping: CardMapping): string | null {
  // Extract card name from Card.find_by(name:'X') or Card.where(name:['X', 'Y'])
  const singleMatch = actionValue.match(/Card\.find_by\(name:'([^']+)'\)/);
  if (singleMatch) {
    const originalTokenName = singleMatch[1]!;
    return resolveTokenName(originalTokenName, mapping);
  }

  // Handle Card.where(name:['X', 'Y'] ).all (note possible extra spaces)
  const whereMatch = actionValue.match(/Card\.where\(name:\[([^\]]+)\]/);
  if (whereMatch) {
    const names = whereMatch[1]!.match(/'([^']+)'/g);
    if (names && names.length > 0) {
      const firstName = names[0]!.replace(/'/g, '');
      return resolveTokenName(firstName, mapping);
    }
  }

  // Dynamic values like "target_tile.pawn_value*2" — not a card reference
  return null;
}

function resolveTokenName(name: string, mapping: CardMapping): string {
  // tokenNameMap maps seeds.rb names directly to engine token IDs
  const directId = mapping.tokenNameMap[name];
  if (directId) return directId;

  // Fallback: match by originalName in token entries
  const match = mapping.tokens.find((t) => t.originalName === name);
  if (match) return match.id;

  console.warn(`Could not resolve token: "${name}"`);
  return 'unknown-token';
}

function resolveSecondTokenFromWhere(actionValue: string, mapping: CardMapping): string | null {
  const whereMatch = actionValue.match(/Card\.where\(name:\[([^\]]+)\]/);
  if (whereMatch) {
    const names = whereMatch[1]!.match(/'([^']+)'/g);
    if (names && names.length > 1) {
      const secondName = names[1]!.replace(/'/g, '');
      return resolveTokenName(secondName, mapping);
    }
  }
  return null;
}

// ── Step 8: Build effect objects ───────────────────────────────────────

interface EffectObj {
  type: string;
  [key: string]: unknown;
}

function buildEffect(
  ability: SeedsCard['abilities'][0],
  overrides: Record<string, unknown> | undefined,
  mapping: CardMapping,
): EffectObj | null {
  const { type: abilityType, actionType, actionValue, which } = ability;
  const target = mapTarget(which);

  // VictorReceivesAllScoresAbility
  if (
    abilityType === 'VictorReceivesAllScoresAbility' ||
    actionType === 'victor_receives_all_scores'
  ) {
    return { type: 'scoreRedistribution' };
  }

  // RaiseRankAbility
  if (abilityType === 'RaiseRankAbility' || actionType === 'raise_rank') {
    const value = parseInt(actionValue, 10) || 2;
    return {
      type: 'positionRankManip',
      bonusPawns: value,
      ...(target ? { target: { type: target } } : { target: { type: 'rangePattern' } }),
    };
  }

  // SpawnAbility
  if (abilityType === 'SpawnAbility' || actionType === 'spawn') {
    let tokenId = resolveTokenId(actionValue, mapping);
    // Dynamic spawn (e.g. Shiva) — check if there's a dynamicSpawnPower override
    // and look up the child card from the mapping's tokenNameMap
    if (!tokenId && overrides?.['dynamicSpawnPower']) {
      // Find the parent card's child token in the mapping (e.g. Diamond Dust → frost-crystal-minor)
      // by checking for Card.find_by_name references in seeds.rb child entries
      tokenId = mapping.tokenNameMap['Diamond Dust'] ?? null;
    }
    return {
      type: 'spawnCard',
      tokenDefinitionId: tokenId ?? 'unknown-token',
      ...(target ? { target: { type: target } } : { target: { type: 'rangePattern' } }),
    };
  }

  // AddCardAbility
  if (abilityType === 'AddCardAbility' || actionType === 'add') {
    const tokenId = resolveTokenId(actionValue, mapping);
    const result: EffectObj = {
      type: 'addCardToHand',
      tokenDefinitionId: tokenId ?? 'unknown-token',
      count: 1,
    };
    // Handle multi-token adds (e.g. Moogle Trio → Moogle Mage + Moogle Bard)
    if (overrides?.['additionalTokens']) {
      const extras = overrides['additionalTokens'] as Array<{ tokenId: string; count: number }>;
      result['additionalTokens'] = extras.map((e) => ({
        tokenDefinitionId: e.tokenId,
        count: e.count,
      }));
    } else {
      // Check for Card.where with multiple names
      const secondToken = resolveSecondTokenFromWhere(actionValue, mapping);
      if (secondToken) {
        result['additionalTokens'] = [{ tokenDefinitionId: secondToken, count: 1 }];
      }
    }
    return result;
  }

  // DestroyCardAbility
  if (abilityType === 'DestroyCardAbility' || actionType === 'destroy') {
    return {
      type: 'destroy',
      ...(target ? { target: { type: target } } : { target: { type: 'rangePattern' } }),
    };
  }

  // Scaling override (allies_played_from_hand / enemies_played_from_hand)
  if (overrides?.['scalingCondition']) {
    return {
      type: 'selfPowerScaling',
      condition: { type: overrides['scalingCondition'] as string },
      valuePerUnit: (overrides['valuePerUnit'] as number) ?? 1,
    };
  }

  // ReplacementAbility with power transfer
  if (abilityType === 'ReplacementAbility') {
    if (actionType === 'destroy') {
      return {
        type: 'destroy',
        ...(target ? { target: { type: target } } : { target: { type: 'self' } }),
      };
    }

    // ally.power based effects
    const isDynamic = overrides?.['dynamicValue'] === 'replacedCardPower';
    const value = isDynamic ? 0 : 1;
    if (actionType === 'power_up') {
      return {
        type: 'enhance',
        value,
        ...(isDynamic ? { dynamicValue: 'replacedCardPower' } : {}),
        ...(target ? { target: { type: target } } : { target: { type: 'rangePattern' } }),
      };
    }
    if (actionType === 'power_down') {
      return {
        type: 'enfeeble',
        value,
        ...(isDynamic ? { dynamicValue: 'replacedCardPower' } : {}),
        ...(target ? { target: { type: target } } : { target: { type: 'rangePattern' } }),
      };
    }
  }

  // EnhanceAbility / power_up
  if (actionType === 'power_up') {
    const value = parseInt(actionValue, 10);
    if (isNaN(value)) {
      // Dynamic value like "ally.power"
      return {
        type: 'enhance',
        value: 0,
        ...(target ? { target: { type: target } } : {}),
      };
    }
    return {
      type: 'enhance',
      value,
      ...(target ? { target: { type: target } } : {}),
    };
  }

  // EnfeebleAbility / power_down
  if (actionType === 'power_down') {
    const value = parseInt(actionValue, 10);
    if (isNaN(value)) {
      return {
        type: 'enfeeble',
        value: 0,
        ...(target ? { target: { type: target } } : {}),
      };
    }
    return {
      type: 'enfeeble',
      value,
      ...(target ? { target: { type: target } } : {}),
    };
  }

  console.warn(`Could not parse ability: ${JSON.stringify(ability)}`);
  return null;
}

// ── Step 9: Check for dual-ability cards (Two Face pattern) ────────────

function isDualAbility(abilities: SeedsCard['abilities']): boolean {
  if (abilities.length !== 2) return false;
  const hasEnhance = abilities.some((a) => a.actionType === 'power_up');
  const hasEnfeeble = abilities.some((a) => a.actionType === 'power_down');
  return hasEnhance && hasEnfeeble;
}

function buildDualEffect(abilities: SeedsCard['abilities']): EffectObj {
  const enhance = abilities.find((a) => a.actionType === 'power_up')!;
  const enfeeble = abilities.find((a) => a.actionType === 'power_down')!;
  const target = mapTarget(enhance.which) ?? mapTarget(enfeeble.which) ?? 'rangePattern';
  return {
    type: 'dualTargetBuff',
    alliedValue: parseInt(enhance.actionValue, 10) || 1,
    enemyValue: -(parseInt(enfeeble.actionValue, 10) || 1),
    target: { type: target },
  };
}

// ── Step 10: Generate card definition code ─────────────────────────────

// Reverse maps: string value → constant expression for code generation
const RANGE_TYPE_EXPR: Record<string, string> = {
  pawn: 'RANGE_CELL_TYPES.PAWN',
  ability: 'RANGE_CELL_TYPES.ABILITY',
  both: 'RANGE_CELL_TYPES.BOTH',
};

const TRIGGER_EXPR: Record<string, string> = {
  whenPlayed: 'ABILITY_TRIGGERS.WHEN_PLAYED',
  whileInPlay: 'ABILITY_TRIGGERS.WHILE_IN_PLAY',
  whenDestroyed: 'ABILITY_TRIGGERS.WHEN_DESTROYED',
  whenAlliedDestroyed: 'ABILITY_TRIGGERS.WHEN_ALLIED_DESTROYED',
  whenEnemyDestroyed: 'ABILITY_TRIGGERS.WHEN_ENEMY_DESTROYED',
  whenAnyDestroyed: 'ABILITY_TRIGGERS.WHEN_ANY_DESTROYED',
  whenAlliedPlayed: 'ABILITY_TRIGGERS.WHEN_ALLIED_PLAYED',
  whenEnemyPlayed: 'ABILITY_TRIGGERS.WHEN_ENEMY_PLAYED',
  whenFirstEnfeebled: 'ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED',
  whenFirstEnhanced: 'ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED',
  whenPowerReachesN: 'ABILITY_TRIGGERS.WHEN_POWER_REACHES_N',
  scaling: 'ABILITY_TRIGGERS.SCALING',
  endOfGame: 'ABILITY_TRIGGERS.END_OF_GAME',
};

const EFFECT_TYPE_EXPR: Record<string, string> = {
  enhance: 'EFFECT_TYPES.ENHANCE',
  enfeeble: 'EFFECT_TYPES.ENFEEBLE',
  destroy: 'EFFECT_TYPES.DESTROY',
  selfPowerScaling: 'EFFECT_TYPES.SELF_POWER_SCALING',
  laneScoreBonus: 'EFFECT_TYPES.LANE_SCORE_BONUS',
  addCardToHand: 'EFFECT_TYPES.ADD_CARD_TO_HAND',
  spawnCard: 'EFFECT_TYPES.SPAWN_CARD',
  positionRankManip: 'EFFECT_TYPES.POSITION_RANK_MANIP',
  scoreRedistribution: 'EFFECT_TYPES.SCORE_REDISTRIBUTION',
  dualTargetBuff: 'EFFECT_TYPES.DUAL_TARGET_BUFF',
};

const TARGET_EXPR: Record<string, string> = {
  rangePattern: 'TARGET_SELECTORS.RANGE_PATTERN',
  self: 'TARGET_SELECTORS.SELF',
  allAllied: 'TARGET_SELECTORS.ALL_ALLIED',
  allEnemy: 'TARGET_SELECTORS.ALL_ENEMY',
  allInLane: 'TARGET_SELECTORS.ALL_IN_LANE',
  allAlliedInLane: 'TARGET_SELECTORS.ALL_ALLIED_IN_LANE',
  allEnemyInLane: 'TARGET_SELECTORS.ALL_ENEMY_IN_LANE',
  allAlliedEnhanced: 'TARGET_SELECTORS.ALL_ALLIED_ENHANCED',
  allEnemyEnhanced: 'TARGET_SELECTORS.ALL_ENEMY_ENHANCED',
  allEnhanced: 'TARGET_SELECTORS.ALL_ENHANCED',
  allAlliedEnfeebled: 'TARGET_SELECTORS.ALL_ALLIED_ENFEEBLED',
  allEnemyEnfeebled: 'TARGET_SELECTORS.ALL_ENEMY_ENFEEBLED',
  allEnfeebled: 'TARGET_SELECTORS.ALL_ENFEEBLED',
};

function toVarName(id: string): string {
  return id.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function formatRangePattern(cells: RangeCell[]): string {
  if (cells.length === 0) return '[]';
  const lines = cells.map(
    (c) =>
      `    { row: ${c.row}, col: ${c.col}, type: ${RANGE_TYPE_EXPR[c.type] ?? `'${c.type}'`} },`,
  );
  return `[\n${lines.join('\n')}\n  ]`;
}

function formatEffect(effect: EffectObj): string {
  const effectType = effect['type'] as string;
  const parts: string[] = [`type: ${EFFECT_TYPE_EXPR[effectType] ?? `'${effectType}'`}`];

  if (effect['value'] !== undefined) parts.push(`value: ${effect['value']}`);
  if (effect['bonusPawns'] !== undefined) parts.push(`bonusPawns: ${effect['bonusPawns']}`);
  if (effect['alliedValue'] !== undefined) parts.push(`alliedValue: ${effect['alliedValue']}`);
  if (effect['enemyValue'] !== undefined) parts.push(`enemyValue: ${effect['enemyValue']}`);
  if (effect['tokenDefinitionId'] !== undefined)
    parts.push(`tokenDefinitionId: '${effect['tokenDefinitionId']}'`);
  if (effect['count'] !== undefined) parts.push(`count: ${effect['count']}`);
  if (effect['condition'] !== undefined) {
    const cond = effect['condition'] as { type: string };
    parts.push(`condition: { type: '${cond.type}' }`);
  }
  if (effect['valuePerUnit'] !== undefined) parts.push(`valuePerUnit: ${effect['valuePerUnit']}`);
  if (effect['dynamicValue'] !== undefined) parts.push(`dynamicValue: '${effect['dynamicValue']}'`);
  if (effect['additionalTokens'] !== undefined) {
    const tokens = effect['additionalTokens'] as Array<{
      tokenDefinitionId: string;
      count: number;
    }>;
    const tokenStr = tokens
      .map((t) => `{ tokenDefinitionId: '${t.tokenDefinitionId}', count: ${t.count} }`)
      .join(', ');
    parts.push(`additionalTokens: [${tokenStr}]`);
  }
  if (effect['target'] !== undefined) {
    const tgt = effect['target'] as { type: string };
    parts.push(`target: { type: ${TARGET_EXPR[tgt.type] ?? `'${tgt.type}'`} }`);
  }

  return `{ ${parts.join(', ')} }`;
}

interface CardDef {
  id: string;
  rank: number | 'replacement';
  power: number;
  rangePattern: RangeCell[];
  ability?: {
    trigger: string;
    effect: EffectObj;
    threshold?: number;
  };
  isToken?: boolean;
}

function formatCardDef(card: CardDef, varName: string): string {
  const lines: string[] = [];
  lines.push(`export const ${varName}: CardDefinition = {`);
  lines.push(`  id: '${card.id}',`);
  lines.push(`  rank: ${card.rank === 'replacement' ? 'CARD_RANKS.REPLACEMENT' : card.rank},`);
  lines.push(`  power: ${card.power},`);
  lines.push(`  rangePattern: ${formatRangePattern(card.rangePattern)},`);

  if (card.ability) {
    const abilityParts: string[] = [];
    const triggerExpr = TRIGGER_EXPR[card.ability.trigger] ?? `'${card.ability.trigger}'`;
    abilityParts.push(`trigger: ${triggerExpr}`);
    abilityParts.push(`effect: ${formatEffect(card.ability.effect)}`);
    if (card.ability.threshold !== undefined) {
      abilityParts.push(`threshold: ${card.ability.threshold}`);
    }
    lines.push(`  ability: {`);
    for (const part of abilityParts) {
      lines.push(`    ${part},`);
    }
    lines.push(`  },`);
  }

  if (card.isToken) {
    lines.push(`  isToken: true,`);
  }

  lines.push(`};`);
  return lines.join('\n');
}

// ── Step 11: Main generation pipeline ──────────────────────────────────

function main() {
  console.log('Parsing expected_ranges.json...');
  const ranges = parseExpectedRanges();
  console.log(`  Found ${Object.keys(ranges).length} range entries`);

  console.log('Loading seeds.json...');
  const seedsCards = loadSeedsJson();
  console.log(`  Found ${seedsCards.length} cards`);

  console.log('Loading card-mapping.json...');
  const mapping = loadMapping();
  console.log(`  ${mapping.cards.length} cards, ${mapping.tokens.length} tokens`);

  // Build lookups
  const nameToSlug = buildNameToSlug(ranges);
  const seedsByName = new Map<string, SeedsCard>();
  for (const card of seedsCards) {
    seedsByName.set(card.name, card);
  }

  // Process main cards
  const rank1Cards: CardDef[] = [];
  const rank2Cards: CardDef[] = [];
  const rank3Cards: CardDef[] = [];
  const replacementCards: CardDef[] = [];

  for (const entry of mapping.cards) {
    const seeds = seedsByName.get(entry.originalName);
    if (!seeds) {
      console.warn(`No seeds.rb entry for: ${entry.originalName}`);
      continue;
    }

    // Get range pattern from expected_ranges.json
    const slug = nameToSlug[entry.originalName];
    let rangePattern: RangeCell[] = [];
    if (slug && ranges[slug]) {
      rangePattern = ranges[slug].rangePattern;
    } else {
      console.warn(`No expected_ranges entry for: ${entry.originalName}`);
    }

    // Determine rank
    const isReplacement = seeds.type === 'ReplacementCard' || seeds.pawnRank === -1;
    const rank: number | 'replacement' = isReplacement ? 'replacement' : seeds.pawnRank;

    // Build ability
    let ability: CardDef['ability'];

    if (seeds.abilities.length > 0) {
      if (isDualAbility(seeds.abilities)) {
        // Two Face pattern: dual enhance + enfeeble
        const trigger = mapTrigger(seeds.abilities[0]!.when, entry.overrides);
        ability = {
          trigger: trigger.trigger,
          effect: buildDualEffect(seeds.abilities),
          ...(trigger.threshold !== undefined ? { threshold: trigger.threshold } : {}),
        };
      } else {
        const primaryAbility = seeds.abilities[0]!;
        const trigger = mapTrigger(primaryAbility.when, entry.overrides);
        const effect = buildEffect(primaryAbility, entry.overrides, mapping);

        if (effect) {
          ability = {
            trigger: trigger.trigger,
            effect,
            ...(trigger.threshold !== undefined ? { threshold: trigger.threshold } : {}),
            ...(entry.overrides?.['threshold'] !== undefined
              ? { threshold: entry.overrides['threshold'] as number }
              : {}),
          };
        }
      }
    }

    const cardDef: CardDef = {
      id: entry.id,
      rank,
      power: seeds.power,
      rangePattern,
      ...(ability ? { ability } : {}),
    };

    if (rank === 1) rank1Cards.push(cardDef);
    else if (rank === 2) rank2Cards.push(cardDef);
    else if (rank === 3) rank3Cards.push(cardDef);
    else if (rank === 'replacement') replacementCards.push(cardDef);
  }

  // Process tokens
  const tokenDefs: CardDef[] = [];

  for (const tokenEntry of mapping.tokens) {
    const slug = tokenEntry.originalSlug ?? nameToSlug[tokenEntry.originalName];
    let rangePattern: RangeCell[] = [];
    if (slug && ranges[slug]) {
      rangePattern = ranges[slug].rangePattern;
    } else {
      console.warn(
        `No expected_ranges entry for token: ${tokenEntry.originalName} (slug: ${slug})`,
      );
    }

    const tokenDef: CardDef = {
      id: tokenEntry.id,
      rank: tokenEntry.rank as 1 | 2 | 3,
      power: tokenEntry.power,
      rangePattern,
      isToken: true,
    };

    // Add ability if defined in mapping
    if (tokenEntry.ability) {
      const effect = tokenEntry.ability.effect as EffectObj;
      tokenDef.ability = {
        trigger: tokenEntry.ability.trigger,
        effect,
      };
    }

    tokenDefs.push(tokenDef);
  }

  console.log(`\nCard counts:`);
  console.log(`  Rank 1: ${rank1Cards.length}`);
  console.log(`  Rank 2: ${rank2Cards.length}`);
  console.log(`  Rank 3: ${rank3Cards.length}`);
  console.log(`  Replacement: ${replacementCards.length}`);
  console.log(`  Tokens: ${tokenDefs.length}`);
  console.log(
    `  Total: ${rank1Cards.length + rank2Cards.length + rank3Cards.length + replacementCards.length + tokenDefs.length}`,
  );

  // Generate files
  mkdirSync(CARDS_DIR, { recursive: true });

  generateFile('rank1-cards', rank1Cards, 'Rank1', CARDS_DIR);
  generateFile('rank2-cards', rank2Cards, 'Rank2', CARDS_DIR);
  generateFile('rank3-cards', rank3Cards, 'Rank3', CARDS_DIR);
  generateFile('replacement-cards', replacementCards, 'Replacement', CARDS_DIR);
  generateFile('game-tokens', tokenDefs, 'GameToken', CARDS_DIR);
  generateBarrelFile(CARDS_DIR);

  // Format with prettier
  console.log('\nFormatting with prettier...');
  try {
    execSync(
      `npx prettier --write "${CARDS_DIR}/rank1-cards.ts" "${CARDS_DIR}/rank2-cards.ts" "${CARDS_DIR}/rank3-cards.ts" "${CARDS_DIR}/replacement-cards.ts" "${CARDS_DIR}/game-tokens.ts" "${CARDS_DIR}/all-cards.ts"`,
      { cwd: ROOT, stdio: 'inherit' },
    );
  } catch {
    console.warn('Prettier formatting failed (non-fatal)');
  }

  console.log('\nDone! Generated card definition files.');
}

function generateFile(fileName: string, cards: CardDef[], prefix: string, outDir: string): void {
  const lines: string[] = [];
  lines.push("import type { CardDefinition } from '../types.js';");

  // Determine which constants are needed by scanning cards
  const needsRangeCellTypes = cards.some((c) => c.rangePattern.length > 0);
  const needsAbilityTriggers = cards.some((c) => c.ability);
  const needsEffectTypes = cards.some((c) => c.ability);
  const needsTargetSelectors = cards.some((c) => c.ability?.effect['target']);
  const needsCardRanks = cards.some((c) => c.rank === 'replacement');

  const imports: string[] = [];
  if (needsAbilityTriggers) imports.push('ABILITY_TRIGGERS');
  if (needsCardRanks) imports.push('CARD_RANKS');
  if (needsEffectTypes) imports.push('EFFECT_TYPES');
  if (needsRangeCellTypes) imports.push('RANGE_CELL_TYPES');
  if (needsTargetSelectors) imports.push('TARGET_SELECTORS');

  if (imports.length > 0) {
    lines.push(`import { ${imports.join(', ')} } from '../types.js';`);
  }
  lines.push("import { cardsToDefinitionMap } from './utils.js';");
  lines.push('');

  // Card constants
  for (const card of cards) {
    const varName = toVarName(card.id);
    lines.push(formatCardDef(card, varName));
    lines.push('');
  }

  // Array and function
  const allVarName = `ALL_${prefix.toUpperCase()}_CARDS`;
  lines.push(`const ${allVarName}: readonly CardDefinition[] = [`);
  for (const card of cards) {
    lines.push(`  ${toVarName(card.id)},`);
  }
  lines.push('];');
  lines.push('');

  const funcName = `get${prefix}Definitions`;
  lines.push(`export function ${funcName}(): Record<string, CardDefinition> {`);
  lines.push(`  return cardsToDefinitionMap(${allVarName});`);
  lines.push('}');
  lines.push('');

  const filePath = resolve(outDir, `${fileName}.ts`);
  writeFileSync(filePath, lines.join('\n'));
  console.log(`  Generated ${fileName}.ts (${cards.length} cards)`);
}

function generateBarrelFile(outDir: string): void {
  const lines: string[] = [];
  lines.push("import type { CardDefinition } from '../types.js';");
  lines.push("import { getRank1Definitions } from './rank1-cards.js';");
  lines.push("import { getRank2Definitions } from './rank2-cards.js';");
  lines.push("import { getRank3Definitions } from './rank3-cards.js';");
  lines.push("import { getReplacementDefinitions } from './replacement-cards.js';");
  lines.push("import { getGameTokenDefinitions } from './game-tokens.js';");
  lines.push('');
  lines.push('export function getAllGameDefinitions(): Record<string, CardDefinition> {');
  lines.push('  return {');
  lines.push('    ...getRank1Definitions(),');
  lines.push('    ...getRank2Definitions(),');
  lines.push('    ...getRank3Definitions(),');
  lines.push('    ...getReplacementDefinitions(),');
  lines.push('    ...getGameTokenDefinitions(),');
  lines.push('  };');
  lines.push('}');
  lines.push('');

  const filePath = resolve(outDir, 'all-cards.ts');
  writeFileSync(filePath, lines.join('\n'));
  console.log('  Generated all-cards.ts (barrel)');
}

main();
