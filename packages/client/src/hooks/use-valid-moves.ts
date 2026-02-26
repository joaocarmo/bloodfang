import { useMemo } from 'react';
import type { Position } from '@bloodfang/engine';
import { getValidMoves } from '@bloodfang/engine';
import { useGameStore } from '../store/game-store.ts';

export function useValidMovesForCard(cardId: string | null): Position[] {
  const gameState = useGameStore((s) => s.gameState);

  return useMemo(() => {
    if (!gameState || !cardId || gameState.phase !== 'playing') return [];
    const moves = getValidMoves(gameState);
    const cardMoves = moves.find((m) => m.cardId === cardId);
    return cardMoves?.positions ?? [];
  }, [gameState, cardId]);
}

export function useHasValidMoves(cardId: string): boolean {
  const gameState = useGameStore((s) => s.gameState);

  return useMemo(() => {
    if (!gameState || gameState.phase !== 'playing') return false;
    const moves = getValidMoves(gameState);
    const cardMoves = moves.find((m) => m.cardId === cardId);
    return (cardMoves?.positions.length ?? 0) > 0;
  }, [gameState, cardId]);
}
