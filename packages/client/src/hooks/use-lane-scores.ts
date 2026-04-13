import type { LaneScores } from '@bloodfang/engine';
import { calculateLaneScores } from '@bloodfang/engine';
import { useMemo } from 'react';
import { useGame } from '../context/game-context.tsx';

export function useLaneScores(): LaneScores {
  const { gameState } = useGame();

  return useMemo(() => {
    if (!gameState)
      return [
        [0, 0],
        [0, 0],
        [0, 0],
      ];
    // calculateLaneScores only reads board, cardInstances, cardDefinitions, continuousModifiers
    // — all present in both GameState and FilteredGameState
    return calculateLaneScores(gameState as Parameters<typeof calculateLaneScores>[0]);
  }, [gameState]);
}
