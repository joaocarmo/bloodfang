import { useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { useNavigate, useBlocker } from '@tanstack/react-router';
import { GamePhase } from '@bloodfang/engine';
import { useOnlineGameStore } from '../../store/online-game-store.ts';
import { useWebSocket } from '../../hooks/use-websocket.ts';
import { useSettingsStore } from '../../store/settings-store.ts';
import { useGame } from '../../context/game-context.tsx';
import { OnlineGameProvider } from '../../context/online-game-provider.tsx';
import { Route } from '../../routes.ts';
import { Board } from '../board/board.tsx';
import { Hand } from '../hand/hand.tsx';
import { MulliganScreen } from './mulligan-screen.tsx';
import { TurnIndicator } from './turn-indicator.tsx';
import { PassButton } from './pass-button.tsx';
import { ActionLog } from './action-log.tsx';
import { GameMenu } from './game-menu.tsx';
import { SelectedCardDetail } from './selected-card-detail.tsx';
import { ConfirmDialog } from '../ui/confirm-dialog.tsx';

function OnlineGameContent() {
  const { gameState, resetToHome } = useGame();
  const showActionLog = useSettingsStore((s) => s.showActionLog);
  const opponentConnected = useOnlineGameStore((s) => s.opponentConnected);
  const connectionStatus = useOnlineGameStore((s) => s.connectionStatus);
  const navigate = useNavigate();

  // Navigate to results when game ends
  useEffect(() => {
    if (gameState?.phase === GamePhase.Ended) {
      void navigate({ to: Route.OnlineResults });
    }
  }, [gameState?.phase, navigate]);

  // Block navigation when game is in progress
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => gameState !== null && gameState.phase !== GamePhase.Ended,
    withResolver: true,
  });

  if (!gameState) {
    return (
      <main tabIndex={-1} className="flex items-center justify-center min-h-screen outline-none">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-4 border-text-muted border-t-text-primary rounded-full motion-safe:animate-spin"
            aria-hidden="true"
          />
          <p className="text-text-secondary">{t`Game starting...`}</p>
        </div>
      </main>
    );
  }

  // Mulligan phase
  if (gameState.phase === GamePhase.Mulligan) {
    const myMulliganDone = gameState.players[0].mulliganUsed;
    if (!myMulliganDone) {
      return (
        <main tabIndex={-1} className="outline-none">
          <MulliganScreen />
        </main>
      );
    }
    return (
      <main
        tabIndex={-1}
        className="flex flex-col items-center justify-center min-h-screen gap-4 outline-none"
      >
        <p className="text-text-secondary text-lg">{t`Waiting for opponent's mulligan...`}</p>
      </main>
    );
  }

  const opponentDeckCount =
    'deckCount' in gameState.players[1] ? gameState.players[1].deckCount : undefined;

  return (
    <>
      <ConfirmDialog
        open={status === 'blocked'}
        title={t`Leave game?`}
        description={t`Your game progress will be lost.`}
        confirmLabel={t`Leave`}
        cancelLabel={t`Cancel`}
        onConfirm={() => {
          resetToHome();
          proceed?.();
        }}
        onCancel={() => {
          reset?.();
        }}
      />
      <main
        tabIndex={-1}
        className="flex flex-col gap-2 p-2 sm:gap-3 sm:p-3 md:gap-4 md:p-4 max-w-4xl mx-auto outline-none"
      >
        <h1 className="sr-only">{t`Online Game`}</h1>

        {/* Connection status banner */}
        {connectionStatus !== 'connected' && (
          <div
            role="alert"
            className="bg-power-debuff/20 text-power-debuff text-center py-1 rounded text-sm"
          >
            {t`Reconnecting...`}
          </div>
        )}

        {/* Opponent disconnected overlay */}
        {!opponentConnected && connectionStatus === 'connected' && (
          <div
            role="alert"
            className="bg-surface-raised text-text-secondary text-center py-1 rounded text-sm"
          >
            {t`Opponent disconnected. Waiting for reconnection...`}
          </div>
        )}

        <div className="flex items-center justify-between">
          <GameMenu />
          <TurnIndicator />
          <div className="w-10" />
        </div>

        {/* Opponent info */}
        {opponentDeckCount !== undefined && (
          <div
            className="text-xs text-text-muted text-center"
            role="status"
            aria-label={t`Opponent has ${String(opponentDeckCount)} cards in deck`}
          >
            {t`Opponent deck: ${String(opponentDeckCount)}`}
          </div>
        )}

        <section aria-label={t`Board`}>
          <Board />
        </section>

        <div className="flex items-center justify-center gap-4">
          <PassButton />
        </div>

        <section aria-label={t`Hand`}>
          <Hand />
        </section>

        <SelectedCardDetail />

        {showActionLog && <ActionLog />}
      </main>
    </>
  );
}

export function OnlineGameScreen() {
  const sessionId = useOnlineGameStore((s) => s.sessionId);
  const playerToken = useOnlineGameStore((s) => s.playerToken);

  // Maintain WebSocket connection
  useWebSocket(sessionId, playerToken);

  return (
    <OnlineGameProvider>
      <OnlineGameContent />
    </OnlineGameProvider>
  );
}
