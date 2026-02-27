import { useGameStore, useValidMoves } from '../../store/game-store.ts';
import { Button } from '../ui/button.tsx';

export function PassButton() {
  const gameState = useGameStore((s) => s.gameState);
  const doPass = useGameStore((s) => s.doPass);
  const validMoves = useValidMoves();

  if (!gameState || gameState.phase !== 'playing') return null;

  const hasNoMoves = validMoves.length === 0;

  return (
    <Button
      onClick={doPass}
      variant={hasNoMoves ? 'danger' : 'secondary'}
      className={hasNoMoves ? '' : 'text-text-secondary'}
      style={{ minWidth: 100 }}
    >
      {hasNoMoves ? 'Pass (No Moves)' : 'Pass'}
    </Button>
  );
}
