import { useState, useCallback, useRef, useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import type { CardId } from '@bloodfang/engine';
import { fisherYatesShuffle, getAllGameDefinitions } from '@bloodfang/engine';
import { useOnlineGameStore } from '../../store/online-game-store.ts';
import { useDeckStore } from '../../store/deck-store.ts';
import { Route } from '../../routes.ts';
import { DeckBuilder } from '../deck-builder/deck-builder.tsx';
import { Button } from '../ui/button.tsx';
import { BackButton } from '../ui/back-button.tsx';
import { createSession, joinSession } from '../../lib/server-client.ts';

type Phase = 'choose' | 'create-deck' | 'join' | 'join-deck';

export function OnlineSetupScreen() {
  const [phase, setPhase] = useState<Phase>('choose');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setSession = useOnlineGameStore((s) => s.setSession);
  const setCards = useDeckStore((s) => s.setCards);
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const joinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (phase === 'join') {
      joinInputRef.current?.focus();
    }
  }, [phase]);

  const definitions = getAllGameDefinitions();

  const buildRandomDeck = useCallback((): CardId[] => {
    const ids = Object.values(definitions)
      .filter((d) => !d.isToken)
      .map((c) => c.id);
    return fisherYatesShuffle(ids, Math.random).slice(0, 15);
  }, [definitions]);

  const handleCreate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createSession();
      setSession(result.sessionId, result.token);
      setPhase('create-deck');
    } catch (e) {
      setError(e instanceof Error ? e.message : t`Failed to create session`);
    } finally {
      setLoading(false);
    }
  }, [setSession]);

  const handleJoinSubmit = useCallback(async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await joinSession(joinCode.trim());
      setSession(joinCode.trim() as never, result.token);
      setPhase('join-deck');
    } catch (e) {
      setError(e instanceof Error ? e.message : t`Failed to join session`);
    } finally {
      setLoading(false);
    }
  }, [joinCode, setSession]);

  const setPendingDeck = useOnlineGameStore((s) => s.setPendingDeck);

  const handleDeckConfirm = useCallback(
    (deck: CardId[]) => {
      setPendingDeck(deck);
      void navigate({ to: Route.OnlineLobby });
    },
    [navigate, setPendingDeck],
  );

  if (phase === 'create-deck' || phase === 'join-deck') {
    return (
      <main tabIndex={-1} className="outline-none">
        <div className="p-2 sm:p-4 max-w-6xl mx-auto">
          <BackButton />
        </div>
        <DeckBuilder playerNumber={1} onConfirm={handleDeckConfirm} />
        <div className="text-center mt-4">
          <Button
            onClick={() => {
              setCards(buildRandomDeck());
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

  if (phase === 'join') {
    return (
      <main
        tabIndex={-1}
        className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 sm:gap-6 sm:p-6 outline-none"
      >
        <BackButton />
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl sm:text-3xl font-bold text-text-primary outline-none"
        >
          {t`Join Game`}
        </h1>
        <p className="text-text-secondary text-center max-w-md">
          {t`Enter the game code shared by your opponent.`}
        </p>
        <div className="flex gap-2 items-center">
          <label htmlFor="join-code" className="sr-only">
            {t`Game code`}
          </label>
          <input
            ref={joinInputRef}
            id="join-code"
            type="text"
            value={joinCode}
            onChange={(e) => {
              setJoinCode(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleJoinSubmit();
            }}
            placeholder={t`Enter code`}
            className="bg-surface-raised text-text-primary border border-border rounded-lg px-4 py-2 text-center text-lg tracking-wider w-48 focus:outline-3 focus:outline-focus-ring"
            aria-label={t`Game code`}
          />
          <Button
            onClick={() => void handleJoinSubmit()}
            variant="primary"
            aria-disabled={loading || !joinCode.trim()}
            className={loading || !joinCode.trim() ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {loading ? t`Joining...` : t`Join`}
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-power-debuff text-sm">
            {error}
          </p>
        )}
      </main>
    );
  }

  // phase === 'choose'
  return (
    <main
      tabIndex={-1}
      className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 sm:gap-8 sm:p-8 outline-none"
    >
      <BackButton />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary outline-none"
      >
        {t`Play Online`}
      </h1>
      <p className="text-text-secondary text-center max-w-md">
        {t`Create a new game or join an existing one with a code.`}
      </p>
      <nav className="flex flex-col gap-3 items-center" aria-label={t`Online game options`}>
        <Button
          onClick={() => void handleCreate()}
          variant="primary"
          size="lg"
          className="min-w-[200px]"
          aria-disabled={loading}
        >
          {loading ? t`Creating...` : t`Create Game`}
        </Button>
        <Button
          onClick={() => {
            setPhase('join');
          }}
          size="lg"
          className="min-w-[200px]"
        >
          {t`Join Game`}
        </Button>
      </nav>
      {error && (
        <p role="alert" className="text-power-debuff text-sm">
          {error}
        </p>
      )}
    </main>
  );
}
