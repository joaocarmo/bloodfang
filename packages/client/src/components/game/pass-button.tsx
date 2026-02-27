import { t } from '@lingui/core/macro';
import { GamePhase } from '@bloodfang/engine';
import { useGameStore, useValidMoves } from '../../store/game-store.ts';
import { Button } from '../ui/button.tsx';

export function PassButton() {
  const gameState = useGameStore((s) => s.gameState);
  const doPass = useGameStore((s) => s.doPass);
  const validMoves = useValidMoves();

  if (!gameState || gameState.phase !== GamePhase.Playing) return null;

  const hasNoMoves = validMoves.length === 0;

  return (
    <Button
      onClick={doPass}
      variant={hasNoMoves ? 'danger' : 'secondary'}
      className={`min-w-[100px] ${hasNoMoves ? '' : 'text-text-secondary'}`}
    >
      {hasNoMoves ? t`Pass (No Moves)` : t`Pass`}
    </Button>
  );
}
