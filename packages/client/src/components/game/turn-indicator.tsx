import { t } from '@lingui/core/macro';
import { useGame } from '../../context/game-context.tsx';
import { playerTextColor } from '../../lib/player-color.ts';

export function TurnIndicator() {
  const { gameState, isOnline, isMyTurn } = useGame();
  if (!gameState) return null;

  const player = gameState.currentPlayerIndex;

  const turnLabel = isOnline
    ? isMyTurn
      ? t`Your Turn`
      : t`Opponent's Turn`
    : t`Player ${String(player + 1)}'s Turn`;

  return (
    <div className="text-center" role="status">
      <span className={`${playerTextColor(isOnline ? 0 : player)} font-bold text-lg`}>
        {turnLabel}
      </span>
      <span className="text-text-muted text-sm ml-2">{t`Turn ${String(gameState.turnNumber)}`}</span>
    </div>
  );
}
