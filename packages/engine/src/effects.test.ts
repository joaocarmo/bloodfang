import { describe, it, expect } from 'vitest';
import type { GameState, Position } from './types.js';
import { createSeededRng } from './types.js';
import {
  applyEnhance,
  applyEnfeeble,
  applyDestroy,
  applyAddCardToHand,
  applySpawnCard,
  applyPositionRankManip,
  applyDualTargetBuff,
  internalDestroyCard,
} from './effects.js';
import { createGame, mulligan, playCard } from './game.js';
import { getAllTestDefinitions, buildTestDeck } from './cards/test-cards.js';
import { getAllTokenDefinitions } from './cards/token-cards.js';

const seedRng = (s: number) => createSeededRng(s);

function createTestDefs() {
  return { ...getAllTestDefinitions(), ...getAllTokenDefinitions() };
}

function setupPlayingState(seed = 1) {
  const defs = createTestDefs();
  const deck = buildTestDeck();
  let state = createGame(deck, deck, defs, undefined, seedRng(seed));
  state = mulligan(state, 0, [], seedRng(seed + 1));
  state = mulligan(state, 1, [], seedRng(seed + 2));
  return { state, defs, deck };
}

function placeCard(state: GameState, position: Position): GameState {
  const rank1Card = state.players[state.currentPlayerIndex].hand.find((id) => {
    const def = state.cardDefinitions[id];
    return def && def.rank === 1;
  })!;
  return playCard(state, rank1Card, position);
}

describe('internalDestroyCard', () => {
  it('removes card from board tile without triggering cascades', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 }); // P0 plays
    const instanceId = state.board[0]![0]!.cardInstanceId!;

    const result = internalDestroyCard(state, instanceId);
    expect(result.board[0]![0]!.cardInstanceId).toBeNull();
    expect(result.cardInstances[instanceId]).toBeUndefined();
  });

  it('keeps tile ownership and pawns', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;

    const result = internalDestroyCard(state, instanceId);
    expect(result.board[0]![0]!.owner).toBe(tile.owner);
    expect(result.board[0]![0]!.pawnCount).toBe(tile.pawnCount);
  });

  it('removes continuous modifiers referencing destroyed card', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const instanceId = state.board[0]![0]!.cardInstanceId!;

    state = {
      ...state,
      continuousModifiers: [
        { sourceInstanceId: instanceId, targetInstanceId: 'x', value: 1 },
        { sourceInstanceId: 'y', targetInstanceId: instanceId, value: -1 },
        { sourceInstanceId: 'a', targetInstanceId: 'b', value: 2 },
      ],
    };

    const result = internalDestroyCard(state, instanceId);
    expect(result.continuousModifiers).toHaveLength(1);
    expect(result.continuousModifiers[0]!.sourceInstanceId).toBe('a');
  });

  it('logs destroyCard action', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const instanceId = state.board[0]![0]!.cardInstanceId!;

    const result = internalDestroyCard(state, instanceId);
    const destroyActions = result.log.filter((a) => a.type === 'destroyCard');
    expect(destroyActions.length).toBeGreaterThan(0);
  });

  it('returns state unchanged for nonexistent instance', () => {
    const { state } = setupPlayingState();
    const result = internalDestroyCard(state, 'nonexistent');
    expect(result).toBe(state);
  });
});

describe('applyEnhance', () => {
  it('increases target bonusPower by value', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 }); // P0
    const instanceId = state.board[0]![0]!.cardInstanceId!;

    // P1 turn — place a card, then skip to have two cards
    state = placeCard(state, { row: 0, col: 4 }); // P1
    const targetId = state.board[0]![4]!.cardInstanceId!;

    const result = applyEnhance(state, instanceId, [targetId], 3);
    const target = result.state.cardInstances[targetId]!;
    expect(target.bonusPower).toBe(3);
  });

  it('emits cardEnhanced and powerChanged events', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const instanceId = state.board[0]![0]!.cardInstanceId!;

    const result = applyEnhance(state, instanceId, [instanceId], 2);
    expect(result.events).toHaveLength(2);
    expect(result.events[0]!.type).toBe('cardEnhanced');
    expect(result.events[1]!.type).toBe('powerChanged');
  });

  it('logs enhance action per target', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyEnhance(state, id, [id], 5);
    const enhanceLog = result.state.log.filter((a) => a.type === 'enhance');
    expect(enhanceLog).toHaveLength(1);
  });

  it('enhances multiple targets', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 }); // P0
    const id1 = state.board[0]![0]!.cardInstanceId!;
    state = placeCard(state, { row: 0, col: 4 }); // P1
    const id2 = state.board[0]![4]!.cardInstanceId!;

    const result = applyEnhance(state, id1, [id1, id2], 2);
    expect(result.state.cardInstances[id1]!.bonusPower).toBe(2);
    expect(result.state.cardInstances[id2]!.bonusPower).toBe(2);
    expect(result.events).toHaveLength(4); // 2 events per target
  });

  it('skips nonexistent targets', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyEnhance(state, id, ['nonexistent', id], 1);
    expect(result.events).toHaveLength(2);
    expect(result.state.cardInstances[id]!.bonusPower).toBe(1);
  });
});

describe('applyEnfeeble', () => {
  it('decreases target bonusPower by value', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyEnfeeble(state, id, [id], 3);
    expect(result.state.cardInstances[id]!.bonusPower).toBe(-3);
  });

  it('emits cardEnfeebled and powerChanged events', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyEnfeeble(state, id, [id], 1);
    expect(result.events[0]!.type).toBe('cardEnfeebled');
    expect(result.events[1]!.type).toBe('powerChanged');
  });
});

describe('applyDestroy', () => {
  it('destroys target cards', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyDestroy(state, 'source', [id]);
    expect(result.state.cardInstances[id]).toBeUndefined();
    expect(result.state.board[0]![0]!.cardInstanceId).toBeNull();
  });

  it('emits cardDestroyed events', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyDestroy(state, 'source', [id]);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]!.type).toBe('cardDestroyed');
  });
});

describe('applyAddCardToHand', () => {
  it('adds token cards to owners hand', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;
    const handBefore = state.players[0].hand.length;

    // Card was placed by P0. After playing, turn advanced to P1.
    // The card instance still belongs to P0.
    const result = applyAddCardToHand(state, id, 'token-basic', 2);
    expect(result.state.players[0].hand.length).toBe(handBefore + 2);
    expect(result.state.players[0].hand).toContain('token-basic');
  });

  it('logs addCardToHand actions', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyAddCardToHand(state, id, 'token-basic', 1);
    const addActions = result.state.log.filter((a) => a.type === 'addCardToHand');
    expect(addActions).toHaveLength(1);
  });

  it('does nothing for missing token definition', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyAddCardToHand(state, id, 'nonexistent-token', 1);
    expect(result.state).toBe(state);
  });
});

describe('applySpawnCard', () => {
  it('spawns a token card at an owned empty position', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;
    const owner = state.cardInstances[id]!.owner;

    // Find an owned empty tile for P0
    // After placing at (0,0), P0 still owns col 0, rows 1 and 2
    const targetPos: Position = { row: 1, col: 0 };

    const result = applySpawnCard(state, id, 'token-basic', [targetPos]);
    expect(result.state.board[1]![0]!.cardInstanceId).not.toBeNull();
    expect(result.events).toHaveLength(1);
    expect(result.events[0]!.type).toBe('cardPlayed');

    const spawnedId = result.state.board[1]![0]!.cardInstanceId!;
    const spawned = result.state.cardInstances[spawnedId]!;
    expect(spawned.definitionId).toBe('token-basic');
    expect(spawned.owner).toBe(owner);
  });

  it('skips positions that already have cards', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    // Try to spawn at the same position (already has a card)
    const result = applySpawnCard(state, id, 'token-basic', [{ row: 0, col: 0 }]);
    expect(result.events).toHaveLength(0);
  });

  it('skips positions not owned by source player', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    // Col 4 is owned by P1, not P0
    const result = applySpawnCard(state, id, 'token-basic', [{ row: 0, col: 4 }]);
    expect(result.events).toHaveLength(0);
  });
});

describe('applyPositionRankManip', () => {
  it('increases pawn count on target positions', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const targetPos: Position = { row: 1, col: 0 };
    const pawnsBefore = state.board[1]![0]!.pawnCount;

    const result = applyPositionRankManip(state, id, 2, [targetPos]);
    expect(result.state.board[1]![0]!.pawnCount).toBe(Math.min(pawnsBefore + 2, 3));
  });

  it('caps pawn count at 3', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    // P0 col 0 starts with 1 pawn, placing a card may add more
    const result = applyPositionRankManip(state, id, 10, [{ row: 1, col: 0 }]);
    expect(result.state.board[1]![0]!.pawnCount).toBeLessThanOrEqual(3);
  });

  it('logs pawnBonus action', () => {
    let { state } = setupPlayingState();
    state = placeCard(state, { row: 0, col: 0 });
    const id = state.board[0]![0]!.cardInstanceId!;

    const result = applyPositionRankManip(state, id, 1, [{ row: 1, col: 0 }]);
    const bonusActions = result.state.log.filter((a) => a.type === 'pawnBonus');
    expect(bonusActions.length).toBeGreaterThanOrEqual(1);
  });
});

describe('applyDualTargetBuff', () => {
  it('enhances allies and enfeebles enemies', () => {
    let { state } = setupPlayingState();
    // P0 plays at (0,0)
    state = placeCard(state, { row: 0, col: 0 });
    const p0Id = state.board[0]![0]!.cardInstanceId!;
    // P1 plays at (0,4)
    state = placeCard(state, { row: 0, col: 4 });
    const p1Id = state.board[0]![4]!.cardInstanceId!;

    // Source is P0's card, targets are both
    const result = applyDualTargetBuff(state, p0Id, [p0Id, p1Id], 2, -1);

    // P0's card enhanced by +2
    expect(result.state.cardInstances[p0Id]!.bonusPower).toBe(2);
    // P1's card enfeebled by 1
    expect(result.state.cardInstances[p1Id]!.bonusPower).toBe(-1);
  });
});
