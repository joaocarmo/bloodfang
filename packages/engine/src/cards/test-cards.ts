import type { CardDefinition } from '../types.js';

// ── Test Cards ─────────────────────────────────────────────────────────

export const r1Basic: CardDefinition = {
  id: 'r1-basic',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: 'pawn' }], // 1 cell forward (up)
};

export const r1Cross: CardDefinition = {
  id: 'r1-cross',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
};

export const r1Forward2: CardDefinition = {
  id: 'r1-forward2',
  rank: 1,
  power: 1,
  rangePattern: [{ row: -1, col: 0, type: 'pawn' }, { row: -2, col: 0, type: 'pawn' }],
};

export const r2Basic: CardDefinition = {
  id: 'r2-basic',
  rank: 2,
  power: 5,
  rangePattern: [{ row: -1, col: 0, type: 'pawn' }],
};

export const r2Wide: CardDefinition = {
  id: 'r2-wide',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
};

export const r3Power: CardDefinition = {
  id: 'r3-power',
  rank: 3,
  power: 8,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
};

export const r1Empty: CardDefinition = {
  id: 'r1-empty',
  rank: 1,
  power: 3,
  rangePattern: [],
};

export const r1AbilityCell: CardDefinition = {
  id: 'r1-ability-cell',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: 'ability' }],
};

export const r1BothCell: CardDefinition = {
  id: 'r1-both-cell',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -1, col: 0, type: 'both' }],
};

export const replacement: CardDefinition = {
  id: 'replacement',
  rank: 'replacement',
  power: 6,
  rangePattern: [],
};

// ── Fillers (deck padding) ─────────────────────────────────────────────

export const filler1: CardDefinition = { id: 'filler-1', rank: 1, power: 1, rangePattern: [] };
export const filler2: CardDefinition = { id: 'filler-2', rank: 1, power: 1, rangePattern: [] };
export const filler3: CardDefinition = { id: 'filler-3', rank: 1, power: 1, rangePattern: [] };
export const filler4: CardDefinition = { id: 'filler-4', rank: 1, power: 1, rangePattern: [] };
export const filler5: CardDefinition = { id: 'filler-5', rank: 1, power: 1, rangePattern: [] };

// ── Helpers ────────────────────────────────────────────────────────────

const ALL_TEST_CARDS: readonly CardDefinition[] = [
  r1Basic, r1Cross, r1Forward2, r2Basic, r2Wide,
  r3Power, r1Empty, r1AbilityCell, r1BothCell, replacement,
  filler1, filler2, filler3, filler4, filler5,
];

export function getAllTestDefinitions(): Record<string, CardDefinition> {
  const defs: Record<string, CardDefinition> = {};
  for (const card of ALL_TEST_CARDS) {
    defs[card.id] = card;
  }
  return defs;
}

export function buildTestDeck(): string[] {
  return ALL_TEST_CARDS.map(c => c.id);
}
