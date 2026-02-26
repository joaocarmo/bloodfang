import { describe, it, expect } from 'vitest';
import { getAllGameDefinitions } from './cards/all-cards.js';
import { getRank1Definitions } from './cards/rank1-cards.js';
import { getRank2Definitions } from './cards/rank2-cards.js';
import { getRank3Definitions } from './cards/rank3-cards.js';
import { getReplacementDefinitions } from './cards/replacement-cards.js';
import { getGameTokenDefinitions } from './cards/game-tokens.js';
import {
  ABILITY_TRIGGERS,
  TARGET_SELECTORS,
  EFFECT_TYPES,
  RANGE_CELL_TYPES,
  CARD_RANKS,
} from './types.js';

const allDefs = getAllGameDefinitions();
const rank1 = getRank1Definitions();
const rank2 = getRank2Definitions();
const rank3 = getRank3Definitions();
const replacement = getReplacementDefinitions();
const tokens = getGameTokenDefinitions();

describe('Card Database', () => {
  it('has exactly 145 main cards + 21 tokens = 166 definitions', () => {
    const mainCount =
      Object.keys(rank1).length +
      Object.keys(rank2).length +
      Object.keys(rank3).length +
      Object.keys(replacement).length;
    const tokenCount = Object.keys(tokens).length;

    expect(mainCount).toBe(145);
    expect(tokenCount).toBe(21);
    expect(Object.keys(allDefs).length).toBe(166);
  });

  it('has no duplicate IDs across all definition maps', () => {
    const allIds = [
      ...Object.keys(rank1),
      ...Object.keys(rank2),
      ...Object.keys(rank3),
      ...Object.keys(replacement),
      ...Object.keys(tokens),
    ];
    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });

  it('has consistent IDs between keys and definition objects', () => {
    for (const [id, def] of Object.entries(allDefs)) {
      expect(def.id).toBe(id);
    }
  });

  it('all tokens have isToken: true', () => {
    for (const def of Object.values(tokens)) {
      expect(def.isToken).toBe(true);
    }
  });

  it('no main cards have isToken: true', () => {
    const mainCards = { ...rank1, ...rank2, ...rank3, ...replacement };
    for (const def of Object.values(mainCards)) {
      expect(def.isToken).toBeUndefined();
    }
  });

  it('rank 1 cards all have rank 1', () => {
    for (const def of Object.values(rank1)) {
      expect(def.rank).toBe(1);
    }
  });

  it('rank 2 cards all have rank 2', () => {
    for (const def of Object.values(rank2)) {
      expect(def.rank).toBe(2);
    }
  });

  it('rank 3 cards all have rank 3', () => {
    for (const def of Object.values(rank3)) {
      expect(def.rank).toBe(3);
    }
  });

  it('replacement cards all have rank "replacement"', () => {
    for (const def of Object.values(replacement)) {
      expect(def.rank).toBe(CARD_RANKS.REPLACEMENT);
    }
  });

  it('all range patterns have valid cell types', () => {
    const validTypes = new Set([
      RANGE_CELL_TYPES.PAWN,
      RANGE_CELL_TYPES.ABILITY,
      RANGE_CELL_TYPES.BOTH,
    ]);
    for (const def of Object.values(allDefs)) {
      for (const cell of def.rangePattern) {
        expect(validTypes.has(cell.type)).toBe(true);
      }
    }
  });

  it('all cards have non-negative power', () => {
    for (const def of Object.values(allDefs)) {
      expect(def.power).toBeGreaterThanOrEqual(0);
    }
  });

  describe('token integrity', () => {
    it('every tokenDefinitionId in addCardToHand effects exists in game tokens', () => {
      const tokenIds = new Set(Object.keys(tokens));
      const missingTokens: string[] = [];

      for (const def of Object.values(allDefs)) {
        if (def.ability?.effect.type === 'addCardToHand') {
          const tokenId = (def.ability.effect as { tokenDefinitionId: string }).tokenDefinitionId;
          if (!tokenIds.has(tokenId)) {
            missingTokens.push(`${def.id} references token "${tokenId}"`);
          }
        }
      }

      expect(missingTokens).toEqual([]);
    });

    it('every tokenDefinitionId in spawnCard effects exists in game tokens', () => {
      const tokenIds = new Set(Object.keys(tokens));
      const missingTokens: string[] = [];

      for (const def of Object.values(allDefs)) {
        if (def.ability?.effect.type === 'spawnCard') {
          const tokenId = (def.ability.effect as { tokenDefinitionId: string }).tokenDefinitionId;
          if (!tokenIds.has(tokenId)) {
            missingTokens.push(`${def.id} references token "${tokenId}"`);
          }
        }
      }

      expect(missingTokens).toEqual([]);
    });
  });

  describe('ability validity', () => {
    const validTriggers: Set<string> = new Set(Object.values(ABILITY_TRIGGERS));
    const validEffectTypes: Set<string> = new Set(Object.values(EFFECT_TYPES));
    const validTargetTypes: Set<string> = new Set(Object.values(TARGET_SELECTORS));

    it('all abilities have valid triggers', () => {
      for (const def of Object.values(allDefs)) {
        if (def.ability) {
          expect(validTriggers.has(def.ability.trigger)).toBe(true);
        }
      }
    });

    it('all abilities have valid effect types', () => {
      for (const def of Object.values(allDefs)) {
        if (def.ability) {
          expect(validEffectTypes.has(def.ability.effect.type)).toBe(true);
        }
      }
    });

    it('all effects with targets have valid target types', () => {
      for (const def of Object.values(allDefs)) {
        if (def.ability) {
          const effect = def.ability.effect as { target?: { type: string } };
          if (effect.target) {
            expect(validTargetTypes.has(effect.target.type)).toBe(true);
          }
        }
      }
    });

    it('whenPowerReachesN abilities have a threshold', () => {
      for (const def of Object.values(allDefs)) {
        if (def.ability?.trigger === ABILITY_TRIGGERS.WHEN_POWER_REACHES_N) {
          expect(def.ability.threshold).toBeDefined();
          expect(def.ability.threshold).toBeGreaterThan(0);
        }
      }
    });
  });
});
