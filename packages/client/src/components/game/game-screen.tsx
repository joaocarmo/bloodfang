import { GamePhase } from '@bloodfang/engine';
import { t } from '@lingui/core/macro';
import { useBlocker, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { LocalGameProvider, useGame } from '../../context/game-context.tsx';
import { Route } from '../../routes.ts';
import { useGameStore } from '../../store/game-store.ts';
import { useSettingsStore } from '../../store/settings-store.ts';
import { Board } from '../board/board.tsx';
import { Hand } from '../hand/hand.tsx';
import { ConfirmDialog } from '../ui/confirm-dialog.tsx';
import { ActionLog } from './action-log.tsx';
import { GameMenu } from './game-menu.tsx';
import { MulliganScreen } from './mulligan-screen.tsx';
import { PassButton } from './pass-button.tsx';
import { SelectedCardDetail } from './selected-card-detail.tsx';
import { TurnIndicator } from './turn-indicator.tsx';
import { TurnTransition } from './turn-transition.tsx';

function GameScreenContent() {
  const { gameState } = useGame();
  const showActionLog = useSettingsStore((s) => s.showActionLog);
  const navigate = useNavigate();

  // Navigate to results when game ends
  useEffect(() => {
    if (gameState?.phase === GamePhase.Ended) {
      void navigate({ to: Route.Results });
    }
  }, [gameState?.phase, navigate]);

  // Block navigation when game is in progress
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => gameState !== null && gameState.phase !== GamePhase.Ended,
    withResolver: true,
  });

  if (!gameState) return null;

  return (
    <>
      <ConfirmDialog
        open={status === 'blocked'}
        title={t`Leave game?`}
        description={t`Your game progress will be lost.`}
        confirmLabel={t`Leave`}
        cancelLabel={t`Cancel`}
        onConfirm={() => {
          useGameStore.getState().resetToHome();
          proceed?.();
        }}
        onCancel={() => {
          reset?.();
        }}
      />
      <TurnTransition />
      {gameState.phase === GamePhase.Mulligan ? (
        <main tabIndex={-1} className="outline-none">
          <MulliganScreen />
        </main>
      ) : (
        <main
          tabIndex={-1}
          className="flex flex-col gap-2 p-2 sm:gap-3 sm:p-3 md:gap-4 md:p-4 max-w-4xl mx-auto outline-none"
        >
          <h1 className="sr-only">{t`Game Board`}</h1>

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
          </div>

          <section aria-label={t`Hand`}>
            <Hand />
          </section>

          <SelectedCardDetail />

          {showActionLog && <ActionLog />}
        </main>
      )}
    </>
  );
}

export function GameScreen() {
  return (
    <LocalGameProvider>
      <GameScreenContent />
    </LocalGameProvider>
  );
}
