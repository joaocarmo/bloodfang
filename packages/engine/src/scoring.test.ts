import { describe, it, expect } from 'vitest';
import { calculateLaneScores, calculateFinalScores, determineWinner } from './scoring.js';
import { createGame, mulligan, playCard, pass } from './game.js';
import { createSeededRng } from './types.js';
import type { GameState } from './types.js';
import { buildTestDeck, getAllTestDefinitions } from './cards/test-cards.js';

const defs = getAllTestDefinitions();
const deck = buildTestDeck();

function seedRng(seed = 42) {
  return createSeededRng(seed);
}

function createPlayingGame(seed = 42): GameState {
  let state = createGame(deck, deck, defs, undefined, seedRng(seed));
  const r = seedRng(99);
  state = mulligan(state, 0, [], r);
  state = mulligan(state, 1, [], r);
  return state;
}

describe('calculateLaneScores', () => {
  it('returns all zeros when no cards are placed', () => {
    const state = createPlayingGame();
    const scores = calculateLaneScores(state);
    expect(scores).toEqual([[0, 0], [0, 0], [0, 0]]);
  });

  it('counts card power in correct lane', () => {
    let state = createPlayingGame();
    const rank1Card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });

    const scores = calculateLaneScores(state);
    const def = defs[rank1Card]!;
    expect(scores[0]![0]).toBe(def.power); // P0's score in lane 0
    expect(scores[0]![1]).toBe(0); // P1 has nothing in lane 0
  });

  it('sums multiple cards in same lane', () => {
    let state = createPlayingGame();

    // P0 plays a card in row 0
    const p0Card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, p0Card, { row: 0, col: 0 });

    // P1 plays a card in row 0
    const p1Card = state.players[1].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, p1Card, { row: 0, col: 4 });

    const scores = calculateLaneScores(state);
    expect(scores[0]![0]).toBe(defs[p0Card]!.power);
    expect(scores[0]![1]).toBe(defs[p1Card]!.power);
  });
});

describe('calculateFinalScores', () => {
  it('returns all zeros when no cards placed', () => {
    const state = createPlayingGame();
    const scores = calculateFinalScores(state);
    expect(scores).toEqual([0, 0]);
  });

  it('winner takes lane, loser gets 0', () => {
    let state = createPlayingGame();
    // P0 places a card, P1 doesn't in that lane
    const p0Card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, p0Card, { row: 0, col: 0 });

    const scores = calculateFinalScores(state);
    expect(scores[0]).toBe(defs[p0Card]!.power);
    expect(scores[1]).toBe(0);
  });

  it('tied lane gives both 0', () => {
    let state = createPlayingGame();

    // Play same-power cards in same lane
    const p0Card = state.players[0].hand.find(id => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    state = playCard(state, p0Card, { row: 0, col: 0 });

    // Find a P1 card with same power
    const p0Power = defs[p0Card]!.power;
    const p1Card = state.players[1].hand.find(id => {
      const d = defs[id];
      return d && d.rank === 1 && d.power === p0Power;
    });

    if (p1Card) {
      state = playCard(state, p1Card, { row: 0, col: 4 });
      const scores = calculateFinalScores(state);
      // Lane 0 is tied, so both get 0 for that lane
      expect(scores[0]).toBe(0);
      expect(scores[1]).toBe(0);
    }
  });

  it('sums across lanes for winner', () => {
    let state = createPlayingGame();
    // P0 plays cards in rows 0 and 1
    const p0Cards = state.players[0].hand.filter(id => defs[id]?.rank === 1);
    if (p0Cards.length >= 2) {
      state = playCard(state, p0Cards[0]!, { row: 0, col: 0 });
      // P1 passes
      state = pass(state);
      state = playCard(state, p0Cards[1]!, { row: 1, col: 0 });

      const scores = calculateFinalScores(state);
      const expected = defs[p0Cards[0]!]!.power + defs[p0Cards[1]!]!.power;
      expect(scores[0]).toBe(expected);
    }
  });
});

describe('determineWinner', () => {
  it('returns 0 when P0 has higher score', () => {
    expect(determineWinner([10, 5])).toBe(0);
  });

  it('returns 1 when P1 has higher score', () => {
    expect(determineWinner([3, 8])).toBe(1);
  });

  it('returns null on tie', () => {
    expect(determineWinner([5, 5])).toBeNull();
  });

  it('returns null when both are 0', () => {
    expect(determineWinner([0, 0])).toBeNull();
  });
});
