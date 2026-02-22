import type {
  AbilityDefinition,
  CardInstance,
  ContinuousModifier,
  GameEvent,
  GameState,
  PlayerId,
  Position,
  RangeCell,
  ScalingCondition,
  TargetSelector,
} from './types.js';
import { BOARD_COLS } from './types.js';
import { isValidPosition } from './board.js';
import { applyEffect, internalDestroyCard } from './effects.js';
import { getEffectivePower } from './game.js';

// ── Constants ─────────────────────────────────────────────────────────

const MAX_CASCADE_DEPTH = 100;

// ── resolveAbilityRangePattern ────────────────────────────────────────

/** Like resolveRangePattern but includes 'ability' and 'both' cells (skips 'pawn'-only). */
export function resolveAbilityRangePattern(
  rangePattern: readonly RangeCell[],
  cardPosition: Position,
  player: PlayerId,
): Position[] {
  const positions: Position[] = [];
  for (const cell of rangePattern) {
    if (cell.type === 'pawn') continue; // Skip pawn-only cells

    const row = cardPosition.row + cell.row;
    const col = player === 0 ? cardPosition.col + cell.col : cardPosition.col - cell.col;

    const pos = { row, col };
    if (isValidPosition(pos)) {
      positions.push(pos);
    }
  }
  return positions;
}

// ── resolveTargets ────────────────────────────────────────────────────

/** Resolve a TargetSelector to a list of card instance IDs. */
export function resolveTargets(
  state: GameState,
  sourceInstanceId: string,
  selector: TargetSelector,
): { instanceIds: string[]; positions: Position[] } {
  const source = state.cardInstances[sourceInstanceId];
  if (!source) return { instanceIds: [], positions: [] };

  const sourceOwner = source.owner;
  const sourceRow = source.position.row;
  const allInstances = Object.values(state.cardInstances);

  switch (selector.type) {
    case 'self':
      return { instanceIds: [sourceInstanceId], positions: [source.position] };

    case 'rangePattern': {
      const def = state.cardDefinitions[source.definitionId];
      if (!def) return { instanceIds: [], positions: [] };

      const positions = resolveAbilityRangePattern(def.rangePattern, source.position, sourceOwner);
      const instanceIds: string[] = [];
      for (const pos of positions) {
        const tile = state.board[pos.row]?.[pos.col];
        if (tile?.cardInstanceId && state.cardInstances[tile.cardInstanceId]) {
          instanceIds.push(tile.cardInstanceId);
        }
      }
      return { instanceIds, positions };
    }

    case 'allAllied': {
      const ids = allInstances
        .filter((c) => c.owner === sourceOwner && c.instanceId !== sourceInstanceId)
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allEnemy': {
      const ids = allInstances.filter((c) => c.owner !== sourceOwner).map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allInLane': {
      const ids = allInstances
        .filter((c) => c.position.row === sourceRow && c.instanceId !== sourceInstanceId)
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allAlliedInLane': {
      const ids = allInstances
        .filter(
          (c) =>
            c.position.row === sourceRow &&
            c.owner === sourceOwner &&
            c.instanceId !== sourceInstanceId,
        )
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allEnemyInLane': {
      const ids = allInstances
        .filter((c) => c.position.row === sourceRow && c.owner !== sourceOwner)
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }
  }
}

// ── Trigger Matching ──────────────────────────────────────────────────

interface MatchedTrigger {
  readonly instanceId: string;
  readonly ability: AbilityDefinition;
  readonly triggeringEvent: GameEvent;
  /** For whenDestroyed triggers, the card has been removed from state but we keep a snapshot. */
  readonly destroyedSnapshot?: CardInstance;
}

/**
 * Collect triggers matching the given events.
 * @param destroyedCards — Card instances that were just destroyed (for whenDestroyed matching).
 *                         These cards are no longer in state.cardInstances.
 */
export function collectTriggersForEvents(
  state: GameState,
  events: readonly GameEvent[],
  destroyedCards?: Readonly<Record<string, CardInstance>>,
): MatchedTrigger[] {
  const triggers: MatchedTrigger[] = [];

  for (const event of events) {
    // Check live cards for all trigger types except whenDestroyed-self
    for (const instance of Object.values(state.cardInstances)) {
      const def = state.cardDefinitions[instance.definitionId];
      if (!def?.ability) continue;

      const ability = def.ability;
      const trigger = ability.trigger;

      switch (trigger) {
        case 'whenPlayed':
          if (event.type === 'cardPlayed' && event.instanceId === instance.instanceId) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case 'whenDestroyed':
          // For live cards matching self-destruction — shouldn't normally happen since
          // destroyed cards are removed. This is handled below via destroyedCards map.
          break;

        case 'whenAlliedDestroyed':
          if (
            event.type === 'cardDestroyed' &&
            event.owner === instance.owner &&
            event.instanceId !== instance.instanceId
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case 'whenEnemyDestroyed':
          if (event.type === 'cardDestroyed' && event.owner !== instance.owner) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case 'whenAnyDestroyed':
          if (event.type === 'cardDestroyed' && event.instanceId !== instance.instanceId) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case 'whenFirstEnfeebled':
          if (
            event.type === 'cardEnfeebled' &&
            event.instanceId === instance.instanceId &&
            !instance.hasBeenEnfeebled
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case 'whenFirstEnhanced':
          if (
            event.type === 'cardEnhanced' &&
            event.instanceId === instance.instanceId &&
            !instance.hasBeenEnhanced
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case 'whenPowerReachesN':
          if (
            event.type === 'powerChanged' &&
            event.instanceId === instance.instanceId &&
            !instance.powerReachedN &&
            ability.threshold !== undefined
          ) {
            const power = getEffectivePower(state, instance.instanceId);
            if (power >= ability.threshold) {
              triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
            }
          }
          break;

        case 'whileInPlay':
        case 'scaling':
        case 'endOfGame':
          break;
      }
    }

    // Check destroyed cards for whenDestroyed triggers
    if (destroyedCards && event.type === 'cardDestroyed') {
      const destroyed = destroyedCards[event.instanceId];
      if (destroyed) {
        const def = state.cardDefinitions[destroyed.definitionId];
        if (def?.ability?.trigger === 'whenDestroyed') {
          triggers.push({
            instanceId: destroyed.instanceId,
            ability: def.ability,
            triggeringEvent: event,
            destroyedSnapshot: destroyed,
          });
        }
      }
    }
  }

  // Sort by instanceId ascending (order of play)
  triggers.sort((a, b) => {
    const aNum = parseInt(a.instanceId, 10);
    const bNum = parseInt(b.instanceId, 10);
    return aNum - bNum;
  });

  return triggers;
}

// ── Continuous Effect Recalculation ───────────────────────────────────

function countScalingCondition(
  state: GameState,
  sourceInstance: CardInstance,
  condition: ScalingCondition,
): number {
  const allInstances = Object.values(state.cardInstances);
  const sourceOwner = sourceInstance.owner;
  const sourceRow = sourceInstance.position.row;

  switch (condition.type) {
    case 'alliedCardsInLane':
      return allInstances.filter(
        (c) =>
          c.owner === sourceOwner &&
          c.position.row === sourceRow &&
          c.instanceId !== sourceInstance.instanceId,
      ).length;

    case 'enemyCardsInLane':
      return allInstances.filter((c) => c.owner !== sourceOwner && c.position.row === sourceRow)
        .length;

    case 'alliedCardsOnBoard':
      return allInstances.filter(
        (c) => c.owner === sourceOwner && c.instanceId !== sourceInstance.instanceId,
      ).length;

    case 'enemyCardsOnBoard':
      return allInstances.filter((c) => c.owner !== sourceOwner).length;

    case 'allCardsOnBoard':
      return allInstances.filter((c) => c.instanceId !== sourceInstance.instanceId).length;

    case 'controlledTilesInLane': {
      let count = 0;
      for (let col = 0; col < BOARD_COLS; col++) {
        const tile = state.board[sourceRow]?.[col];
        if (tile?.owner === sourceOwner) count++;
      }
      return count;
    }
  }
}

export function recalculateContinuousEffects(state: GameState): GameState {
  const newModifiers: ContinuousModifier[] = [];

  for (const instance of Object.values(state.cardInstances)) {
    const def = state.cardDefinitions[instance.definitionId];
    if (!def?.ability) continue;

    const ability = def.ability;

    if (ability.trigger === 'whileInPlay') {
      const effect = ability.effect;
      if (
        effect.type === 'enhance' ||
        effect.type === 'enfeeble' ||
        effect.type === 'dualTargetBuff'
      ) {
        const { instanceIds } = resolveTargets(state, instance.instanceId, effect.target);
        if (effect.type === 'dualTargetBuff') {
          for (const targetId of instanceIds) {
            const target = state.cardInstances[targetId];
            if (!target) continue;
            const value = target.owner === instance.owner ? effect.alliedValue : effect.enemyValue;
            if (value !== 0) {
              newModifiers.push({
                sourceInstanceId: instance.instanceId,
                targetInstanceId: targetId,
                value,
              });
            }
          }
        } else {
          const value = effect.type === 'enhance' ? effect.value : -effect.value;
          for (const targetId of instanceIds) {
            newModifiers.push({
              sourceInstanceId: instance.instanceId,
              targetInstanceId: targetId,
              value,
            });
          }
        }
      }
    }

    if (ability.trigger === 'scaling' && ability.effect.type === 'selfPowerScaling') {
      const scalingEffect = ability.effect;
      const count = countScalingCondition(state, instance, scalingEffect.condition);
      const value = count * scalingEffect.valuePerUnit;
      if (value !== 0) {
        newModifiers.push({
          sourceInstanceId: instance.instanceId,
          targetInstanceId: instance.instanceId,
          value,
        });
      }
    }
  }

  return {
    ...state,
    continuousModifiers: newModifiers,
  };
}

// ── resolveTargets for destroyed card snapshot ────────────────────────

function resolveTargetsForDestroyedCard(
  state: GameState,
  snapshot: CardInstance,
  selector: TargetSelector,
): { instanceIds: string[]; positions: Position[] } {
  const allInstances = Object.values(state.cardInstances);
  const sourceOwner = snapshot.owner;
  const sourceRow = snapshot.position.row;

  switch (selector.type) {
    case 'self':
      // Self is already destroyed, nothing to target
      return { instanceIds: [], positions: [] };

    case 'rangePattern': {
      const def = state.cardDefinitions[snapshot.definitionId];
      if (!def) return { instanceIds: [], positions: [] };
      const positions = resolveAbilityRangePattern(
        def.rangePattern,
        snapshot.position,
        sourceOwner,
      );
      const instanceIds: string[] = [];
      for (const pos of positions) {
        const tile = state.board[pos.row]?.[pos.col];
        if (tile?.cardInstanceId && state.cardInstances[tile.cardInstanceId]) {
          instanceIds.push(tile.cardInstanceId);
        }
      }
      return { instanceIds, positions };
    }

    case 'allAllied':
      return {
        instanceIds: allInstances.filter((c) => c.owner === sourceOwner).map((c) => c.instanceId),
        positions: [],
      };

    case 'allEnemy':
      return {
        instanceIds: allInstances.filter((c) => c.owner !== sourceOwner).map((c) => c.instanceId),
        positions: [],
      };

    case 'allInLane':
      return {
        instanceIds: allInstances
          .filter((c) => c.position.row === sourceRow)
          .map((c) => c.instanceId),
        positions: [],
      };

    case 'allAlliedInLane':
      return {
        instanceIds: allInstances
          .filter((c) => c.position.row === sourceRow && c.owner === sourceOwner)
          .map((c) => c.instanceId),
        positions: [],
      };

    case 'allEnemyInLane':
      return {
        instanceIds: allInstances
          .filter((c) => c.position.row === sourceRow && c.owner !== sourceOwner)
          .map((c) => c.instanceId),
        positions: [],
      };
  }
}

// ── The Cascade Resolver ──────────────────────────────────────────────

export function resolveAbilities(
  state: GameState,
  pendingEvents: readonly GameEvent[],
  depth: number = 0,
  destroyedCards?: Readonly<Record<string, CardInstance>>,
): GameState {
  if (depth > MAX_CASCADE_DEPTH) {
    throw new Error(`Ability cascade exceeded maximum depth of ${MAX_CASCADE_DEPTH}`);
  }

  if (pendingEvents.length === 0) return state;

  // Phase 1: Collect triggers
  const matchedTriggers = collectTriggersForEvents(state, pendingEvents, destroyedCards);

  // Phase 2: Execute each trigger
  let currentState = state;
  const newEvents: GameEvent[] = [];

  for (const trigger of matchedTriggers) {
    const ability = trigger.ability;

    // Special handling for whenDestroyed: card no longer in state
    if (trigger.destroyedSnapshot) {
      const snapshot = trigger.destroyedSnapshot;
      const effect = ability.effect;
      let targetIds: string[] = [];
      let targetPositions: Position[] = [];

      if ('target' in effect) {
        const resolved = resolveTargetsForDestroyedCard(currentState, snapshot, effect.target);
        targetIds = resolved.instanceIds;
        targetPositions = resolved.positions;
      }

      // Temporarily re-add snapshot so effect handlers that look up the source card work
      const stateWithSnapshot: GameState = {
        ...currentState,
        cardInstances: { ...currentState.cardInstances, [snapshot.instanceId]: snapshot },
      };
      const result = applyEffect(
        stateWithSnapshot,
        snapshot.instanceId,
        effect,
        targetIds,
        targetPositions,
      );
      // Remove the snapshot again from the result
      const resultInstances = { ...result.state.cardInstances };
      delete resultInstances[snapshot.instanceId];
      currentState = { ...result.state, cardInstances: resultInstances };
      newEvents.push(...result.events);

      currentState = {
        ...currentState,
        log: [
          ...currentState.log,
          {
            type: 'abilityTrigger' as const,
            instanceId: trigger.instanceId,
            abilityTrigger: ability.trigger,
          },
        ],
      };
      continue;
    }

    // Normal triggers: card must still exist
    if (!currentState.cardInstances[trigger.instanceId]) continue;

    const instance = currentState.cardInstances[trigger.instanceId]!;

    // Set one-shot flags if applicable
    if (ability.trigger === 'whenFirstEnfeebled' && !instance.hasBeenEnfeebled) {
      currentState = {
        ...currentState,
        cardInstances: {
          ...currentState.cardInstances,
          [trigger.instanceId]: { ...instance, hasBeenEnfeebled: true },
        },
      };
    }
    if (ability.trigger === 'whenFirstEnhanced' && !instance.hasBeenEnhanced) {
      currentState = {
        ...currentState,
        cardInstances: {
          ...currentState.cardInstances,
          [trigger.instanceId]: { ...instance, hasBeenEnhanced: true },
        },
      };
    }
    if (ability.trigger === 'whenPowerReachesN' && !instance.powerReachedN) {
      currentState = {
        ...currentState,
        cardInstances: {
          ...currentState.cardInstances,
          [trigger.instanceId]: { ...instance, powerReachedN: true },
        },
      };
    }

    // Resolve targets
    const effect = ability.effect;
    let targetIds: string[] = [];
    let targetPositions: Position[] = [];

    if ('target' in effect) {
      const resolved = resolveTargets(currentState, trigger.instanceId, effect.target);
      targetIds = resolved.instanceIds;
      targetPositions = resolved.positions;
    }

    // Apply effect
    const result = applyEffect(
      currentState,
      trigger.instanceId,
      effect,
      targetIds,
      targetPositions,
    );
    currentState = result.state;
    newEvents.push(...result.events);

    // Log ability trigger
    currentState = {
      ...currentState,
      log: [
        ...currentState.log,
        {
          type: 'abilityTrigger' as const,
          instanceId: trigger.instanceId,
          abilityTrigger: ability.trigger,
        },
      ],
    };
  }

  // Phase 3: Recalculate continuous effects from scratch
  currentState = recalculateContinuousEffects(currentState);

  // Phase 4: Death check — batch all cards with effectivePower ≤ 0
  const deathEvents: GameEvent[] = [];
  const toDestroy: string[] = [];

  for (const instance of Object.values(currentState.cardInstances)) {
    const power = getEffectivePower(currentState, instance.instanceId);
    if (power <= 0) {
      toDestroy.push(instance.instanceId);
    }
  }

  // Capture snapshots of dying cards before destroying them (for whenDestroyed)
  const newDestroyedCards: Record<string, CardInstance> = {};
  for (const instanceId of toDestroy) {
    const instance = currentState.cardInstances[instanceId];
    if (instance) {
      newDestroyedCards[instanceId] = instance;
    }
  }

  for (const instanceId of toDestroy) {
    const instance = currentState.cardInstances[instanceId];
    if (!instance) continue;

    const owner = instance.owner;
    currentState = internalDestroyCard(currentState, instanceId);
    deathEvents.push({ type: 'cardDestroyed', instanceId, owner });
  }

  // Phase 5: Recurse if any new events
  const allNewEvents = [...newEvents, ...deathEvents];
  if (allNewEvents.length > 0) {
    return resolveAbilities(currentState, allNewEvents, depth + 1, newDestroyedCards);
  }

  return currentState;
}
