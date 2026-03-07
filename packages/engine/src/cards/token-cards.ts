import type { CardDefinition } from '../types.js';
import { RANGE_CELL_TYPES } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

function testCard(def: Omit<CardDefinition, 'id'> & { id: string }): CardDefinition {
  return def as CardDefinition;
}

// ── Token Cards ───────────────────────────────────────────────────────

export const basicToken = testCard({
  id: 'token-basic',
  rank: 1,
  power: 1,
  rangePattern: [],
  isToken: true,
});
export const strongToken = testCard({
  id: 'token-strong',
  rank: 1,
  power: 3,
  rangePattern: [],
  isToken: true,
});
export const rangedToken = testCard({
  id: 'token-ranged',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN }],
  isToken: true,
}); // ── Helpers ───────────────────────────────────────────────────────────

const ALL_TOKEN_CARDS: readonly CardDefinition[] = [basicToken, strongToken, rangedToken];

export function getAllTokenDefinitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_TOKEN_CARDS);
}
