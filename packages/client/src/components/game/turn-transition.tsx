import type { PlayerId } from '@bloodfang/engine';
import { GamePhase } from '@bloodfang/engine';
import { t } from '@lingui/core/macro';
import { useRef } from 'react';
import { useGame } from '../../context/game-context.tsx';
import { getMulliganPlayer } from '../../lib/get-mulligan-player.ts';
import { playerTextColor } from '../../lib/player-color.ts';
import { Button } from '../ui/button.tsx';
import { DialogBase } from '../ui/dialog-base.tsx';

function getNextPlayer(gameState: {
  phase: GamePhase;
  currentPlayerIndex: PlayerId;
  players: readonly { mulliganUsed: boolean }[];
}): PlayerId {
  if (gameState.phase === GamePhase.Mulligan) {
    return getMulliganPlayer(gameState);
  }
  return gameState.currentPlayerIndex;
}

export function TurnTransition() {
  const { showTransition, setShowTransition, gameState } = useGame();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentPlayer = gameState ? getNextPlayer(gameState) : 0;

  return (
    <DialogBase
      open={showTransition}
      onCancel={() => {
        /* noop */
      }}
      ariaLabel={t`Turn transition`}
      focusRef={buttonRef}
      className="bg-surface-overlay gap-6 p-0"
    >
      <h2 className={`text-2xl sm:text-3xl font-bold ${playerTextColor(currentPlayer)}`}>
        {t`Player ${String(currentPlayer + 1)}'s Turn`}
      </h2>
      <p className="text-text-secondary">{t`Pass the device to Player ${String(currentPlayer + 1)}`}</p>
      <Button
        ref={buttonRef}
        onClick={() => {
          setShowTransition(false);
        }}
        size="lg"
        className="min-w-[120px]"
      >
        {t`Ready`}
      </Button>
    </DialogBase>
  );
}
