import type {
  AbilityDefinition,
  AbilityTriggerType,
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
import {
  ABILITY_TRIGGERS,
  BOARD_COLS,
  EFFECT_TYPES,
  GAME_EVENT_TYPES,
  RANGE_CELL_TYPES,
} from './types.js';
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
    if (cell.type === RANGE_CELL_TYPES.PAWN) continue; // Skip pawn-only cells

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

/**
 * Resolve a TargetSelector to a list of card instance IDs.
 * When `snapshot` is provided, the source card is treated as destroyed (already absent from state).
 */
export function resolveTargets(
  state: GameState,
  sourceInstanceId: string,
  selector: TargetSelector,
  snapshot?: CardInstance,
): { instanceIds: string[]; positions: Position[] } {
  const isDestroyed = snapshot !== undefined;
  const source = snapshot ?? state.cardInstances[sourceInstanceId];
  if (!source) return { instanceIds: [], positions: [] };

  const sourceOwner = source.owner;
  const sourceRow = source.position.row;
  const allInstances = Object.values(state.cardInstances);

  switch (selector.type) {
    case 'self':
      if (isDestroyed) return { instanceIds: [], positions: [] };
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
        .filter(
          (c) => c.owner === sourceOwner && (isDestroyed || c.instanceId !== sourceInstanceId),
        )
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allEnemy': {
      const ids = allInstances.filter((c) => c.owner !== sourceOwner).map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allInLane': {
      const ids = allInstances
        .filter(
          (c) => c.position.row === sourceRow && (isDestroyed || c.instanceId !== sourceInstanceId),
        )
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allAlliedInLane': {
      const ids = allInstances
        .filter(
          (c) =>
            c.position.row === sourceRow &&
            c.owner === sourceOwner &&
            (isDestroyed || c.instanceId !== sourceInstanceId),
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

    case 'allAlliedEnhanced': {
      const ids = allInstances
        .filter(
          (c) =>
            c.owner === sourceOwner &&
            c.hasBeenEnhanced === true &&
            (isDestroyed || c.instanceId !== sourceInstanceId),
        )
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allEnemyEnhanced': {
      const ids = allInstances
        .filter((c) => c.owner !== sourceOwner && c.hasBeenEnhanced === true)
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allEnhanced': {
      const ids = allInstances
        .filter(
          (c) =>
            c.hasBeenEnhanced === true && (isDestroyed || c.instanceId !== sourceInstanceId),
        )
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allAlliedEnfeebled': {
      const ids = allInstances
        .filter(
          (c) =>
            c.owner === sourceOwner &&
            c.hasBeenEnfeebled === true &&
            (isDestroyed || c.instanceId !== sourceInstanceId),
        )
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allEnemyEnfeebled': {
      const ids = allInstances
        .filter((c) => c.owner !== sourceOwner && c.hasBeenEnfeebled === true)
        .map((c) => c.instanceId);
      return { instanceIds: ids, positions: [] };
    }

    case 'allEnfeebled': {
      const ids = allInstances
        .filter(
          (c) =>
            c.hasBeenEnfeebled === true && (isDestroyed || c.instanceId !== sourceInstanceId),
        )
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
        case ABILITY_TRIGGERS.WHEN_PLAYED:
          if (
            event.type === GAME_EVENT_TYPES.CARD_PLAYED &&
            event.instanceId === instance.instanceId
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHEN_DESTROYED:
          // For live cards matching self-destruction — shouldn't normally happen since
          // destroyed cards are removed. This is handled below via destroyedCards map.
          break;

        case ABILITY_TRIGGERS.WHEN_ALLIED_DESTROYED:
          if (
            event.type === GAME_EVENT_TYPES.CARD_DESTROYED &&
            event.owner === instance.owner &&
            event.instanceId !== instance.instanceId
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHEN_ENEMY_DESTROYED:
          if (event.type === GAME_EVENT_TYPES.CARD_DESTROYED && event.owner !== instance.owner) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHEN_ANY_DESTROYED:
          if (
            event.type === GAME_EVENT_TYPES.CARD_DESTROYED &&
            event.instanceId !== instance.instanceId
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED:
          if (
            event.type === GAME_EVENT_TYPES.CARD_ENFEEBLED &&
            event.instanceId === instance.instanceId &&
            !instance.hasBeenEnfeebled
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED:
          if (
            event.type === GAME_EVENT_TYPES.CARD_ENHANCED &&
            event.instanceId === instance.instanceId &&
            !instance.hasBeenEnhanced
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHEN_POWER_REACHES_N:
          if (
            event.type === GAME_EVENT_TYPES.POWER_CHANGED &&
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

        case ABILITY_TRIGGERS.WHEN_ALLIED_PLAYED:
          if (
            event.type === GAME_EVENT_TYPES.CARD_PLAYED &&
            event.owner === instance.owner &&
            event.instanceId !== instance.instanceId
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHEN_ENEMY_PLAYED:
          if (
            event.type === GAME_EVENT_TYPES.CARD_PLAYED &&
            event.owner !== instance.owner
          ) {
            triggers.push({ instanceId: instance.instanceId, ability, triggeringEvent: event });
          }
          break;

        case ABILITY_TRIGGERS.WHILE_IN_PLAY:
        case ABILITY_TRIGGERS.SCALING:
        case ABILITY_TRIGGERS.END_OF_GAME:
          break;
      }
    }

    // Check destroyed cards for whenDestroyed triggers
    if (destroyedCards && event.type === GAME_EVENT_TYPES.CARD_DESTROYED) {
      const destroyed = destroyedCards[event.instanceId];
      if (destroyed) {
        const def = state.cardDefinitions[destroyed.definitionId];
        if (def?.ability?.trigger === ABILITY_TRIGGERS.WHEN_DESTROYED) {
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

    if (ability.trigger === ABILITY_TRIGGERS.WHILE_IN_PLAY) {
      const effect = ability.effect;
      if (
        effect.type === EFFECT_TYPES.ENHANCE ||
        effect.type === EFFECT_TYPES.ENFEEBLE ||
        effect.type === EFFECT_TYPES.DUAL_TARGET_BUFF
      ) {
        const { instanceIds } = resolveTargets(state, instance.instanceId, effect.target);
        if (effect.type === EFFECT_TYPES.DUAL_TARGET_BUFF) {
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
          const value = effect.type === EFFECT_TYPES.ENHANCE ? effect.value : -effect.value;
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

    if (
      ability.trigger === ABILITY_TRIGGERS.SCALING &&
      ability.effect.type === EFFECT_TYPES.SELF_POWER_SCALING
    ) {
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

// ── Trigger Execution ────────────────────────────────────────────────

const ONE_SHOT_FLAGS: Partial<Record<AbilityTriggerType, keyof CardInstance>> = {
  [ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED]: 'hasBeenEnfeebled',
  [ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED]: 'hasBeenEnhanced',
  [ABILITY_TRIGGERS.WHEN_POWER_REACHES_N]: 'powerReachedN',
};

function executeTriggers(
  state: GameState,
  triggers: readonly MatchedTrigger[],
): { state: GameState; events: GameEvent[] } {
  let currentState = state;
  const events: GameEvent[] = [];

  for (const trigger of triggers) {
    const ability = trigger.ability;

    // Special handling for whenDestroyed: card no longer in state
    if (trigger.destroyedSnapshot) {
      const snapshot = trigger.destroyedSnapshot;
      const effect = ability.effect;
      let targetIds: string[] = [];
      let targetPositions: Position[] = [];

      if ('target' in effect) {
        const resolved = resolveTargets(currentState, snapshot.instanceId, effect.target, snapshot);
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
      events.push(...result.events);

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
    const flagName = ONE_SHOT_FLAGS[ability.trigger];
    if (flagName && !instance[flagName]) {
      currentState = {
        ...currentState,
        cardInstances: {
          ...currentState.cardInstances,
          [trigger.instanceId]: { ...instance, [flagName]: true },
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
    events.push(...result.events);

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

  return { state: currentState, events };
}

// ── Death Check ──────────────────────────────────────────────────────

function performDeathCheck(state: GameState): {
  state: GameState;
  deathEvents: GameEvent[];
  destroyedCards: Record<string, CardInstance>;
} {
  const toDestroy: string[] = [];
  for (const instance of Object.values(state.cardInstances)) {
    const power = getEffectivePower(state, instance.instanceId);
    if (power <= 0) {
      toDestroy.push(instance.instanceId);
    }
  }

  // Capture snapshots of dying cards before destroying them (for whenDestroyed)
  const destroyedCards: Record<string, CardInstance> = {};
  for (const instanceId of toDestroy) {
    const instance = state.cardInstances[instanceId];
    if (instance) {
      destroyedCards[instanceId] = instance;
    }
  }

  let currentState = state;
  const deathEvents: GameEvent[] = [];
  for (const instanceId of toDestroy) {
    const instance = currentState.cardInstances[instanceId];
    if (!instance) continue;

    const owner = instance.owner;
    currentState = internalDestroyCard(currentState, instanceId);
    deathEvents.push({ type: GAME_EVENT_TYPES.CARD_DESTROYED, instanceId, owner });
  }

  return { state: currentState, deathEvents, destroyedCards };
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

  // Phase 2: Execute triggers and set flags
  const triggerResult = executeTriggers(state, matchedTriggers);

  // Phase 2b: Set tracking flags for enfeebled/enhanced events (after trigger execution
  // so that one-shot triggers like whenFirstEnfeebled fire correctly, but before
  // the next cascade level so that filtered target selectors can find flagged cards)
  let flaggedState = triggerResult.state;
  for (const event of pendingEvents) {
    if (event.type === GAME_EVENT_TYPES.CARD_ENFEEBLED) {
      const inst = flaggedState.cardInstances[event.instanceId];
      if (inst && !inst.hasBeenEnfeebled) {
        flaggedState = {
          ...flaggedState,
          cardInstances: {
            ...flaggedState.cardInstances,
            [event.instanceId]: { ...inst, hasBeenEnfeebled: true },
          },
        };
      }
    }
    if (event.type === GAME_EVENT_TYPES.CARD_ENHANCED) {
      const inst = flaggedState.cardInstances[event.instanceId];
      if (inst && !inst.hasBeenEnhanced) {
        flaggedState = {
          ...flaggedState,
          cardInstances: {
            ...flaggedState.cardInstances,
            [event.instanceId]: { ...inst, hasBeenEnhanced: true },
          },
        };
      }
    }
  }

  // Phase 3: Recalculate continuous effects from scratch
  const recalculated = recalculateContinuousEffects(flaggedState);

  // Phase 4: Batch death check
  const deathResult = performDeathCheck(recalculated);

  // Phase 5: Recurse if any new events
  const allNewEvents = [...triggerResult.events, ...deathResult.deathEvents];
  if (allNewEvents.length > 0) {
    return resolveAbilities(deathResult.state, allNewEvents, depth + 1, deathResult.destroyedCards);
  }

  return deathResult.state;
}
