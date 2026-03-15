import { useMemo } from 'react';
import type { Position } from '@bloodfang/engine';
import { useGame } from '../context/game-context.tsx';

export function useValidMovesForCard(cardId: string | null): Position[] {
  const { validMoves } = useGame();

  return useMemo(() => {
    if (!cardId) return [];
    const cardMoves = validMoves.find((m) => m.cardId === cardId);
    return cardMoves?.positions ? [...cardMoves.positions] : [];
  }, [validMoves, cardId]);
}

export function useHasValidMoves(cardId: string): boolean {
  const { validMoves } = useGame();

  return useMemo(() => {
    const cardMoves = validMoves.find((m) => m.cardId === cardId);
    return (cardMoves?.positions.length ?? 0) > 0;
  }, [validMoves, cardId]);
}
