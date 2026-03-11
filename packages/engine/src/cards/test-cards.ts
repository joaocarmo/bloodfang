import type { CardId } from '../card-id.js';
import type { Board, CardDefinition, Tile } from '../types.js';
import { CARD_RANKS, RANGE_CELL_TYPES } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

/** Assert a value is defined and return it (for test assertions). */
export function defined<T>(value: T | undefined | null, msg = 'Expected defined value'): T {
  if (value == null) throw new Error(msg);
  return value;
}

/** Safely access a board cell in tests, throwing if out of bounds. */
export function cell(board: Board, row: number, col: number): Tile {
  const r = board[row];
  if (!r) throw new Error(`Row ${String(row)} out of bounds`);
  const c = r[col];
  if (!c) throw new Error(`Col ${String(col)} out of bounds`);
  return c;
}

/** Cast a string to CardId for test purposes (test-only card IDs not in the union). */
export function testCardId(id: string): CardId {
  return id as CardId;
}

// Test cards use fake IDs not in CardId — cast is intentional.
function testCard(def: Omit<CardDefinition, 'id'> & { id: string }): CardDefinition {
  return def as CardDefinition;
}

// ── Test Cards ─────────────────────────────────────────────────────────

export const r1Basic = testCard({
  id: 'r1-basic',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN }], // 1 cell forward (up)
});
export const r1Cross = testCard({
  id: 'r1-cross',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
});
export const r1Forward2 = testCard({
  id: 'r1-forward2',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
});
export const r2Basic = testCard({
  id: 'r2-basic',
  rank: 2,
  power: 5,
  rangePattern: [{ row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN }],
});
export const r2Wide = testCard({
  id: 'r2-wide',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
});
export const r3Power = testCard({
  id: 'r3-power',
  rank: 3,
  power: 8,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
});
export const r1Empty = testCard({
  id: 'r1-empty',
  rank: 1,
  power: 3,
  rangePattern: [],
});
export const r1AbilityCell = testCard({
  id: 'r1-ability-cell',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY }],
});
export const r1BothCell = testCard({
  id: 'r1-both-cell',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH }],
});
export const replacement = testCard({
  id: 'replacement',
  rank: CARD_RANKS.REPLACEMENT,
  power: 6,
  rangePattern: [],
});
// ── Fillers (deck padding) ─────────────────────────────────────────────

export const filler1 = testCard({ id: 'filler-1', rank: 1, power: 1, rangePattern: [] });
export const filler2 = testCard({ id: 'filler-2', rank: 1, power: 1, rangePattern: [] });
export const filler3 = testCard({ id: 'filler-3', rank: 1, power: 1, rangePattern: [] });
export const filler4 = testCard({ id: 'filler-4', rank: 1, power: 1, rangePattern: [] });
export const filler5 = testCard({ id: 'filler-5', rank: 1, power: 1, rangePattern: [] });

// ── Helpers ────────────────────────────────────────────────────────────

const ALL_TEST_CARDS: readonly CardDefinition[] = [
  r1Basic,
  r1Cross,
  r1Forward2,
  r2Basic,
  r2Wide,
  r3Power,
  r1Empty,
  r1AbilityCell,
  r1BothCell,
  replacement,
  filler1,
  filler2,
  filler3,
  filler4,
  filler5,
];

export function getAllTestDefinitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_TEST_CARDS);
}

export function buildTestDeck(): CardId[] {
  return ALL_TEST_CARDS.map((c) => c.id);
}
