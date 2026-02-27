import { useState, useCallback, useEffect, useRef } from 'react';
import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import type { CardDefinition } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { Route } from '../../routes.ts';
import { DeckBuilder } from '../deck-builder/deck-builder.tsx';
import { Button } from '../ui/button.tsx';
import { BackButton } from '../ui/back-button.tsx';

enum SetupPhase {
  P0Build = 'p0-build',
  P0Transition = 'p0-transition',
  P1Build = 'p1-build',
  Ready = 'ready',
}

export function SetupScreen() {
  const setPlayerDeck = useGameStore((s) => s.setPlayerDeck);
  const startGame = useGameStore((s) => s.startGame);
  const definitions = useGameStore((s) => s.definitions);
  const navigate = useNavigate();
  const [phase, setPhase] = useState(SetupPhase.P0Build);
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
      setPhase(SetupPhase.P0Transition);
    },
    [setPlayerDeck],
  );

  const handleP1Confirm = useCallback(
    (deck: string[]) => {
      setPlayerDeck(1, deck);
      setPhase(SetupPhase.Ready);
    },
    [setPlayerDeck],
  );

  const handleStartGame = useCallback(() => {
    startGame();
    navigate({ to: Route.Game });
  }, [startGame, navigate]);

  useEffect(() => {
    if (phase === SetupPhase.P0Transition) {
      transitionButtonRef.current?.focus();
    } else if (phase === SetupPhase.Ready) {
      startButtonRef.current?.focus();
    }
  }, [phase]);

  if (phase === SetupPhase.P0Build) {
    return (
      <main tabIndex={-1} className="outline-none">
        <div className="p-4">
          <BackButton />
        </div>
        <DeckBuilder playerNumber={1} onConfirm={handleP0Confirm} />
        <div className="text-center mt-4">
          <Button
            onClick={() => {
              setPlayerDeck(0, buildRandomDeck());
              setPhase(SetupPhase.P0Transition);
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

  if (phase === SetupPhase.P0Transition) {
    return (
      <main
        tabIndex={-1}
        className="flex flex-col items-center justify-center min-h-screen gap-4 sm:gap-6 outline-none"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{t`Player 1 deck saved!`}</h2>
        <p className="text-text-secondary">{t`Pass the device to Player 2.`}</p>
        <Button
          ref={transitionButtonRef}
          onClick={() => setPhase(SetupPhase.P1Build)}
          variant="primary"
          size="lg"
          className="bg-p1/20 border-p1 text-p1-light hover:bg-p1/30"
        >
          {t`Player 2 — Build Deck`}
        </Button>
      </main>
    );
  }

  if (phase === SetupPhase.P1Build) {
    return (
      <main tabIndex={-1} className="outline-none">
        <DeckBuilder playerNumber={2} onConfirm={handleP1Confirm} />
        <div className="text-center mt-4">
          <Button
            onClick={() => {
              setPlayerDeck(1, buildRandomDeck());
              setPhase(SetupPhase.Ready);
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

  // phase === SetupPhase.Ready
  return (
    <main
      tabIndex={-1}
      className="flex flex-col items-center justify-center min-h-screen gap-4 sm:gap-6 outline-none"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{t`Both decks are ready!`}</h2>
      <Button ref={startButtonRef} onClick={handleStartGame} variant="primary" size="lg">
        {t`Start Game`}
      </Button>
    </main>
  );
}
