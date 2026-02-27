import { useEffect, useRef } from 'react';
import { t } from '@lingui/core/macro';
import type { PlayerId } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { playerTextColor } from '../../lib/player-color.ts';
import { Button } from '../ui/button.tsx';

function getNextPlayer(gameState: {
  phase: string;
  currentPlayerIndex: PlayerId;
  players: readonly { mulliganUsed: boolean }[];
}): PlayerId {
  if (gameState.phase === 'mulligan') {
    const first = gameState.currentPlayerIndex;
    if (gameState.players[first]?.mulliganUsed === false) return first;
    const second: PlayerId = first === 0 ? 1 : 0;
    if (gameState.players[second]?.mulliganUsed === false) return second;
    return first;
  }
  return gameState.currentPlayerIndex;
}

export function TurnTransition() {
  const showTransition = useGameStore((s) => s.showTransition);
  const setShowTransition = useGameStore((s) => s.setShowTransition);
  const gameState = useGameStore((s) => s.gameState);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentPlayer = gameState ? getNextPlayer(gameState) : 0;

  useEffect(() => {
    if (showTransition) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showTransition]);

  const handleCancel = (e: React.SyntheticEvent) => e.preventDefault();

  if (!showTransition) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      aria-label={t`Turn transition`}
      className="fixed inset-0 z-50 bg-surface-overlay flex flex-col items-center justify-center gap-6
        w-full h-full max-w-none max-h-none border-none m-0 p-0"
    >
      <h2 className={`text-3xl font-bold ${playerTextColor(currentPlayer)}`}>
        {t`Player ${currentPlayer + 1}'s Turn`}
      </h2>
      <p className="text-text-secondary">{t`Pass the device to Player ${currentPlayer + 1}`}</p>
      <Button
        ref={buttonRef}
        onClick={() => setShowTransition(false)}
        size="lg"
        autoFocus
        className="min-w-[120px]"
      >
        {t`Ready`}
      </Button>
    </dialog>
  );
}
