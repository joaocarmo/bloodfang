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
  const laneScores = calculateLaneScores(state);
  let p0Total = 0;
  let p1Total = 0;

  for (const [p0, p1] of laneScores) {
    if (p0 > p1) {
      p0Total += p0;
      // p1 gets 0 (loser)
    } else if (p1 > p0) {
      p1Total += p1;
      // p0 gets 0 (loser)
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
