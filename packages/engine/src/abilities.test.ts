import { describe, it, expect } from 'vitest';
import type { GameEvent, GameState, Position, PlayerId } from './types.js';
import { createSeededRng } from './types.js';
import {
  resolveAbilityRangePattern,
  resolveTargets,
  collectTriggersForEvents,
  resolveAbilities,
  recalculateContinuousEffects,
} from './abilities.js';
import { createGame, mulligan } from './game.js';
import { getAllTestDefinitions, buildTestDeck } from './cards/test-cards.js';
import { getAllAbilityTestDefinitions } from './cards/ability-test-cards.js';
import { getAllTokenDefinitions } from './cards/token-cards.js';

const seedRng = (s: number) => createSeededRng(s);

function allDefs() {
  return { ...getAllTestDefinitions(), ...getAllAbilityTestDefinitions(), ...getAllTokenDefinitions() };
}

function setupPlayingState(seed = 1) {
  const defs = allDefs();
  const deck = buildTestDeck();
  let state = createGame(deck, deck, defs, undefined, seedRng(seed));
  state = mulligan(state, 0, [], seedRng(seed + 1));
  state = mulligan(state, 1, [], seedRng(seed + 2));
  return state;
}

// Build state with manually placed cards for ability testing
function buildAbilityTestState(
  cards: Array<{ id: string; position: Position; owner: PlayerId }>,
  seed = 42,
): GameState {
  const defs = allDefs();
  const deck = buildTestDeck();
  let state = createGame(deck, deck, defs, undefined, seedRng(seed));
  state = mulligan(state, 0, [], seedRng(seed + 1));
  state = mulligan(state, 1, [], seedRng(seed + 2));

  // Manually inject card instances
  let nextId = state.nextInstanceId;
  const cardInstances = { ...state.cardInstances };
  let board = state.board;

  for (const card of cards) {
    const def = defs[card.id]!;
    const instanceId = String(nextId++);
    cardInstances[instanceId] = {
      instanceId,
      definitionId: card.id,
      owner: card.owner,
      position: card.position,
      basePower: def.power,
      bonusPower: 0,
    };
    board = board.map((r, ri) =>
      ri === card.position.row
        ? r.map((t, ci) =>
            ci === card.position.col
              ? { ...t, cardInstanceId: instanceId, owner: card.owner, pawnCount: Math.max(t.pawnCount, 1) }
              : t,
          )
        : r,
    );
  }

  state = { ...state, cardInstances, board, nextInstanceId: nextId };
  // Recalculate continuous effects
  state = recalculateContinuousEffects(state);
  return state;
}

describe('resolveAbilityRangePattern', () => {
  it('includes ability cells and skips pawn cells', () => {
    const pattern = [
      { row: 0, col: 1, type: 'pawn' as const },
      { row: 0, col: 2, type: 'ability' as const },
      { row: -1, col: 0, type: 'both' as const },
    ];
    const positions = resolveAbilityRangePattern(pattern, { row: 1, col: 1 }, 0);
    expect(positions).toHaveLength(2); // ability + both, not pawn
    expect(positions).toContainEqual({ row: 1, col: 3 }); // ability cell
    expect(positions).toContainEqual({ row: 0, col: 1 }); // both cell
  });

  it('mirrors column for player 1', () => {
    const pattern = [{ row: 0, col: 1, type: 'ability' as const }];
    const posP0 = resolveAbilityRangePattern(pattern, { row: 1, col: 2 }, 0);
    const posP1 = resolveAbilityRangePattern(pattern, { row: 1, col: 2 }, 1);
    expect(posP0[0]).toEqual({ row: 1, col: 3 }); // right
    expect(posP1[0]).toEqual({ row: 1, col: 1 }); // left (mirrored)
  });

  it('filters out-of-bounds positions', () => {
    const pattern = [{ row: 0, col: 1, type: 'ability' as const }];
    const positions = resolveAbilityRangePattern(pattern, { row: 0, col: 4 }, 0);
    expect(positions).toHaveLength(0); // col 5 is out of bounds
  });

  it('does not mirror row offset', () => {
    const pattern = [{ row: -1, col: 0, type: 'ability' as const }];
    const posP0 = resolveAbilityRangePattern(pattern, { row: 1, col: 2 }, 0);
    const posP1 = resolveAbilityRangePattern(pattern, { row: 1, col: 2 }, 1);
    expect(posP0[0]).toEqual({ row: 0, col: 2 });
    expect(posP1[0]).toEqual({ row: 0, col: 2 }); // Same row for both
  });
});

describe('resolveTargets', () => {
  it('resolves self target', () => {
    const state = buildAbilityTestState([
      { id: 'r1-basic', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const instanceId = state.board[0]![0]!.cardInstanceId!;
    const result = resolveTargets(state, instanceId, { type: 'self' });
    expect(result.instanceIds).toEqual([instanceId]);
  });

  it('resolves rangePattern target', () => {
    // enhancer-on-play has ability range at col+1
    const state = buildAbilityTestState([
      { id: 'enhancer-on-play', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 1 }, owner: 0 },
    ]);
    const sourceId = state.board[0]![0]!.cardInstanceId!;
    const targetId = state.board[0]![1]!.cardInstanceId!;

    const result = resolveTargets(state, sourceId, { type: 'rangePattern' });
    expect(result.instanceIds).toContain(targetId);
  });

  it('resolves allAllied target (excludes self)', () => {
    const state = buildAbilityTestState([
      { id: 'r1-basic', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-cross', position: { row: 1, col: 0 }, owner: 0 },
      { id: 'r1-empty', position: { row: 2, col: 4 }, owner: 1 },
    ]);
    const sourceId = state.board[0]![0]!.cardInstanceId!;
    const alliedId = state.board[1]![0]!.cardInstanceId!;

    const result = resolveTargets(state, sourceId, { type: 'allAllied' });
    expect(result.instanceIds).toContain(alliedId);
    expect(result.instanceIds).not.toContain(sourceId);
    expect(result.instanceIds).toHaveLength(1);
  });

  it('resolves allEnemy target', () => {
    const state = buildAbilityTestState([
      { id: 'r1-basic', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-cross', position: { row: 0, col: 4 }, owner: 1 },
      { id: 'r1-empty', position: { row: 1, col: 4 }, owner: 1 },
    ]);
    const sourceId = state.board[0]![0]!.cardInstanceId!;

    const result = resolveTargets(state, sourceId, { type: 'allEnemy' });
    expect(result.instanceIds).toHaveLength(2);
  });

  it('resolves allAlliedInLane target', () => {
    const state = buildAbilityTestState([
      { id: 'r1-basic', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-cross', position: { row: 0, col: 1 }, owner: 0 },
      { id: 'r1-empty', position: { row: 1, col: 0 }, owner: 0 }, // different lane
    ]);
    const sourceId = state.board[0]![0]!.cardInstanceId!;
    const sameLaneId = state.board[0]![1]!.cardInstanceId!;

    const result = resolveTargets(state, sourceId, { type: 'allAlliedInLane' });
    expect(result.instanceIds).toEqual([sameLaneId]);
  });

  it('resolves allEnemyInLane target', () => {
    const state = buildAbilityTestState([
      { id: 'r1-basic', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-cross', position: { row: 0, col: 4 }, owner: 1 },
      { id: 'r1-empty', position: { row: 1, col: 4 }, owner: 1 }, // different lane
    ]);
    const sourceId = state.board[0]![0]!.cardInstanceId!;
    const enemyInLane = state.board[0]![4]!.cardInstanceId!;

    const result = resolveTargets(state, sourceId, { type: 'allEnemyInLane' });
    expect(result.instanceIds).toEqual([enemyInLane]);
  });

  it('resolves allInLane target (excludes self)', () => {
    const state = buildAbilityTestState([
      { id: 'r1-basic', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-cross', position: { row: 0, col: 2 }, owner: 0 },
      { id: 'r1-empty', position: { row: 0, col: 4 }, owner: 1 },
    ]);
    const sourceId = state.board[0]![0]!.cardInstanceId!;

    const result = resolveTargets(state, sourceId, { type: 'allInLane' });
    expect(result.instanceIds).toHaveLength(2);
    expect(result.instanceIds).not.toContain(sourceId);
  });

  it('returns empty for nonexistent source', () => {
    const state = buildAbilityTestState([]);
    const result = resolveTargets(state, 'nonexistent', { type: 'self' });
    expect(result.instanceIds).toHaveLength(0);
  });
});

describe('collectTriggersForEvents', () => {
  it('matches whenPlayed trigger for cardPlayed event on self', () => {
    const state = buildAbilityTestState([
      { id: 'enhancer-on-play', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const instanceId = state.board[0]![0]!.cardInstanceId!;
    const events: GameEvent[] = [{ type: 'cardPlayed', instanceId, owner: 0 }];

    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(1);
    expect(triggers[0]!.ability.trigger).toBe('whenPlayed');
  });

  it('matches whenDestroyed trigger for cardDestroyed event on self (via destroyedCards)', () => {
    const state = buildAbilityTestState([
      { id: 'death-curse', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const instanceId = state.board[0]![0]!.cardInstanceId!;
    const snapshot = state.cardInstances[instanceId]!;

    // Simulate the card being destroyed — remove from state, pass as destroyedCards
    const { [instanceId]: _, ...remaining } = state.cardInstances;
    const stateAfterDestroy = { ...state, cardInstances: remaining };
    const destroyedCards = { [instanceId]: snapshot };

    const events: GameEvent[] = [{ type: 'cardDestroyed', instanceId, owner: 0 }];
    const triggers = collectTriggersForEvents(stateAfterDestroy, events, destroyedCards);
    expect(triggers).toHaveLength(1);
    expect(triggers[0]!.ability.trigger).toBe('whenDestroyed');
    expect(triggers[0]!.destroyedSnapshot).toBeDefined();
  });

  it('matches whenAlliedDestroyed for allied card destruction', () => {
    const state = buildAbilityTestState([
      { id: 'avenger', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 1 }, owner: 0 },
    ]);
    const avengerId = state.board[0]![0]!.cardInstanceId!;
    const alliedId = state.board[0]![1]!.cardInstanceId!;
    const events: GameEvent[] = [{ type: 'cardDestroyed', instanceId: alliedId, owner: 0 }];

    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(1);
    expect(triggers[0]!.instanceId).toBe(avengerId);
  });

  it('does not match whenAlliedDestroyed for self', () => {
    const state = buildAbilityTestState([
      { id: 'avenger', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const avengerId = state.board[0]![0]!.cardInstanceId!;
    const events: GameEvent[] = [{ type: 'cardDestroyed', instanceId: avengerId, owner: 0 }];

    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(0);
  });

  it('matches whenEnemyDestroyed for enemy card destruction', () => {
    const state = buildAbilityTestState([
      { id: 'predator', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 4 }, owner: 1 },
    ]);
    const predatorId = state.board[0]![0]!.cardInstanceId!;
    const enemyId = state.board[0]![4]!.cardInstanceId!;
    const events: GameEvent[] = [{ type: 'cardDestroyed', instanceId: enemyId, owner: 1 }];

    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(1);
    expect(triggers[0]!.instanceId).toBe(predatorId);
  });

  it('matches whenAnyDestroyed for non-self destruction', () => {
    const state = buildAbilityTestState([
      { id: 'scavenger', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 4 }, owner: 1 },
    ]);
    const scavengerId = state.board[0]![0]!.cardInstanceId!;
    const otherId = state.board[0]![4]!.cardInstanceId!;
    const events: GameEvent[] = [{ type: 'cardDestroyed', instanceId: otherId, owner: 1 }];

    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(1);
    expect(triggers[0]!.instanceId).toBe(scavengerId);
  });

  it('matches whenFirstEnfeebled only once', () => {
    let state = buildAbilityTestState([
      { id: 'resilient', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const resilientId = state.board[0]![0]!.cardInstanceId!;
    const events: GameEvent[] = [{ type: 'cardEnfeebled', instanceId: resilientId, owner: 0 }];

    const triggers1 = collectTriggersForEvents(state, events);
    expect(triggers1).toHaveLength(1);

    // Set flag
    state = {
      ...state,
      cardInstances: {
        ...state.cardInstances,
        [resilientId]: { ...state.cardInstances[resilientId]!, hasBeenEnfeebled: true },
      },
    };
    const triggers2 = collectTriggersForEvents(state, events);
    expect(triggers2).toHaveLength(0);
  });

  it('matches whenFirstEnhanced only once', () => {
    let state = buildAbilityTestState([
      { id: 'inspirer', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const inspirerId = state.board[0]![0]!.cardInstanceId!;
    const events: GameEvent[] = [{ type: 'cardEnhanced', instanceId: inspirerId, owner: 0 }];

    const triggers1 = collectTriggersForEvents(state, events);
    expect(triggers1).toHaveLength(1);

    state = {
      ...state,
      cardInstances: {
        ...state.cardInstances,
        [inspirerId]: { ...state.cardInstances[inspirerId]!, hasBeenEnhanced: true },
      },
    };
    const triggers2 = collectTriggersForEvents(state, events);
    expect(triggers2).toHaveLength(0);
  });

  it('matches whenPowerReachesN when threshold met', () => {
    let state = buildAbilityTestState([
      { id: 'threshold5-destroyer', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const instanceId = state.board[0]![0]!.cardInstanceId!;

    // Base power is 3, need bonus of 2 to reach 5
    state = {
      ...state,
      cardInstances: {
        ...state.cardInstances,
        [instanceId]: { ...state.cardInstances[instanceId]!, bonusPower: 2 },
      },
    };

    const events: GameEvent[] = [{ type: 'powerChanged', instanceId, owner: 0 }];
    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(1);
  });

  it('does not match whenPowerReachesN when below threshold', () => {
    const state = buildAbilityTestState([
      { id: 'threshold5-destroyer', position: { row: 0, col: 0 }, owner: 0 },
    ]);
    const instanceId = state.board[0]![0]!.cardInstanceId!;
    // basePower is 3, bonusPower 0, threshold is 5

    const events: GameEvent[] = [{ type: 'powerChanged', instanceId, owner: 0 }];
    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(0);
  });

  it('sorts triggers by instanceId ascending', () => {
    const state = buildAbilityTestState([
      { id: 'scavenger', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'cascade-grower', position: { row: 1, col: 0 }, owner: 0 },
    ]);
    const events: GameEvent[] = [{ type: 'cardDestroyed', instanceId: '999', owner: 1 }];

    const triggers = collectTriggersForEvents(state, events);
    expect(triggers.length).toBeGreaterThanOrEqual(2);
    const ids = triggers.map(t => parseInt(t.instanceId, 10));
    for (let i = 1; i < ids.length; i++) {
      expect(ids[i]).toBeGreaterThanOrEqual(ids[i - 1]!);
    }
  });

  it('does not match whileInPlay, scaling, or endOfGame triggers', () => {
    const state = buildAbilityTestState([
      { id: 'aura-buffer', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'army-scaler', position: { row: 1, col: 0 }, owner: 0 },
      { id: 'lane-bonus', position: { row: 2, col: 0 }, owner: 0 },
    ]);

    const events: GameEvent[] = [
      { type: 'cardPlayed', instanceId: 'x', owner: 0 },
      { type: 'cardDestroyed', instanceId: 'x', owner: 0 },
    ];
    const triggers = collectTriggersForEvents(state, events);
    expect(triggers).toHaveLength(0);
  });
});

describe('recalculateContinuousEffects', () => {
  it('creates modifiers for whileInPlay enhance effects', () => {
    // aura-buffer has whileInPlay enhance +1 on rangePattern (col+1, col-1)
    const state = buildAbilityTestState([
      { id: 'aura-buffer', position: { row: 0, col: 2 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 1 }, owner: 0 },
      { id: 'r1-cross', position: { row: 0, col: 3 }, owner: 0 },
    ]);

    const auraId = state.board[0]![2]!.cardInstanceId!;
    const leftId = state.board[0]![1]!.cardInstanceId!;
    const rightId = state.board[0]![3]!.cardInstanceId!;

    expect(state.continuousModifiers).toHaveLength(2);
    expect(state.continuousModifiers).toContainEqual({
      sourceInstanceId: auraId,
      targetInstanceId: leftId,
      value: 1,
    });
    expect(state.continuousModifiers).toContainEqual({
      sourceInstanceId: auraId,
      targetInstanceId: rightId,
      value: 1,
    });
  });

  it('creates modifiers for scaling effects', () => {
    // army-scaler: scaling, alliedCardsInLane, +2 per allied card
    const state = buildAbilityTestState([
      { id: 'army-scaler', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 1 }, owner: 0 },
      { id: 'r1-cross', position: { row: 0, col: 2 }, owner: 0 },
    ]);

    const scalerId = state.board[0]![0]!.cardInstanceId!;

    // 2 allied cards in lane → modifier of 4
    const mod = state.continuousModifiers.find(
      m => m.sourceInstanceId === scalerId && m.targetInstanceId === scalerId,
    );
    expect(mod).toBeDefined();
    expect(mod!.value).toBe(4); // 2 allies * 2 per unit
  });

  it('creates dual-target modifiers for dualTargetBuff', () => {
    // dual-aura: whileInPlay, dualTargetBuff +1/-1 rangePattern
    const state = buildAbilityTestState([
      { id: 'dual-aura', position: { row: 0, col: 2 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 1 }, owner: 0 },  // allied → +1
      { id: 'r1-cross', position: { row: 0, col: 3 }, owner: 1 },  // enemy → -1
    ]);

    const alliedId = state.board[0]![1]!.cardInstanceId!;
    const enemyId = state.board[0]![3]!.cardInstanceId!;

    const alliedMod = state.continuousModifiers.find(m => m.targetInstanceId === alliedId);
    const enemyMod = state.continuousModifiers.find(m => m.targetInstanceId === enemyId);

    expect(alliedMod).toBeDefined();
    expect(alliedMod!.value).toBe(1);
    expect(enemyMod).toBeDefined();
    expect(enemyMod!.value).toBe(-1);
  });

  it('clears old modifiers and rebuilds from scratch', () => {
    let state = buildAbilityTestState([
      { id: 'aura-buffer', position: { row: 0, col: 2 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 3 }, owner: 0 },
    ]);

    // Inject a stale modifier
    state = {
      ...state,
      continuousModifiers: [
        ...state.continuousModifiers,
        { sourceInstanceId: 'stale', targetInstanceId: 'stale2', value: 99 },
      ],
    };

    const result = recalculateContinuousEffects(state);
    const staleMod = result.continuousModifiers.find(m => m.value === 99);
    expect(staleMod).toBeUndefined();
  });
});

describe('resolveAbilities', () => {
  it('returns state unchanged when no events', () => {
    const state = setupPlayingState();
    const result = resolveAbilities(state, []);
    expect(result).toBe(state);
  });

  it('throws on cascade depth limit', () => {
    const state = setupPlayingState();
    expect(() => resolveAbilities(state, [{ type: 'cardPlayed', instanceId: '1', owner: 0 }], 101)).toThrow(
      'exceeded maximum depth',
    );
  });

  it('handles enfeeble causing death check', () => {
    // Place a card with low power, then enfeeble it to death
    let state = buildAbilityTestState([
      { id: 'r1-basic', position: { row: 0, col: 2 }, owner: 1 },  // power 2, target
    ]);
    const targetId = state.board[0]![2]!.cardInstanceId!;

    // Manually enfeeble it below 0
    state = {
      ...state,
      cardInstances: {
        ...state.cardInstances,
        [targetId]: { ...state.cardInstances[targetId]!, bonusPower: -3 },
      },
    };

    // Trigger a resolve with any event
    const result = resolveAbilities(state, [{ type: 'cardPlayed', instanceId: 'x', owner: 0 }]);
    // The card should be destroyed (power 2 + (-3) = -1 ≤ 0)
    expect(result.cardInstances[targetId]).toBeUndefined();
  });

  it('processes whenPlayed trigger effects', () => {
    // enhancer-on-play: whenPlayed → enhance +2 rangePattern(col+1)
    const state = buildAbilityTestState([
      { id: 'enhancer-on-play', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 1 }, owner: 0 },  // target at col+1
    ]);
    const enhancerId = state.board[0]![0]!.cardInstanceId!;
    const targetId = state.board[0]![1]!.cardInstanceId!;

    const events: GameEvent[] = [{ type: 'cardPlayed', instanceId: enhancerId, owner: 0 }];
    const result = resolveAbilities(state, events);

    expect(result.cardInstances[targetId]!.bonusPower).toBe(2);
  });

  it('handles chain cascade: enfeeble → death → whenAnyDestroyed', () => {
    // Setup: chain-killer enfeebles target by 5, target has power 2 → dies
    // cascade-grower gains +2 on any destruction
    const state = buildAbilityTestState([
      { id: 'chain-killer', position: { row: 0, col: 0 }, owner: 0 },
      { id: 'r1-basic', position: { row: 0, col: 1 }, owner: 1 },    // power 2, will die
      { id: 'cascade-grower', position: { row: 1, col: 0 }, owner: 0 }, // +2 on any death
    ]);
    const killerId = state.board[0]![0]!.cardInstanceId!;
    const targetId = state.board[0]![1]!.cardInstanceId!;
    const growerId = state.board[1]![0]!.cardInstanceId!;

    const events: GameEvent[] = [{ type: 'cardPlayed', instanceId: killerId, owner: 0 }];
    const result = resolveAbilities(state, events);

    // Target should be dead
    expect(result.cardInstances[targetId]).toBeUndefined();
    // Grower should have gained +2
    expect(result.cardInstances[growerId]!.bonusPower).toBe(2);
  });
});
