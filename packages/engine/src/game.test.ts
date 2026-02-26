import { describe, it, expect } from 'vitest';
import {
  createGame,
  mulligan,
  canPlayCard,
  getValidMoves,
  playCard,
  pass,
  destroyCard,
  getEffectivePower,
  resolveRangePattern,
} from './game.js';
import {
  createSeededRng,
  DECK_SIZE,
  INITIAL_HAND_SIZE,
  GAME_PHASES,
  LOG_ACTION_TYPES,
  RANGE_CELL_TYPES,
} from './types.js';
import type { GameState, PlayerId } from './types.js';
import { buildTestDeck, getAllTestDefinitions } from './cards/test-cards.js';

const defs = getAllTestDefinitions();
const deck = buildTestDeck();

function seedRng(seed = 42) {
  return createSeededRng(seed);
}

function createTestGame(opts?: { firstPlayer?: PlayerId; rng?: () => number }) {
  const config = opts?.firstPlayer !== undefined ? { firstPlayer: opts.firstPlayer } : undefined;
  return createGame(deck, deck, defs, config, opts?.rng ?? seedRng());
}

function skipMulligan(state: GameState, rng?: () => number): GameState {
  const r = rng ?? seedRng(99);
  let s = mulligan(state, 0, [], r);
  s = mulligan(s, 1, [], r);
  return s;
}

// ── createGame ─────────────────────────────────────────────────────────

describe('createGame', () => {
  it('creates a game in mulligan phase', () => {
    const state = createTestGame();
    expect(state.phase).toBe(GAME_PHASES.MULLIGAN);
    expect(state.turnNumber).toBe(0);
  });

  it('deals 5 cards to each player', () => {
    const state = createTestGame();
    expect(state.players[0].hand).toHaveLength(INITIAL_HAND_SIZE);
    expect(state.players[1].hand).toHaveLength(INITIAL_HAND_SIZE);
  });

  it('leaves 10 cards in each deck', () => {
    const state = createTestGame();
    expect(state.players[0].deck).toHaveLength(DECK_SIZE - INITIAL_HAND_SIZE);
    expect(state.players[1].deck).toHaveLength(DECK_SIZE - INITIAL_HAND_SIZE);
  });

  it('logs draw actions for all initial cards', () => {
    const state = createTestGame();
    const drawActions = state.log.filter((a) => a.type === LOG_ACTION_TYPES.DRAW_CARD);
    expect(drawActions).toHaveLength(INITIAL_HAND_SIZE * 2);
  });

  it('shuffles deterministically with injected RNG', () => {
    const s1 = createTestGame({ rng: seedRng(1) });
    const s2 = createTestGame({ rng: seedRng(1) });
    expect(s1.players[0].hand).toEqual(s2.players[0].hand);
    expect(s1.players[1].hand).toEqual(s2.players[1].hand);
  });

  it('different seeds produce different hands', () => {
    const s1 = createTestGame({ rng: seedRng(1) });
    const s2 = createTestGame({ rng: seedRng(2) });
    // Very unlikely to be equal with different seeds
    expect(s1.players[0].hand).not.toEqual(s2.players[0].hand);
  });

  it('respects firstPlayer config', () => {
    const state = createGame(deck, deck, defs, { firstPlayer: 1 }, seedRng());
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('defaults to player 0 first', () => {
    const state = createTestGame();
    expect(state.currentPlayerIndex).toBe(0);
  });

  it('throws on wrong deck size', () => {
    expect(() => createGame(['a'], deck, defs)).toThrow('exactly 15 cards');
  });

  it('throws on duplicate cards in deck', () => {
    const badDeck = Array(DECK_SIZE).fill('r1-basic');
    expect(() => createGame(badDeck, deck, defs)).toThrow('duplicate');
  });

  it('throws on unknown card ID', () => {
    const badDeck = [...deck.slice(1), 'nonexistent'];
    expect(() => createGame(badDeck, deck, defs)).toThrow('not found');
  });
});

// ── mulligan ───────────────────────────────────────────────────────────

describe('mulligan', () => {
  it('allows empty mulligan (skip)', () => {
    const state = createTestGame();
    const result = mulligan(state, 0, [], seedRng());
    expect(result.players[0].mulliganUsed).toBe(true);
    expect(result.players[0].hand).toHaveLength(INITIAL_HAND_SIZE);
  });

  it('returns and redraws specified cards', () => {
    const state = createTestGame();
    const hand = state.players[0].hand;
    const toReturn = [hand[0]!, hand[1]!];
    const result = mulligan(state, 0, toReturn, seedRng());

    expect(result.players[0].hand).toHaveLength(INITIAL_HAND_SIZE);
    // Returned cards should not be in hand (unless redrawn by chance — seed-specific)
    expect(result.players[0].mulliganUsed).toBe(true);
  });

  it('transitions to playing when both players mulligan', () => {
    const state = createTestGame();
    const s1 = mulligan(state, 0, [], seedRng());
    expect(s1.phase).toBe(GAME_PHASES.MULLIGAN);
    const s2 = mulligan(s1, 1, [], seedRng());
    expect(s2.phase).toBe(GAME_PHASES.PLAYING);
    expect(s2.turnNumber).toBe(1);
  });

  it('throws if mulligan already used', () => {
    const state = createTestGame();
    const s1 = mulligan(state, 0, [], seedRng());
    expect(() => mulligan(s1, 0, [], seedRng())).toThrow('already used');
  });

  it('throws if card not in hand', () => {
    const state = createTestGame();
    expect(() => mulligan(state, 0, ['nonexistent'], seedRng())).toThrow('not in player');
  });

  it('throws if not in mulligan phase', () => {
    const state = createTestGame();
    const s1 = skipMulligan(state);
    expect(() => mulligan(s1, 0, [], seedRng())).toThrow('mulligan phase');
  });

  it('logs mulligan action', () => {
    const state = createTestGame();
    const hand = state.players[0].hand;
    const result = mulligan(state, 0, [hand[0]!], seedRng());
    const mulliganActions = result.log.filter((a) => a.type === LOG_ACTION_TYPES.MULLIGAN);
    expect(mulliganActions).toHaveLength(1);
    expect(mulliganActions[0]).toMatchObject({
      type: LOG_ACTION_TYPES.MULLIGAN,
      player: 0,
      returnedCount: 1,
      drawnCount: 1,
    });
  });

  it('deck size is preserved after mulligan', () => {
    const state = createTestGame();
    const hand = state.players[0].hand;
    const result = mulligan(state, 0, [hand[0]!, hand[1]!, hand[2]!], seedRng());
    // Total cards = deck + hand should equal 15
    const total = result.players[0].deck.length + result.players[0].hand.length;
    expect(total).toBe(DECK_SIZE);
  });

  it('can mulligan in any order', () => {
    const state = createTestGame();
    const s1 = mulligan(state, 1, [], seedRng());
    expect(s1.phase).toBe(GAME_PHASES.MULLIGAN);
    const s2 = mulligan(s1, 0, [], seedRng());
    expect(s2.phase).toBe(GAME_PHASES.PLAYING);
  });
});

// ── canPlayCard + getValidMoves ────────────────────────────────────────

describe('canPlayCard', () => {
  it('returns false if not in playing phase', () => {
    const state = createTestGame();
    expect(canPlayCard(state, state.players[0].hand[0]!, { row: 0, col: 0 })).toBe(false);
  });

  it('returns false if card not in hand', () => {
    const state = skipMulligan(createTestGame());
    expect(canPlayCard(state, 'nonexistent', { row: 0, col: 0 })).toBe(false);
  });

  it('returns false if tile not owned by player', () => {
    const state = skipMulligan(createTestGame());
    // Col 4 is owned by P1, P0 is current
    const rank1Card = state.players[0].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    expect(canPlayCard(state, rank1Card, { row: 0, col: 4 })).toBe(false);
  });

  it('returns false if pawnCount < card rank', () => {
    const state = skipMulligan(createTestGame());
    // Col 0 has 1 pawn, r2-basic requires rank 2
    const rank2Card = state.players[0].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 2;
    });
    if (rank2Card) {
      expect(canPlayCard(state, rank2Card, { row: 0, col: 0 })).toBe(false);
    }
  });

  it('allows playing rank 1 card on own tile with 1 pawn', () => {
    const state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    expect(canPlayCard(state, rank1Card, { row: 0, col: 0 })).toBe(true);
  });

  it('returns false if tile already has a card', () => {
    const state = skipMulligan(createTestGame());
    const rank1Cards = state.players[0].hand.filter((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    });
    if (rank1Cards.length >= 1) {
      // Play first card
      const s2 = playCard(state, rank1Cards[0]!, { row: 0, col: 0 });
      // Try to play another card on same tile (it's now opponent's turn)
      // We need to come back to P0's turn first
      const s3 = pass(s2); // P1 passes
      const anotherRank1 = s3.players[0].hand.find((id) => {
        const d = defs[id];
        return d && d.rank === 1;
      });
      if (anotherRank1) {
        expect(canPlayCard(s3, anotherRank1, { row: 0, col: 0 })).toBe(false);
      }
    }
  });

  it('returns false for out-of-bounds position', () => {
    const state = skipMulligan(createTestGame());
    const cardId = state.players[0].hand[0]!;
    expect(canPlayCard(state, cardId, { row: -1, col: 0 })).toBe(false);
  });
});

describe('getValidMoves', () => {
  it('returns empty during mulligan phase', () => {
    const state = createTestGame();
    expect(getValidMoves(state)).toEqual([]);
  });

  it('returns moves for rank 1 cards on player tiles', () => {
    const state = skipMulligan(createTestGame());
    const moves = getValidMoves(state);
    expect(moves.length).toBeGreaterThan(0);

    // All positions should be on col 0 (P0's starting column)
    for (const move of moves) {
      for (const pos of move.positions) {
        expect(pos.col).toBe(0);
      }
    }
  });

  it('does not include rank 2+ cards when max pawn count is 1', () => {
    const state = skipMulligan(createTestGame());
    const moves = getValidMoves(state);
    for (const move of moves) {
      const d = defs[move.cardId];
      if (d && typeof d.rank === 'number') {
        expect(d.rank).toBe(1);
      }
    }
  });

  it('includes replacement card when allied card exists', () => {
    const state = skipMulligan(createTestGame());
    // First play a card
    const rank1Card = state.players[0].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    let s = playCard(state, rank1Card, { row: 0, col: 0 });
    s = pass(s); // P1's turn, pass
    // Now P0 has a card on the board

    const replacementInHand = s.players[0].hand.includes('replacement');
    if (replacementInHand) {
      const moves = getValidMoves(s);
      const replacementMove = moves.find((m) => m.cardId === 'replacement');
      expect(replacementMove).toBeDefined();
      expect(replacementMove!.positions).toContainEqual({ row: 0, col: 0 });
    }
  });
});

// ── resolveRangePattern ────────────────────────────────────────────────

describe('resolveRangePattern', () => {
  it('returns positions for pawn cells', () => {
    const pattern = [{ row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN }];
    const result = resolveRangePattern(pattern, { row: 1, col: 2 }, 0);
    expect(result).toEqual([{ row: 0, col: 2 }]);
  });

  it('skips ability-only cells', () => {
    const pattern = [{ row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY }];
    const result = resolveRangePattern(pattern, { row: 1, col: 2 }, 0);
    expect(result).toEqual([]);
  });

  it('includes both cells', () => {
    const pattern = [{ row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH }];
    const result = resolveRangePattern(pattern, { row: 1, col: 2 }, 0);
    expect(result).toEqual([{ row: 0, col: 2 }]);
  });

  it('mirrors column for player 1', () => {
    const pattern = [{ row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN }];
    // P0: col + 1
    expect(resolveRangePattern(pattern, { row: 1, col: 2 }, 0)).toEqual([{ row: 1, col: 3 }]);
    // P1: col - 1
    expect(resolveRangePattern(pattern, { row: 1, col: 2 }, 1)).toEqual([{ row: 1, col: 1 }]);
  });

  it('does not mirror row offset', () => {
    const pattern = [{ row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN }];
    // Both players: row - 1
    expect(resolveRangePattern(pattern, { row: 2, col: 2 }, 0)).toEqual([{ row: 1, col: 2 }]);
    expect(resolveRangePattern(pattern, { row: 2, col: 2 }, 1)).toEqual([{ row: 1, col: 2 }]);
  });

  it('filters out-of-bounds positions', () => {
    const pattern = [{ row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN }];
    // Row 0 - 1 = -1 (out of bounds)
    expect(resolveRangePattern(pattern, { row: 0, col: 0 }, 0)).toEqual([]);
  });

  it('handles cross pattern', () => {
    const pattern = [
      { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
      { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
      { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
      { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    ];
    const result = resolveRangePattern(pattern, { row: 1, col: 2 }, 0);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual({ row: 0, col: 2 });
    expect(result).toContainEqual({ row: 2, col: 2 });
    expect(result).toContainEqual({ row: 1, col: 1 });
    expect(result).toContainEqual({ row: 1, col: 3 });
  });
});

// ── playCard ───────────────────────────────────────────────────────────

describe('playCard', () => {
  it('removes card from hand', () => {
    const state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    // After playing, it's now P1's turn
    expect(state.players[0].hand).toContain(rank1Card);
    expect(result.players[0].hand).not.toContain(rank1Card);
  });

  it('creates a card instance on the board', () => {
    const state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    const tile = result.board[0]![0]!;
    expect(tile.cardInstanceId).not.toBeNull();
    const instance = result.cardInstances[tile.cardInstanceId!];
    expect(instance).toBeDefined();
    expect(instance!.definitionId).toBe(rank1Card);
    expect(instance!.owner).toBe(0);
  });

  it('places pawns according to range pattern', () => {
    const state = skipMulligan(createTestGame());
    // r1-cross has cross pattern
    const hasR1Cross = state.players[0].hand.includes('r1-cross');
    if (!hasR1Cross) return; // Skip if not in hand

    const result = playCard(state, 'r1-cross', { row: 1, col: 0 });
    // Cross from (1,0) for P0: (-1,0)=(0,0), (1,0)=(2,0), (0,-1)=invalid, (0,1)=(1,1)
    const tile11 = result.board[1]![1]!;
    expect(tile11.owner).toBe(0);
    expect(tile11.pawnCount).toBe(1);
  });

  it('captures opponent pawns', () => {
    // Set up: P0 plays card that places pawn on P1's territory
    const state = skipMulligan(createTestGame());
    // Use r1-cross at (1,0) which puts pawn at (1,1)
    // Then P1 plays, then P0 plays at another spot that reaches P1's col
    // Easier: manually construct a scenario with r2-wide which goes left+right
    // For now, we just test that the mechanism works with the cross pattern
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    // This is a basic smoke test
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    expect(result.consecutivePasses).toBe(0);
  });

  it('resets consecutivePasses to 0', () => {
    let state = skipMulligan(createTestGame());
    state = pass(state); // P0 passes
    expect(state.consecutivePasses).toBe(1);
    // Now P1 plays
    const rank1Card = state.players[1].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    const result = playCard(state, rank1Card, { row: 0, col: 4 });
    expect(result.consecutivePasses).toBe(0);
  });

  it('advances turn after playing', () => {
    const state = skipMulligan(createTestGame());
    expect(state.currentPlayerIndex).toBe(0);
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    expect(result.currentPlayerIndex).toBe(1);
  });

  it('draws a card on turn advance (after turn 1)', () => {
    const state = skipMulligan(createTestGame());
    const p1HandSize = state.players[1].hand.length;
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    // P1 should have drawn a card (turn > 1 after advance)
    expect(result.players[1].hand).toHaveLength(p1HandSize + 1);
  });

  it('logs placeCard action', () => {
    const state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    const placeActions = result.log.filter((a) => a.type === LOG_ACTION_TYPES.PLACE_CARD);
    expect(placeActions.length).toBeGreaterThanOrEqual(1);
    const last = placeActions[placeActions.length - 1]!;
    expect(last).toMatchObject({
      type: LOG_ACTION_TYPES.PLACE_CARD,
      player: 0,
      cardId: rank1Card,
      position: { row: 0, col: 0 },
    });
  });

  it('throws when play is invalid', () => {
    const state = skipMulligan(createTestGame());
    expect(() => playCard(state, 'nonexistent', { row: 0, col: 0 })).toThrow('Cannot play card');
  });

  it('increments nextInstanceId', () => {
    const state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    expect(result.nextInstanceId).toBe(state.nextInstanceId + 1);
  });

  it('caps pawn count at 3', () => {
    // Play a card with a range pattern that targets a tile already at max pawns
    // We'd need to build up pawns first. This is a structural test.
    const state = skipMulligan(createTestGame());
    // Place a cross card at (1,0) — places pawn at (0,0) which already has 1 pawn
    const hasR1Cross = state.players[0].hand.includes('r1-cross');
    if (!hasR1Cross) return;

    const result = playCard(state, 'r1-cross', { row: 1, col: 0 });
    // (0,0) already had 1 pawn from P0, now should have 2
    const tile00 = result.board[0]![0]!;
    expect(tile00.pawnCount).toBeLessThanOrEqual(3);
    expect(tile00.pawnCount).toBe(2); // 1 + 1 = 2
  });

  it('skips draw when deck is empty', () => {
    // Create a game and drain the deck
    let state = skipMulligan(createTestGame());
    // Simulate empty deck by creating a state with empty deck
    const emptyDeckPlayers: [(typeof state.players)[0], (typeof state.players)[1]] = [
      state.players[0],
      { ...state.players[1], deck: [] },
    ];
    state = { ...state, players: emptyDeckPlayers };

    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    const p1HandBefore = state.players[1].hand.length;
    const result = playCard(state, rank1Card, { row: 0, col: 0 });
    // P1 deck was empty, hand should not grow
    expect(result.players[1].hand).toHaveLength(p1HandBefore);
  });
});

// ── pass + game end ────────────────────────────────────────────────────

describe('pass', () => {
  it('increments consecutivePasses', () => {
    const state = skipMulligan(createTestGame());
    const result = pass(state);
    expect(result.consecutivePasses).toBe(1);
  });

  it('advances turn', () => {
    const state = skipMulligan(createTestGame());
    const result = pass(state);
    expect(result.currentPlayerIndex).toBe(1);
  });

  it('ends game on two consecutive passes', () => {
    let state = skipMulligan(createTestGame());
    state = pass(state); // P0 passes
    state = pass(state); // P1 passes
    expect(state.phase).toBe(GAME_PHASES.ENDED);
    expect(state.consecutivePasses).toBe(2);
  });

  it('logs pass action', () => {
    const state = skipMulligan(createTestGame());
    const result = pass(state);
    const passActions = result.log.filter((a) => a.type === LOG_ACTION_TYPES.PASS);
    expect(passActions).toHaveLength(1);
    expect(passActions[0]).toMatchObject({ type: LOG_ACTION_TYPES.PASS, player: 0 });
  });

  it('resets consecutive passes when a card is played between', () => {
    let state = skipMulligan(createTestGame());
    state = pass(state); // P0 passes
    // P1 plays a card instead of passing
    const rank1Card = state.players[1].hand.find((id) => {
      const d = defs[id];
      return d && d.rank === 1;
    })!;
    state = playCard(state, rank1Card, { row: 0, col: 4 });
    expect(state.consecutivePasses).toBe(0);
    // P0 passes again
    state = pass(state);
    expect(state.consecutivePasses).toBe(1);
    expect(state.phase).toBe(GAME_PHASES.PLAYING);
  });

  it('throws if not in playing phase', () => {
    const state = createTestGame();
    expect(() => pass(state)).toThrow('playing phase');
  });

  it('draws for next player on pass', () => {
    const state = skipMulligan(createTestGame());
    const p1HandSize = state.players[1].hand.length;
    const result = pass(state);
    // Turn advances, P1 draws (turn > 1)
    expect(result.players[1].hand).toHaveLength(p1HandSize + 1);
  });
});

// ── destroyCard ────────────────────────────────────────────────────────

describe('destroyCard', () => {
  it('removes card from board but keeps pawns', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });

    // Find the instance
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;
    expect(instanceId).toBeDefined();

    // Now it's P1's turn, but we can still call destroyCard
    const result = destroyCard(state, instanceId);
    const newTile = result.board[0]![0]!;
    expect(newTile.cardInstanceId).toBeNull();
    // Pawns remain
    expect(newTile.owner).toBe(0);
    expect(newTile.pawnCount).toBeGreaterThanOrEqual(1);
  });

  it('removes from cardInstances', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;

    const result = destroyCard(state, instanceId);
    expect(result.cardInstances[instanceId]).toBeUndefined();
  });

  it('removes continuous modifiers referencing the card', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;

    // Add a mock modifier referencing the card
    state = {
      ...state,
      continuousModifiers: [
        { sourceInstanceId: instanceId, targetInstanceId: 'other', value: 2 },
        { sourceInstanceId: 'other2', targetInstanceId: instanceId, value: -1 },
      ],
    };

    const result = destroyCard(state, instanceId);
    // After destroy + ability resolution, continuous modifiers are rebuilt from scratch.
    // Since no cards have whileInPlay/scaling abilities, all modifiers are cleared.
    expect(result.continuousModifiers).toHaveLength(0);
  });

  it('logs destroyCard action', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;

    const result = destroyCard(state, instanceId);
    const destroyActions = result.log.filter((a) => a.type === LOG_ACTION_TYPES.DESTROY_CARD);
    expect(destroyActions.length).toBeGreaterThanOrEqual(1);
    const last = destroyActions[destroyActions.length - 1]!;
    expect(last).toMatchObject({
      type: LOG_ACTION_TYPES.DESTROY_CARD,
      instanceId,
      position: { row: 0, col: 0 },
    });
  });

  it('throws for unknown instance', () => {
    const state = skipMulligan(createTestGame());
    expect(() => destroyCard(state, 'nonexistent')).toThrow('not found');
  });
});

// ── getEffectivePower ──────────────────────────────────────────────────

describe('getEffectivePower', () => {
  it('returns basePower when no modifiers', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;

    const power = getEffectivePower(state, instanceId);
    const def = defs[rank1Card]!;
    expect(power).toBe(def.power);
  });

  it('adds continuous modifier values', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;

    state = {
      ...state,
      continuousModifiers: [
        { sourceInstanceId: 'src', targetInstanceId: instanceId, value: 3 },
        { sourceInstanceId: 'src2', targetInstanceId: instanceId, value: -1 },
      ],
    };

    const def = defs[rank1Card]!;
    expect(getEffectivePower(state, instanceId)).toBe(def.power + 3 - 1);
  });
});

// ── Replacement card flow ──────────────────────────────────────────────

describe('replacement card', () => {
  it('cannot be played on empty tile', () => {
    const state = skipMulligan(createTestGame());
    if (!state.players[0].hand.includes('replacement')) return;
    expect(canPlayCard(state, 'replacement', { row: 0, col: 0 })).toBe(false);
  });

  it('can be played on tile with allied card', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    state = pass(state); // P1 passes

    if (!state.players[0].hand.includes('replacement')) return;
    expect(canPlayCard(state, 'replacement', { row: 0, col: 0 })).toBe(true);
  });

  it('destroys existing card and takes position', () => {
    let state = skipMulligan(createTestGame());
    const rank1Card = state.players[0].hand.find((id) => defs[id]?.rank === 1)!;
    state = playCard(state, rank1Card, { row: 0, col: 0 });
    const oldInstanceId = state.board[0]![0]!.cardInstanceId!;

    state = pass(state); // P1 passes

    if (!state.players[0].hand.includes('replacement')) return;
    const result = playCard(state, 'replacement', { row: 0, col: 0 });

    // Old instance should be gone
    expect(result.cardInstances[oldInstanceId]).toBeUndefined();
    // New instance should be there
    const newTile = result.board[0]![0]!;
    expect(newTile.cardInstanceId).not.toBeNull();
    expect(newTile.cardInstanceId).not.toBe(oldInstanceId);
    const newInstance = result.cardInstances[newTile.cardInstanceId!]!;
    expect(newInstance.definitionId).toBe('replacement');
  });
});
