import { useState, useCallback, useEffect, useRef } from 'react';
import { t } from '@lingui/core/macro';
import type { CardDefinition } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { DeckBuilder } from '../deck-builder/deck-builder.tsx';
import { Button } from '../ui/button.tsx';

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
      <main>
        <DeckBuilder playerNumber={1} onConfirm={handleP0Confirm} />
        <div className="text-center mt-4">
          <Button
            onClick={() => {
              setPlayerDeck(0, buildRandomDeck());
              setPhase('p0-transition');
            }}
            variant="ghost"
            size="sm"
          >
            {t`Use Random Deck`}
          </Button>
        </div>
      </main>
    );
  }

  if (phase === 'p0-transition') {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h2 className="text-2xl font-bold text-text-primary">{t`Player 1 deck saved!`}</h2>
        <p className="text-text-secondary">{t`Pass the device to Player 2.`}</p>
        <Button
          ref={transitionButtonRef}
          onClick={() => setPhase('p1-build')}
          variant="primary"
          size="lg"
          className="bg-p1/20 border-p1 text-p1-light hover:bg-p1/30"
        >
          {t`Player 2 — Build Deck`}
        </Button>
      </main>
    );
  }

  if (phase === 'p1-build') {
    return (
      <main>
        <DeckBuilder playerNumber={2} onConfirm={handleP1Confirm} />
        <div className="text-center mt-4">
          <Button
            onClick={() => {
              setPlayerDeck(1, buildRandomDeck());
              setPhase('ready');
            }}
            variant="ghost"
            size="sm"
          >
            {t`Use Random Deck`}
          </Button>
        </div>
      </main>
    );
  }

  // phase === 'ready'
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-2xl font-bold text-text-primary">{t`Both decks are ready!`}</h2>
      <Button ref={startButtonRef} onClick={startGame} variant="primary" size="lg">
        {t`Start Game`}
      </Button>
    </main>
  );
}
