import { t } from '@lingui/core/macro';
import { useGameStore } from '../../store/game-store.ts';
import { playerTextColor } from '../../lib/player-color.ts';

export function TurnIndicator() {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState) return null;

  const player = gameState.currentPlayerIndex;

  return (
    <div className="text-center" role="status">
      <span className={`${playerTextColor(player)} font-bold text-lg`}>
        {t`Player ${player + 1}'s Turn`}
      </span>
      <span className="text-text-muted text-sm ml-2">{t`Turn ${gameState.turnNumber}`}</span>
    </div>
  );
}
