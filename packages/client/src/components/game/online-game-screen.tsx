import { useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import { GamePhase } from '@bloodfang/engine';
import { WaitingReason } from '@bloodfang/server/protocol';
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

function OnlineGameContent() {
  const { gameState, isMyTurn } = useGame();
  const showActionLog = useSettingsStore((s) => s.showActionLog);
  const waitingReason = useOnlineGameStore((s) => s.waitingReason);
  const opponentConnected = useOnlineGameStore((s) => s.opponentConnected);
  const connectionStatus = useOnlineGameStore((s) => s.connectionStatus);
  const navigate = useNavigate();

  // Navigate to results when game ends
  useEffect(() => {
    if (gameState?.phase === GamePhase.Ended) {
      void navigate({ to: Route.OnlineResults });
    }
  }, [gameState?.phase, navigate]);

  if (!gameState) {
    return (
      <main tabIndex={-1} className="flex items-center justify-center min-h-screen outline-none">
        <p className="text-text-secondary">{t`Loading game...`}</p>
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

  return (
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

      <section aria-label={t`Board`}>
        <Board />
      </section>

      <div className="flex items-center justify-center gap-4">
        <PassButton />
        {!isMyTurn && waitingReason === WaitingReason.OpponentTurn && (
          <span className="text-text-muted text-sm" role="status">
            {t`Opponent's turn`}
          </span>
        )}
      </div>

      <section aria-label={t`Hand`}>
        <Hand />
      </section>

      <SelectedCardDetail />

      {showActionLog && <ActionLog />}
    </main>
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
