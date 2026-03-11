import { describe, it, expect } from 'vitest';
import { createGame, mulligan, pass, GamePhase, getAllGameDefinitions } from '@bloodfang/engine';
import type { CardId as CardIdType, GameState } from '@bloodfang/engine';
import { filterStateForPlayer } from './state-filter.js';

const definitions = getAllGameDefinitions();
const allCardIds = Object.keys(definitions) as CardIdType[];

function buildDeck(start: number): CardIdType[] {
  return allCardIds.slice(start, start + 15);
}

function createTestGame(): GameState {
  const p0Deck = buildDeck(0);
  const p1Deck = buildDeck(15);
  let rngState = 42;
  const rng = () => {
    rngState = (rngState * 1664525 + 1013904223) & 0xffffffff;
    return (rngState >>> 0) / 0x100000000;
  };
  return createGame(p0Deck, p1Deck, definitions, undefined, rng);
}

function createPlayingGame(): GameState {
  const state = createTestGame();
  let gameState = mulligan(state, 0, []);
  gameState = mulligan(gameState, 1, []);
  return gameState;
}

function createEndedGame(): GameState {
  let state = createPlayingGame();
  // Pass twice to end the game
  state = pass(state);
  state = pass(state);
  return state;
}

describe('filterStateForPlayer', () => {
  it('shows own hand but hides opponent hand', () => {
    const state = createTestGame();
    const filtered0 = filterStateForPlayer(state, 0);
    const filtered1 = filterStateForPlayer(state, 1);

    // Player 0's view: own hand at index 0, opponent at index 1
    expect(filtered0.players[0].hand.length).toBeGreaterThan(0);
    expect(filtered0.players[1].hand).toEqual([]);

    // Player 1's view: own hand at index 0, opponent at index 1
    expect(filtered1.players[0].hand.length).toBeGreaterThan(0);
    expect(filtered1.players[1].hand).toEqual([]);
  });

  it('replaces deck with deckCount', () => {
    const state = createTestGame();
    const filtered = filterStateForPlayer(state, 0);

    expect(filtered.players[0].deckCount).toBe(state.players[0].deck.length);
    expect(filtered.players[1].deckCount).toBe(state.players[1].deck.length);
  });

  it('reorders players tuple so viewing player is at index 0', () => {
    const state = createTestGame();

    const filtered0 = filterStateForPlayer(state, 0);
    expect(filtered0.players[0].hand).toEqual(state.players[0].hand);

    const filtered1 = filterStateForPlayer(state, 1);
    expect(filtered1.players[0].hand).toEqual(state.players[1].hand);
  });

  it('remaps currentPlayerIndex relative to viewing player', () => {
    const gameState = createPlayingGame();
    const currentPlayer = gameState.currentPlayerIndex;

    const filtered = filterStateForPlayer(gameState, currentPlayer);
    expect(filtered.currentPlayerIndex).toBe(0);

    const opponentId = currentPlayer === 0 ? 1 : 0;
    const filteredOpponent = filterStateForPlayer(gameState, opponentId);
    expect(filteredOpponent.currentPlayerIndex).toBe(1);
  });

  it('redacts opponent drawCard log entries', () => {
    const state = createTestGame();
    const filtered = filterStateForPlayer(state, 0);

    // Opponent (raw player 1) draws should be redacted
    const opponentDraws = filtered.log.filter((a) => a.type === 'drawCard' && a.player === 1);
    expect(opponentDraws.length).toBeGreaterThan(0);
    for (const draw of opponentDraws) {
      expect((draw as { cardId: unknown }).cardId).toBeNull();
    }

    // Own draws should be visible
    const ownDraws = filtered.log.filter((a) => a.type === 'drawCard' && a.player === 0);
    expect(ownDraws.length).toBeGreaterThan(0);
    for (const draw of ownDraws) {
      expect((draw as { cardId: unknown }).cardId).not.toBeNull();
    }
  });

  it('reveals all information at game end', () => {
    const state = createEndedGame();
    expect(state.phase).toBe(GamePhase.Ended);

    const filtered = filterStateForPlayer(state, 0);

    // At game end, opponent hand should be visible
    expect(filtered.players[1].hand).toEqual(state.players[1].hand);

    // Log should not be redacted
    const opponentDraws = filtered.log.filter((a) => a.type === 'drawCard' && a.player === 1);
    for (const draw of opponentDraws) {
      expect((draw as { cardId: unknown }).cardId).not.toBeNull();
    }
  });

  it('preserves board, instances, modifiers, and definitions by reference', () => {
    const state = createTestGame();
    const filtered = filterStateForPlayer(state, 0);

    expect(filtered.board).toBe(state.board);
    expect(filtered.cardInstances).toBe(state.cardInstances);
    expect(filtered.continuousModifiers).toBe(state.continuousModifiers);
    expect(filtered.cardDefinitions).toBe(state.cardDefinitions);
  });

  it('preserves mulliganUsed flag', () => {
    const state = createTestGame();
    const gameState = mulligan(state, 0, []);

    const filtered = filterStateForPlayer(gameState, 0);
    expect(filtered.players[0].mulliganUsed).toBe(true);
    expect(filtered.players[1].mulliganUsed).toBe(false);
  });
});
