import { GamePhase } from '@bloodfang/engine';
import { t } from '@lingui/core/macro';
import { useGame } from '../../context/game-context.tsx';
import { Button } from '../ui/button.tsx';

export function PassButton() {
  const { gameState, doPass, validMoves, isMyTurn } = useGame();

  if (gameState?.phase !== GamePhase.Playing) return null;

  const hasNoMoves = validMoves.length === 0;

  return (
    <Button
      onClick={() => {
        if (isMyTurn) doPass();
      }}
      variant={hasNoMoves ? 'danger' : 'secondary'}
      aria-disabled={!isMyTurn}
      className={`min-w-[100px] ${hasNoMoves ? '' : 'text-text-secondary'} ${!isMyTurn ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {hasNoMoves ? t`Pass (No Moves)` : t`Pass`}
    </Button>
  );
}
