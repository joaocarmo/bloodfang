import { useMemo } from 'react';
import { calculateLaneScores } from '@bloodfang/engine';
import type { LaneScores } from '@bloodfang/engine';
import { useGameStore } from '../store/game-store.ts';

export function useLaneScores(): LaneScores {
  const gameState = useGameStore((s) => s.gameState);

  return useMemo(() => {
    if (!gameState)
      return [
        [0, 0],
        [0, 0],
        [0, 0],
      ];
    return calculateLaneScores(gameState);
  }, [gameState]);
}
