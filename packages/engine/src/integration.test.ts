import { describe, it, expect } from 'vitest';
import {
  createGame,
  mulligan,
  playCard,
  pass,
  getValidMoves,
  resolveRangePattern,
} from './game.js';
import { calculateLaneScores, calculateFinalScores, determineWinner } from './scoring.js';
import { createSeededRng } from './types.js';
import type { GameState } from './types.js';
import { buildTestDeck, getAllTestDefinitions } from './cards/test-cards.js';

const defs = getAllTestDefinitions();
const deck = buildTestDeck();

function seedRng(seed = 42) {
  return createSeededRng(seed);
}

function skipMulligan(state: GameState, seed = 99): GameState {
  const r = seedRng(seed);
  let s = mulligan(state, 0, [], r);
  s = mulligan(s, 1, [], r);
  return s;
}

describe('integration: full game flows', () => {
  it('both players pass immediately → draw, all lanes 0', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(1));
    state = skipMulligan(state);

    // Both pass
    state = pass(state); // P0
    state = pass(state); // P1

    expect(state.phase).toBe('ended');
    const scores = calculateFinalScores(state);
    expect(scores).toEqual([0, 0]);
    expect(determineWinner(scores)).toBeNull();
  });

  it('one card each → scoring works correctly', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(10));
    state = skipMulligan(state);

    // P0 plays in row 0
    const p0Card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, p0Card, { row: 0, col: 0 });

    // P1 plays in row 0
    const p1Card = state.players[1].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, p1Card, { row: 0, col: 4 });

    // Both pass to end
    state = pass(state); // P0
    state = pass(state); // P1
    expect(state.phase).toBe('ended');

    const laneScores = calculateLaneScores(state);
    const p0Power = defs[p0Card]!.power;
    const p1Power = defs[p1Card]!.power;

    // Both should have their power in lane 0
    expect(laneScores[0]![0]).toBe(p0Power);
    expect(laneScores[0]![1]).toBe(p1Power);

    const finalScores = calculateFinalScores(state);
    if (p0Power > p1Power) {
      expect(finalScores[0]).toBe(p0Power);
      expect(finalScores[1]).toBe(0);
      expect(determineWinner(finalScores)).toBe(0);
    } else if (p1Power > p0Power) {
      expect(finalScores[0]).toBe(0);
      expect(finalScores[1]).toBe(p1Power);
      expect(determineWinner(finalScores)).toBe(1);
    } else {
      expect(finalScores).toEqual([0, 0]);
      expect(determineWinner(finalScores)).toBeNull();
    }
  });

  it('pawn capture changes territory control', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(20));
    state = skipMulligan(state);

    // Find a card with range pattern that extends to the right (toward P1)
    // r1-cross places pawns in all 4 directions
    // Play it at center of P0's column
    const hasR1Cross = state.players[0].hand.includes('r1-cross');
    if (!hasR1Cross) {
      // Seed doesn't give us r1-cross, just check basic flow
      const card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
      state = playCard(state, card, { row: 1, col: 0 });
      expect(state.phase).toBe('playing');
      return;
    }

    state = playCard(state, 'r1-cross', { row: 1, col: 0 });

    // After placing cross at (1,0), pawns go to:
    // (0,0) — already P0, add pawn
    // (2,0) — already P0, add pawn
    // (1,-1) — invalid, skip
    // (1,1) — empty, P0 takes it
    const tile11 = state.board[1]![1]!;
    expect(tile11.owner).toBe(0);
    expect(tile11.pawnCount).toBe(1);
  });

  it('draw depletion — empty deck does not error', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(30));
    state = skipMulligan(state);

    // Play many turns to deplete decks
    let turns = 0;
    while (state.phase === 'playing' && turns < 40) {
      const moves = getValidMoves(state);
      if (moves.length > 0 && moves[0]!.positions.length > 0) {
        state = playCard(state, moves[0]!.cardId, moves[0]!.positions[0]!);
      } else {
        state = pass(state);
      }
      turns++;
    }

    // Game should end without throwing
    // Either both passed or board filled
    expect(['playing', 'ended']).toContain(state.phase);
  });

  it('mulligan changes hand composition deterministically', () => {
    const state = createGame(deck, deck, defs, undefined, seedRng(40));
    const originalHand = [...state.players[0].hand];

    // Mulligan returning 2 cards
    const toReturn = [originalHand[0]!, originalHand[1]!];
    const result = mulligan(state, 0, toReturn, seedRng(50));

    // Hand should still be 5 cards
    expect(result.players[0].hand).toHaveLength(5);
    // The 3 kept cards should remain
    expect(result.players[0].hand).toContain(originalHand[2]);
    expect(result.players[0].hand).toContain(originalHand[3]);
    expect(result.players[0].hand).toContain(originalHand[4]);

    // Doing the same mulligan with the same seed should give identical result
    const result2 = mulligan(state, 0, toReturn, seedRng(50));
    expect(result2.players[0].hand).toEqual(result.players[0].hand);
  });

  it('winning 1 lane with high score beats winning 2 lanes with low scores', () => {
    // Construct a scenario manually using game state manipulation
    // P0 has one card with power 15 in lane 0
    // P1 has cards with power 5 each in lanes 1 and 2
    let state = createGame(deck, deck, defs, undefined, seedRng(60));
    state = skipMulligan(state);

    // We'll use the scoring function directly with a crafted state
    // to verify the winner-take-all mechanism
    const crafted: GameState = {
      ...state,
      cardInstances: {
        '100': { instanceId: '100', definitionId: 'r3-power', owner: 0, position: { row: 0, col: 0 }, basePower: 15 },
        '101': { instanceId: '101', definitionId: 'r2-basic', owner: 1, position: { row: 1, col: 4 }, basePower: 5 },
        '102': { instanceId: '102', definitionId: 'r2-basic', owner: 1, position: { row: 2, col: 4 }, basePower: 5 },
      },
      board: state.board.map((row, r) =>
        row.map((tile, c) => {
          if (r === 0 && c === 0) return { ...tile, cardInstanceId: '100' };
          if (r === 1 && c === 4) return { ...tile, cardInstanceId: '101' };
          if (r === 2 && c === 4) return { ...tile, cardInstanceId: '102' };
          return tile;
        }),
      ),
    };

    const laneScores = calculateLaneScores(crafted);
    expect(laneScores[0]).toEqual([15, 0]); // Lane 0: P0 wins
    expect(laneScores[1]).toEqual([0, 5]);  // Lane 1: P1 wins
    expect(laneScores[2]).toEqual([0, 5]);  // Lane 2: P1 wins

    const finalScores = calculateFinalScores(crafted);
    expect(finalScores).toEqual([15, 10]);
    expect(determineWinner(finalScores)).toBe(0); // P0 wins despite only winning 1 lane
  });

  it('full action log correctness', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(70));
    state = skipMulligan(state);

    const card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, card, { row: 0, col: 0 });
    state = pass(state); // P1 passes
    state = pass(state); // P0 passes → game ends

    expect(state.phase).toBe('ended');

    // Verify log has expected action types in order
    const actionTypes = state.log.map(a => a.type);

    // Should contain: drawCard (initial), mulligan, drawCard (turn draws), placeCard, pass, pass
    expect(actionTypes).toContain('drawCard');
    expect(actionTypes).toContain('mulligan');
    expect(actionTypes).toContain('placeCard');
    expect(actionTypes).toContain('pass');

    // Pass actions should be the last two non-draw actions
    const passActions = state.log.filter(a => a.type === 'pass');
    expect(passActions).toHaveLength(2);
  });

  it('getValidMoves reflects board state after pawn placement', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(80));
    state = skipMulligan(state);

    // Initially P0 can only play on col 0
    const initialMoves = getValidMoves(state);
    for (const move of initialMoves) {
      for (const pos of move.positions) {
        expect(pos.col).toBe(0);
      }
    }

    // Play a cross card to extend territory
    const hasR1Cross = state.players[0].hand.includes('r1-cross');
    if (!hasR1Cross) return;

    state = playCard(state, 'r1-cross', { row: 1, col: 0 });
    // P1's turn now; P1 passes
    state = pass(state);

    // P0's turn again — should now have positions in col 1 too (from pawn at 1,1)
    const newMoves = getValidMoves(state);
    const allPositions = newMoves.flatMap(m => m.positions);
    const hasColl1 = allPositions.some(p => p.col === 1);
    expect(hasColl1).toBe(true);
  });

  it('range pattern mirroring symmetry for player 1', () => {
    // P0: col + offset.col
    // P1: col - offset.col
    const pattern = [
      { row: 0, col: 1, type: 'pawn' as const },
      { row: 0, col: 2, type: 'pawn' as const },
      { row: -1, col: 1, type: 'pawn' as const },
    ];

    // P0 at (1, 1)
    const p0Positions = resolveRangePattern(pattern, { row: 1, col: 1 }, 0);
    expect(p0Positions).toContainEqual({ row: 1, col: 2 });
    expect(p0Positions).toContainEqual({ row: 1, col: 3 });
    expect(p0Positions).toContainEqual({ row: 0, col: 2 });

    // P1 at (1, 3) — should mirror columns
    const p1Positions = resolveRangePattern(pattern, { row: 1, col: 3 }, 1);
    expect(p1Positions).toContainEqual({ row: 1, col: 2 }); // 3 - 1
    expect(p1Positions).toContainEqual({ row: 1, col: 1 }); // 3 - 2
    expect(p1Positions).toContainEqual({ row: 0, col: 2 }); // 3 - 1

    // The patterns should be symmetric around the board center
  });

  it('replacement card flow: destroy and replace', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(90));
    state = skipMulligan(state);

    // P0 plays a rank 1 card
    const rank1Card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    const oldInstanceId = state.board[0]![0]!.cardInstanceId!;

    // P1 passes
    state = pass(state);

    // Check if P0 has replacement card
    if (!state.players[0].hand.includes('replacement')) return;

    // P0 plays replacement card on the same tile
    state = playCard(state, 'replacement', { row: 0, col: 0 });

    // Old card should be destroyed
    expect(state.cardInstances[oldInstanceId]).toBeUndefined();

    // New card should be in place
    const newTile = state.board[0]![0]!;
    expect(newTile.cardInstanceId).not.toBeNull();
    const newInstance = state.cardInstances[newTile.cardInstanceId!]!;
    expect(newInstance.definitionId).toBe('replacement');
    expect(newInstance.basePower).toBe(6);

    // Destroy log should exist
    const destroyLogs = state.log.filter(a => a.type === 'destroyCard');
    expect(destroyLogs.length).toBeGreaterThanOrEqual(1);
  });
});

describe('integration: edge cases', () => {
  it('game state is immutable — original not mutated', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(100));
    state = skipMulligan(state);

    const original = state;
    const card = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    const after = playCard(state, card, { row: 0, col: 0 });

    // Original state unchanged
    expect(original.players[0].hand).toContain(card);
    expect(after.players[0].hand).not.toContain(card);
    expect(original.board[0]![0]!.cardInstanceId).toBeNull();
    expect(after.board[0]![0]!.cardInstanceId).not.toBeNull();
  });

  it('cannot play card after game ends', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(110));
    state = skipMulligan(state);
    state = pass(state);
    state = pass(state);
    expect(state.phase).toBe('ended');

    const card = state.players[0].hand.find(id => defs[id]?.rank === 1);
    if (card) {
      expect(() => playCard(state, card, { row: 0, col: 0 })).toThrow();
    }
  });

  it('cannot pass after game ends', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(120));
    state = skipMulligan(state);
    state = pass(state);
    state = pass(state);
    expect(() => pass(state)).toThrow();
  });

  it('turn number advances correctly through multiple plays', () => {
    let state = createGame(deck, deck, defs, undefined, seedRng(130));
    state = skipMulligan(state);
    expect(state.turnNumber).toBe(1);

    const card0 = state.players[0].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, card0, { row: 0, col: 0 });
    expect(state.turnNumber).toBe(2);

    const card1 = state.players[1].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, card1, { row: 0, col: 4 });
    expect(state.turnNumber).toBe(3);
  });

  it('playing with configurable first player', () => {
    let state = createGame(deck, deck, defs, { firstPlayer: 1 }, seedRng(140));
    expect(state.currentPlayerIndex).toBe(1);

    const r = seedRng(99);
    state = mulligan(state, 0, [], r);
    state = mulligan(state, 1, [], r);
    expect(state.currentPlayerIndex).toBe(1);

    const card = state.players[1].hand.find(id => defs[id]?.rank === 1)!;
    state = playCard(state, card, { row: 0, col: 4 });
    expect(state.currentPlayerIndex).toBe(0);
  });
});
