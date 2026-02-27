import { useEffect, useRef } from 'react';
import type { PlayerId } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentPlayer = gameState ? getNextPlayer(gameState) : 0;

  useEffect(() => {
    if (showTransition && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [showTransition]);

  useEffect(() => {
    if (!showTransition) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showTransition]);

  if (!showTransition) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-surface-overlay flex flex-col items-center justify-center gap-6"
      role="dialog"
      aria-modal="true"
      aria-label="Turn transition"
    >
      <h2 className={`text-3xl font-bold ${currentPlayer === 0 ? 'text-p0' : 'text-p1'}`}>
        Player {currentPlayer + 1}&apos;s Turn
      </h2>
      <p className="text-text-secondary">Pass the device to Player {currentPlayer + 1}</p>
      <button
        ref={buttonRef}
        onClick={() => setShowTransition(false)}
        className="px-8 py-3 bg-surface-raised border border-border rounded-lg text-lg font-medium
          hover:bg-border focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
          min-w-[120px] min-h-[48px] transition-colors"
      >
        Ready
      </button>
    </div>
  );
}
