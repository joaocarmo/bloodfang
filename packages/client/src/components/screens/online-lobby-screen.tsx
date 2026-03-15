import { useEffect, useRef, useCallback, useState } from 'react';
import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import { ClientMessageType, SessionPhase, WaitingReason } from '@bloodfang/server/protocol';
import { useOnlineGameStore } from '../../store/online-game-store.ts';
import { useWebSocket } from '../../hooks/use-websocket.ts';
import { Route } from '../../routes.ts';
import { Button } from '../ui/button.tsx';

export function OnlineLobbyScreen() {
  const sessionId = useOnlineGameStore((s) => s.sessionId);
  const playerToken = useOnlineGameStore((s) => s.playerToken);
  const sessionPhase = useOnlineGameStore((s) => s.sessionPhase);
  const opponentConnected = useOnlineGameStore((s) => s.opponentConnected);
  const waitingReason = useOnlineGameStore((s) => s.waitingReason);
  const filteredGameState = useOnlineGameStore((s) => s.filteredGameState);
  const serverError = useOnlineGameStore((s) => s.serverError);
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const [deckSubmitted, setDeckSubmitted] = useState(false);

  const pendingDeck = useOnlineGameStore((s) => s.pendingDeck);

  const { status, send, disconnect } = useWebSocket(sessionId, playerToken);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // Submit deck once connected and server is ready for decks
  const canSubmitDeck =
    sessionPhase === SessionPhase.WaitingForDecks ||
    sessionPhase === SessionPhase.Mulligan ||
    sessionPhase === SessionPhase.Playing;

  useEffect(() => {
    if (status === 'connected' && pendingDeck && !deckSubmitted && canSubmitDeck) {
      send({ type: ClientMessageType.SubmitDeck, deck: [...pendingDeck] });
      setDeckSubmitted(true);
    }
  }, [status, pendingDeck, deckSubmitted, send, canSubmitDeck]);

  // Navigate to game when we receive first game state
  useEffect(() => {
    if (filteredGameState) {
      void navigate({ to: Route.OnlineGame });
    }
  }, [filteredGameState, navigate]);

  const handleCopy = useCallback(async () => {
    if (!sessionId) return;
    await navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [sessionId]);

  const handleLeave = useCallback(() => {
    disconnect();
    useOnlineGameStore.getState().reset();
    void navigate({ to: Route.Home });
  }, [disconnect, navigate]);

  const statusMessage = (() => {
    if (status === 'connecting') return t`Connecting to server...`;
    if (status === 'disconnected') return t`Disconnected from server.`;
    if (sessionPhase === SessionPhase.WaitingForPlayers && !opponentConnected)
      return t`Waiting for opponent to join...`;
    if (!deckSubmitted && canSubmitDeck) return t`Submitting deck...`;
    if (!deckSubmitted) return t`Waiting for opponent to join...`;
    if (waitingReason === WaitingReason.OpponentDeck) return t`Waiting for opponent's deck...`;
    if (waitingReason === WaitingReason.OpponentReconnecting) return t`Opponent reconnecting...`;
    if (sessionPhase === SessionPhase.WaitingForDecks) return t`Waiting for opponent's deck...`;
    if (serverError) return t`Error: ${serverError.message}`;
    return t`Waiting for game to start...`;
  })();

  return (
    <main
      tabIndex={-1}
      className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 sm:gap-6 sm:p-6 outline-none"
    >
      <Button onClick={handleLeave} variant="ghost" size="sm">{t`← Leave`}</Button>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl sm:text-3xl font-bold text-text-primary outline-none"
      >
        {t`Game Lobby`}
      </h1>

      {sessionId && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-text-secondary text-sm">{t`Share this code with your opponent:`}</p>
          <div className="flex items-center gap-2">
            <code className="bg-surface-raised text-text-primary text-xl sm:text-2xl font-mono px-4 py-2 rounded-lg tracking-wider select-all">
              {sessionId}
            </code>
            <Button
              onClick={() => void handleCopy()}
              variant="ghost"
              size="sm"
              aria-label={t`Copy game code`}
            >
              {copied ? t`Copied!` : t`Copy`}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-2" role="status" aria-live="polite">
        <div className="flex items-center gap-2">
          {status === 'connected' ? (
            <span className="w-2 h-2 rounded-full bg-power-buff" aria-hidden="true" />
          ) : (
            <span
              className="w-2 h-2 rounded-full bg-power-debuff animate-pulse"
              aria-hidden="true"
            />
          )}
          <span className="text-text-secondary">{statusMessage}</span>
        </div>
        {opponentConnected && (
          <span className="text-power-buff text-sm">{t`Opponent connected`}</span>
        )}
      </div>

      {serverError && (
        <p role="alert" className="text-power-debuff text-sm">
          {serverError.message}
        </p>
      )}
    </main>
  );
}
