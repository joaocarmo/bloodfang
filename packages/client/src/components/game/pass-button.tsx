import { useGameStore, useValidMoves } from '../../store/game-store.ts';

export function PassButton() {
  const gameState = useGameStore((s) => s.gameState);
  const doPass = useGameStore((s) => s.doPass);
  const validMoves = useValidMoves();

  if (!gameState || gameState.phase !== 'playing') return null;

  const hasNoMoves = validMoves.length === 0;

  return (
    <button
      onClick={doPass}
      className={`
        px-6 py-2 rounded-lg font-medium min-h-[44px] min-w-[100px]
        focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
        transition-colors
        ${hasNoMoves
          ? 'bg-p1/30 border border-p1 text-p1-light hover:bg-p1/40'
          : 'bg-surface-raised border border-border text-text-secondary hover:bg-border'
        }
      `}
    >
      {hasNoMoves ? 'Pass (No Moves)' : 'Pass'}
    </button>
  );
}
