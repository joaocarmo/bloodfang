import type {
  AbilityEffect,
  CardInstance,
  GameEvent,
  GameState,
  PlayerId,
  Position,
} from './types.js';
import { MAX_PAWN_COUNT } from './types.js';
import { getTile, setTile } from './board.js';

// ── Effect Result ─────────────────────────────────────────────────────

export interface EffectResult {
  readonly state: GameState;
  readonly events: readonly GameEvent[];
}

// ── Internal destroy (no cascade) ─────────────────────────────────────

export function internalDestroyCard(state: GameState, instanceId: string): GameState {
  const instance = state.cardInstances[instanceId];
  if (!instance) return state;

  const pos = instance.position;
  const tile = getTile(state.board, pos);
  if (!tile) return state;

  const newBoard = setTile(state.board, pos, {
    ...tile,
    cardInstanceId: null,
  });

  const newInstances = { ...state.cardInstances };
  delete newInstances[instanceId];

  const newModifiers = state.continuousModifiers.filter(
    (m) => m.sourceInstanceId !== instanceId && m.targetInstanceId !== instanceId,
  );

  const log = [...state.log, { type: 'destroyCard' as const, instanceId, position: pos }];

  return {
    ...state,
    board: newBoard,
    cardInstances: newInstances,
    continuousModifiers: newModifiers,
    log,
  };
}

// ── Resolve targets helper (used by effects) ──────────────────────────

function getCardOwner(state: GameState, instanceId: string): PlayerId {
  const inst = state.cardInstances[instanceId];
  if (!inst) throw new Error(`Card instance not found: ${instanceId}`);
  return inst.owner;
}

// ── Effect Handlers ───────────────────────────────────────────────────

export function applyEnhance(
  state: GameState,
  sourceInstanceId: string,
  targetInstanceIds: readonly string[],
  value: number,
): EffectResult {
  let currentState = state;
  const events: GameEvent[] = [];

  for (const targetId of targetInstanceIds) {
    const target = currentState.cardInstances[targetId];
    if (!target) continue;

    const updatedInstance: CardInstance = {
      ...target,
      bonusPower: target.bonusPower + value,
    };

    currentState = {
      ...currentState,
      cardInstances: {
        ...currentState.cardInstances,
        [targetId]: updatedInstance,
      },
      log: [
        ...currentState.log,
        {
          type: 'enhance' as const,
          sourceInstanceId,
          targetInstanceId: targetId,
          value,
        },
      ],
    };

    events.push({ type: 'cardEnhanced', instanceId: targetId, owner: target.owner });
    events.push({ type: 'powerChanged', instanceId: targetId, owner: target.owner });
  }

  return { state: currentState, events };
}

export function applyEnfeeble(
  state: GameState,
  sourceInstanceId: string,
  targetInstanceIds: readonly string[],
  value: number,
): EffectResult {
  let currentState = state;
  const events: GameEvent[] = [];

  for (const targetId of targetInstanceIds) {
    const target = currentState.cardInstances[targetId];
    if (!target) continue;

    const updatedInstance: CardInstance = {
      ...target,
      bonusPower: target.bonusPower - value,
    };

    currentState = {
      ...currentState,
      cardInstances: {
        ...currentState.cardInstances,
        [targetId]: updatedInstance,
      },
      log: [
        ...currentState.log,
        {
          type: 'enfeeble' as const,
          sourceInstanceId,
          targetInstanceId: targetId,
          value,
        },
      ],
    };

    events.push({ type: 'cardEnfeebled', instanceId: targetId, owner: target.owner });
    events.push({ type: 'powerChanged', instanceId: targetId, owner: target.owner });
  }

  return { state: currentState, events };
}

export function applyDestroy(
  state: GameState,
  _sourceInstanceId: string,
  targetInstanceIds: readonly string[],
): EffectResult {
  let currentState = state;
  const events: GameEvent[] = [];

  for (const targetId of targetInstanceIds) {
    const target = currentState.cardInstances[targetId];
    if (!target) continue;

    const owner = target.owner;
    currentState = internalDestroyCard(currentState, targetId);

    events.push({ type: 'cardDestroyed', instanceId: targetId, owner });
  }

  return { state: currentState, events };
}

export function applyAddCardToHand(
  state: GameState,
  sourceInstanceId: string,
  tokenDefinitionId: string,
  count: number,
): EffectResult {
  const sourceOwner = getCardOwner(state, sourceInstanceId);
  let currentState = state;
  const events: GameEvent[] = [];

  // Verify token definition exists
  if (!currentState.cardDefinitions[tokenDefinitionId]) {
    return { state, events: [] };
  }

  for (let i = 0; i < count; i++) {
    const cardId = tokenDefinitionId;
    const playerState = currentState.players[sourceOwner];
    const newHand = [...playerState.hand, cardId];

    const players: [(typeof currentState.players)[0], (typeof currentState.players)[1]] = [
      currentState.players[0],
      currentState.players[1],
    ];
    players[sourceOwner] = { ...playerState, hand: newHand };

    currentState = {
      ...currentState,
      players,
      log: [
        ...currentState.log,
        {
          type: 'addCardToHand' as const,
          player: sourceOwner,
          cardId,
        },
      ],
    };
  }

  return { state: currentState, events };
}

export function applySpawnCard(
  state: GameState,
  sourceInstanceId: string,
  tokenDefinitionId: string,
  targetPositions: readonly Position[],
): EffectResult {
  const sourceOwner = getCardOwner(state, sourceInstanceId);
  let currentState = state;
  const events: GameEvent[] = [];

  const tokenDef = currentState.cardDefinitions[tokenDefinitionId];
  if (!tokenDef) return { state, events: [] };

  for (const pos of targetPositions) {
    const tile = getTile(currentState.board, pos);
    if (!tile) continue;

    // Can only spawn on tiles owned by the source card's owner with no card
    if (tile.owner !== sourceOwner || tile.cardInstanceId !== null) continue;

    const instanceId = String(currentState.nextInstanceId);
    const instance: CardInstance = {
      instanceId,
      definitionId: tokenDefinitionId,
      owner: sourceOwner,
      position: pos,
      basePower: tokenDef.power,
      bonusPower: 0,
    };

    const newBoard = setTile(currentState.board, pos, {
      ...tile,
      cardInstanceId: instanceId,
    });

    currentState = {
      ...currentState,
      board: newBoard,
      cardInstances: { ...currentState.cardInstances, [instanceId]: instance },
      nextInstanceId: currentState.nextInstanceId + 1,
      log: [
        ...currentState.log,
        {
          type: 'spawnCard' as const,
          instanceId,
          definitionId: tokenDefinitionId,
          position: pos,
        },
      ],
    };

    events.push({ type: 'cardPlayed', instanceId, owner: sourceOwner });
  }

  return { state: currentState, events };
}

export function applyPositionRankManip(
  state: GameState,
  sourceInstanceId: string,
  bonusPawns: number,
  targetPositions: readonly Position[],
): EffectResult {
  const sourceOwner = getCardOwner(state, sourceInstanceId);
  let currentState = state;
  const events: GameEvent[] = [];

  for (const pos of targetPositions) {
    const tile = getTile(currentState.board, pos);
    if (!tile) continue;

    const newPawnCount = Math.min(tile.pawnCount + bonusPawns, MAX_PAWN_COUNT);
    if (newPawnCount === tile.pawnCount) continue;

    const newBoard = setTile(currentState.board, pos, {
      owner: tile.owner ?? sourceOwner,
      pawnCount: newPawnCount,
      cardInstanceId: tile.cardInstanceId,
    });

    currentState = {
      ...currentState,
      board: newBoard,
      log: [
        ...currentState.log,
        {
          type: 'pawnBonus' as const,
          player: sourceOwner,
          position: pos,
          bonusPawns: newPawnCount - tile.pawnCount,
        },
      ],
    };
  }

  return { state: currentState, events };
}

export function applyDualTargetBuff(
  state: GameState,
  sourceInstanceId: string,
  targetInstanceIds: readonly string[],
  alliedValue: number,
  enemyValue: number,
): EffectResult {
  const sourceOwner = getCardOwner(state, sourceInstanceId);
  let currentState = state;
  const events: GameEvent[] = [];

  const alliedTargets: string[] = [];
  const enemyTargets: string[] = [];

  for (const targetId of targetInstanceIds) {
    const target = currentState.cardInstances[targetId];
    if (!target) continue;
    if (target.owner === sourceOwner) {
      alliedTargets.push(targetId);
    } else {
      enemyTargets.push(targetId);
    }
  }

  // Apply allied buff
  if (alliedValue > 0 && alliedTargets.length > 0) {
    const result = applyEnhance(currentState, sourceInstanceId, alliedTargets, alliedValue);
    currentState = result.state;
    events.push(...result.events);
  } else if (alliedValue < 0 && alliedTargets.length > 0) {
    const result = applyEnfeeble(currentState, sourceInstanceId, alliedTargets, -alliedValue);
    currentState = result.state;
    events.push(...result.events);
  }

  // Apply enemy effect
  if (enemyValue > 0 && enemyTargets.length > 0) {
    const result = applyEnhance(currentState, sourceInstanceId, enemyTargets, enemyValue);
    currentState = result.state;
    events.push(...result.events);
  } else if (enemyValue < 0 && enemyTargets.length > 0) {
    const result = applyEnfeeble(currentState, sourceInstanceId, enemyTargets, -enemyValue);
    currentState = result.state;
    events.push(...result.events);
  }

  return { state: currentState, events };
}

// ── Main effect dispatcher ────────────────────────────────────────────

export function applyEffect(
  state: GameState,
  sourceInstanceId: string,
  effect: AbilityEffect,
  resolvedTargetIds: readonly string[],
  resolvedTargetPositions: readonly Position[],
): EffectResult {
  switch (effect.type) {
    case 'enhance':
      return applyEnhance(state, sourceInstanceId, resolvedTargetIds, effect.value);
    case 'enfeeble':
      return applyEnfeeble(state, sourceInstanceId, resolvedTargetIds, effect.value);
    case 'destroy':
      return applyDestroy(state, sourceInstanceId, resolvedTargetIds);
    case 'addCardToHand':
      return applyAddCardToHand(state, sourceInstanceId, effect.tokenDefinitionId, effect.count);
    case 'spawnCard':
      return applySpawnCard(
        state,
        sourceInstanceId,
        effect.tokenDefinitionId,
        resolvedTargetPositions,
      );
    case 'positionRankManip':
      return applyPositionRankManip(
        state,
        sourceInstanceId,
        effect.bonusPawns,
        resolvedTargetPositions,
      );
    case 'dualTargetBuff':
      return applyDualTargetBuff(
        state,
        sourceInstanceId,
        resolvedTargetIds,
        effect.alliedValue,
        effect.enemyValue,
      );
    case 'selfPowerScaling':
    case 'laneScoreBonus':
    case 'scoreRedistribution':
      // These are handled elsewhere (continuous recalc / scoring time)
      return { state, events: [] };
  }
}
