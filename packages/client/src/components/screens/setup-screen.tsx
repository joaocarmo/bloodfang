import { useState, useCallback, useEffect, useRef } from 'react';
import type { CardDefinition } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { DeckBuilder } from '../deck-builder/deck-builder.tsx';

type SetupPhase = 'p0-build' | 'p0-transition' | 'p1-build' | 'ready';

export function SetupScreen() {
  const setPlayerDeck = useGameStore((s) => s.setPlayerDeck);
  const startGame = useGameStore((s) => s.startGame);
  const definitions = useGameStore((s) => s.definitions);
  const [phase, setPhase] = useState<SetupPhase>('p0-build');
  const transitionButtonRef = useRef<HTMLButtonElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // Build a random deck for quick start
  const buildRandomDeck = useCallback((): string[] => {
    const nonTokenCards = Object.values(definitions).filter(
      (d): d is CardDefinition => d !== undefined && !d.isToken,
    );
    const shuffled = [...nonTokenCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15).map((c) => c.id);
  }, [definitions]);

  const handleP0Confirm = useCallback(
    (deck: string[]) => {
      setPlayerDeck(0, deck);
      setPhase('p0-transition');
    },
    [setPlayerDeck],
  );

  const handleP1Confirm = useCallback(
    (deck: string[]) => {
      setPlayerDeck(1, deck);
      setPhase('ready');
    },
    [setPlayerDeck],
  );

  useEffect(() => {
    if (phase === 'p0-transition') {
      transitionButtonRef.current?.focus();
    } else if (phase === 'ready') {
      startButtonRef.current?.focus();
    }
  }, [phase]);

  if (phase === 'p0-build') {
    return (
      <div>
        <DeckBuilder playerNumber={1} onConfirm={handleP0Confirm} />
        <div className="text-center mt-4">
          <button
            onClick={() => {
              setPlayerDeck(0, buildRandomDeck());
              setPhase('p0-transition');
            }}
            className="text-sm text-text-muted hover:text-text-secondary underline
              focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 min-h-[36px]"
          >
            Use Random Deck
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'p0-transition') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h2 className="text-2xl font-bold text-text-primary">Player 1 deck saved!</h2>
        <p className="text-text-secondary">Pass the device to Player 2.</p>
        <button
          ref={transitionButtonRef}
          onClick={() => setPhase('p1-build')}
          className="px-8 py-3 bg-p1/20 border border-p1 rounded-lg text-lg font-medium text-p1-light
            hover:bg-p1/30 focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
            min-h-[48px] transition-colors"
        >
          Player 2 — Build Deck
        </button>
      </div>
    );
  }

  if (phase === 'p1-build') {
    return (
      <div>
        <DeckBuilder playerNumber={2} onConfirm={handleP1Confirm} />
        <div className="text-center mt-4">
          <button
            onClick={() => {
              setPlayerDeck(1, buildRandomDeck());
              setPhase('ready');
            }}
            className="text-sm text-text-muted hover:text-text-secondary underline
              focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 min-h-[36px]"
          >
            Use Random Deck
          </button>
        </div>
      </div>
    );
  }

  // phase === 'ready'
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-2xl font-bold text-text-primary">Both decks are ready!</h2>
      <button
        ref={startButtonRef}
        onClick={startGame}
        className="px-8 py-3 bg-p0/20 border border-p0 rounded-lg text-lg font-medium text-p0-light
          hover:bg-p0/30 focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
          min-h-[48px] transition-colors"
      >
        Start Game
      </button>
    </div>
  );
}
