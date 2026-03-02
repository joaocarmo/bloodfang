import { useRef } from 'react';
import { t } from '@lingui/core/macro';
import type { PlayerId } from '@bloodfang/engine';
import { GamePhase } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { playerTextColor } from '../../lib/player-color.ts';
import { getMulliganPlayer } from '../../lib/get-mulligan-player.ts';
import { DialogBase } from '../ui/dialog-base.tsx';
import { Button } from '../ui/button.tsx';

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
  const showTransition = useGameStore((s) => s.showTransition);
  const setShowTransition = useGameStore((s) => s.setShowTransition);
  const gameState = useGameStore((s) => s.gameState);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentPlayer = gameState ? getNextPlayer(gameState) : 0;

  return (
    <DialogBase
      open={showTransition}
      onCancel={() => {}}
      ariaLabel={t`Turn transition`}
      focusRef={buttonRef}
      className="bg-surface-overlay gap-6 p-0"
    >
      <h2 className={`text-2xl sm:text-3xl font-bold ${playerTextColor(currentPlayer)}`}>
        {t`Player ${currentPlayer + 1}'s Turn`}
      </h2>
      <p className="text-text-secondary">{t`Pass the device to Player ${currentPlayer + 1}`}</p>
      <Button
        ref={buttonRef}
        onClick={() => setShowTransition(false)}
        size="lg"
        className="min-w-[120px]"
      >
        {t`Ready`}
      </Button>
    </DialogBase>
  );
}
