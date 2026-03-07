import type { CardDefinition } from '../types.js';
import {
  ABILITY_TRIGGERS,
  CARD_RANKS,
  EFFECT_TYPES,
  RANGE_CELL_TYPES,
  TARGET_SELECTORS,
} from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

// Test cards use fake IDs not in CardId — cast is intentional.
function testCard(def: Omit<CardDefinition, 'id'> & { id: string }): CardDefinition {
  return def as CardDefinition;
}

// ── Ability Test Cards ────────────────────────────────────────────────

/** whenPlayed → enhance +2 via rangePattern */
export const enhancerOnPlay = testCard({
  id: 'enhancer-on-play',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
});
/** whenPlayed → enfeeble -3 via rangePattern */
export const enfeebleOnPlay = testCard({
  id: 'enfeeble-on-play',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
});
/** whenPlayed → destroy via rangePattern */
export const destroyerOnPlay = testCard({
  id: 'destroyer-on-play',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.RANGE_PATTERN } },
  },
});
/** whileInPlay → enhance +1 via rangePattern (continuous) */
export const auraBuffer = testCard({
  id: 'aura-buffer',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
});
/** whenDestroyed → enfeeble -2 allEnemyInLane */
export const deathCurse = testCard({
  id: 'death-curse',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 2,
      target: { type: TARGET_SELECTORS.ALL_ENEMY_IN_LANE },
    },
  },
});
/** whenAlliedDestroyed → enhance +2 self */
export const avenger = testCard({
  id: 'avenger',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ALLIED_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 2, target: { type: TARGET_SELECTORS.SELF } },
  },
});
/** whenEnemyDestroyed → enhance +3 self */
export const predator = testCard({
  id: 'predator',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ENEMY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 3, target: { type: TARGET_SELECTORS.SELF } },
  },
});
/** whenAnyDestroyed → enhance +1 self */
export const scavenger = testCard({
  id: 'scavenger',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ANY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
});
/** whenFirstEnfeebled → enhance +3 self */
export const resilient = testCard({
  id: 'resilient',
  rank: 1,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 3, target: { type: TARGET_SELECTORS.SELF } },
  },
});
/** whenFirstEnhanced → enhance +1 allAlliedInLane */
export const inspirer = testCard({
  id: 'inspirer',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.ALL_ALLIED_IN_LANE },
    },
  },
});
/** whenPowerReachesN(5) → destroy allEnemyInLane */
export const threshold5Destroyer = testCard({
  id: 'threshold5-destroyer',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_POWER_REACHES_N,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.ALL_ENEMY_IN_LANE } },
    threshold: 5,
  },
});
/** scaling → selfPowerScaling (alliedCardsInLane, +2) */
export const armyScaler = testCard({
  id: 'army-scaler',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.SCALING,
    effect: {
      type: EFFECT_TYPES.SELF_POWER_SCALING,
      condition: { type: 'alliedCardsInLane' },
      valuePerUnit: 2,
    },
  },
});
/** endOfGame → laneScoreBonus +5 */
export const laneBonus = testCard({
  id: 'lane-bonus',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.END_OF_GAME,
    effect: { type: EFFECT_TYPES.LANE_SCORE_BONUS, value: 5 },
  },
});
/** whenPlayed → addCardToHand (token-basic, count 2) */
export const handGenerator = testCard({
  id: 'hand-generator',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'token-basic', count: 2 },
  },
});
/** whenPlayed → spawnCard (token-basic) via rangePattern */
export const spawner = testCard({
  id: 'spawner',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.SPAWN_CARD,
      tokenDefinitionId: 'token-basic',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
});
/** whenPlayed → positionRankManip +2 via rangePattern */
export const rankBooster = testCard({
  id: 'rank-booster',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.POSITION_RANK_MANIP,
      bonusPawns: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
});
/** endOfGame → scoreRedistribution */
export const scoreRedistributor = testCard({
  id: 'score-redistributor',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.END_OF_GAME,
    effect: { type: EFFECT_TYPES.SCORE_REDISTRIBUTION },
  },
});
/** whileInPlay → dualTargetBuff +1/-1 via rangePattern */
export const dualAura = testCard({
  id: 'dual-aura',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.DUAL_TARGET_BUFF,
      alliedValue: 1,
      enemyValue: -1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
});
/** whenPlayed → enfeeble -5 via rangePattern (for cascade testing: kills a 5-power card) */
export const chainKiller = testCard({
  id: 'chain-killer',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 5,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
});
/** whenAnyDestroyed → enhance +2 self (for cascade testing) */
export const cascadeGrower = testCard({
  id: 'cascade-grower',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ANY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 2, target: { type: TARGET_SELECTORS.SELF } },
  },
});
/** whenAlliedPlayed → enhance +1 self */
export const allyWatcher = testCard({
  id: 'ally-watcher',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ALLIED_PLAYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
});
/** whenEnemyPlayed → enhance +2 self */
export const enemyWatcher = testCard({
  id: 'enemy-watcher',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ENEMY_PLAYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 2, target: { type: TARGET_SELECTORS.SELF } },
  },
});
/** whenPlayed → enfeeble -2 allEnemyEnfeebled */
export const enfeebledHunter = testCard({
  id: 'enfeebled-hunter',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 2,
      target: { type: TARGET_SELECTORS.ALL_ENEMY_ENFEEBLED },
    },
  },
});
/** whenPlayed → enhance +2 allAlliedEnhanced */
export const enhancedBooster = testCard({
  id: 'enhanced-booster',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.ALL_ALLIED_ENHANCED },
    },
  },
});
/** replacement card with dynamicValue: enhance self by replaced card's power */
export const replacementDynamic = testCard({
  id: 'replacement-dynamic',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 0,
      target: { type: TARGET_SELECTORS.SELF },
      dynamicValue: 'replacedCardPower',
    },
  },
});
/** whenPlayed → addCardToHand with additionalTokens */
export const multiTokenGenerator = testCard({
  id: 'multi-token-generator',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ADD_CARD_TO_HAND,
      tokenDefinitionId: 'token-basic',
      count: 1,
      additionalTokens: [{ tokenDefinitionId: 'token-strong', count: 1 }],
    },
  },
}); // ── Helpers ───────────────────────────────────────────────────────────

const ALL_ABILITY_CARDS: readonly CardDefinition[] = [
  enhancerOnPlay,
  enfeebleOnPlay,
  destroyerOnPlay,
  auraBuffer,
  deathCurse,
  avenger,
  predator,
  scavenger,
  resilient,
  inspirer,
  threshold5Destroyer,
  armyScaler,
  laneBonus,
  handGenerator,
  spawner,
  rankBooster,
  scoreRedistributor,
  dualAura,
  chainKiller,
  cascadeGrower,
  allyWatcher,
  enemyWatcher,
  enfeebledHunter,
  enhancedBooster,
  replacementDynamic,
  multiTokenGenerator,
];

export function getAllAbilityTestDefinitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_ABILITY_CARDS);
}
