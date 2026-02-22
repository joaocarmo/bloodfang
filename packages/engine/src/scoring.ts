import type { GameState, PlayerId } from './types.js';
import { BOARD_COLS, BOARD_ROWS } from './types.js';
import { getEffectivePower } from './game.js';

export type LaneScores = readonly [number, number][];

export function calculateLaneScores(state: GameState): LaneScores {
  const lanes: [number, number][] = [];

  for (let row = 0; row < BOARD_ROWS; row++) {
    let p0Score = 0;
    let p1Score = 0;

    for (let col = 0; col < BOARD_COLS; col++) {
      const tile = state.board[row]![col]!;
      if (tile.cardInstanceId !== null) {
        const instance = state.cardInstances[tile.cardInstanceId];
        if (instance) {
          const power = getEffectivePower(state, instance.instanceId);
          if (instance.owner === 0) {
            p0Score += power;
          } else {
            p1Score += power;
          }
        }
      }
    }

    lanes.push([p0Score, p1Score]);
  }

  return lanes;
}

export function calculateFinalScores(state: GameState): readonly [number, number] {
  const laneScores: [number, number][] = calculateLaneScores(state).map(
    ([p0, p1]) => [p0, p1] as [number, number],
  );

  // Apply endOfGame abilities from live cards
  for (const instance of Object.values(state.cardInstances)) {
    const def = state.cardDefinitions[instance.definitionId];
    if (!def?.ability || def.ability.trigger !== 'endOfGame') continue;

    const effect = def.ability.effect;
    const lane = laneScores[instance.position.row];
    if (!lane) continue;

    if (effect.type === 'laneScoreBonus') {
      if (instance.owner === 0) {
        lane[0] += effect.value;
      } else {
        lane[1] += effect.value;
      }
    }
  }

  // Check for scoreRedistribution: lane winner gets both scores
  const redistributionLanes = new Set<number>();
  for (const instance of Object.values(state.cardInstances)) {
    const def = state.cardDefinitions[instance.definitionId];
    if (!def?.ability || def.ability.trigger !== 'endOfGame') continue;
    if (def.ability.effect.type === 'scoreRedistribution') {
      redistributionLanes.add(instance.position.row);
    }
  }

  let p0Total = 0;
  let p1Total = 0;

  for (let i = 0; i < laneScores.length; i++) {
    const [p0, p1] = laneScores[i]!;
    if (p0 > p1) {
      if (redistributionLanes.has(i)) {
        p0Total += p0 + p1; // Winner gets both
      } else {
        p0Total += p0;
      }
    } else if (p1 > p0) {
      if (redistributionLanes.has(i)) {
        p1Total += p0 + p1; // Winner gets both
      } else {
        p1Total += p1;
      }
    }
    // Tie: both get 0
  }

  return [p0Total, p1Total];
}

export function determineWinner(finalScores: readonly [number, number]): PlayerId | null {
  if (finalScores[0] > finalScores[1]) return 0;
  if (finalScores[1] > finalScores[0]) return 1;
  return null; // Draw
}
