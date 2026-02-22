import type { CardDefinition } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

// ── Token Cards ───────────────────────────────────────────────────────

export const basicToken: CardDefinition = {
  id: 'token-basic',
  rank: 1,
  power: 1,
  rangePattern: [],
  isToken: true,
};

export const strongToken: CardDefinition = {
  id: 'token-strong',
  rank: 1,
  power: 3,
  rangePattern: [],
  isToken: true,
};

export const rangedToken: CardDefinition = {
  id: 'token-ranged',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: 'pawn' }],
  isToken: true,
};

// ── Helpers ───────────────────────────────────────────────────────────

const ALL_TOKEN_CARDS: readonly CardDefinition[] = [basicToken, strongToken, rangedToken];

export function getAllTokenDefinitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_TOKEN_CARDS);
}
