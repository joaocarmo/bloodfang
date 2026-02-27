import { useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { useNavigate, useBlocker } from '@tanstack/react-router';
import { GamePhase } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { Route } from '../../routes.ts';
import { Board } from '../board/board.tsx';
import { Hand } from '../hand/hand.tsx';
import { MulliganScreen } from './mulligan-screen.tsx';
import { TurnIndicator } from './turn-indicator.tsx';
import { TurnTransition } from './turn-transition.tsx';
import { PassButton } from './pass-button.tsx';
import { ActionLog } from './action-log.tsx';
import { ConfirmDialog } from '../ui/confirm-dialog.tsx';

export function GameScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const navigate = useNavigate();

  // Navigate to results when game ends
  useEffect(() => {
    if (gameState?.phase === GamePhase.Ended) {
      navigate({ to: Route.Results });
    }
  }, [gameState?.phase, navigate]);

  // Block navigation when game is in progress
  const { proceed, reset, status } = useBlocker({
    condition: gameState !== null && gameState.phase !== GamePhase.Ended,
  });

  if (!gameState) return null;

  if (gameState.phase === GamePhase.Mulligan) {
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
          onCancel={() => reset?.()}
        />
        <TurnTransition />
        <main tabIndex={-1} className="outline-none">
          <MulliganScreen />
        </main>
      </>
    );
  }

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
        onCancel={() => reset?.()}
      />
      <TurnTransition />
      <main tabIndex={-1} className="flex flex-col gap-4 p-4 max-w-4xl mx-auto outline-none">
        <h1 className="sr-only">{t`Game Board`}</h1>

        <TurnIndicator />

        <section aria-label={t`Board`}>
          <Board />
        </section>

        <div className="flex items-center justify-center gap-4">
          <PassButton />
        </div>

        <section aria-label={t`Hand`}>
          <Hand />
        </section>

        <ActionLog />
      </main>
    </>
  );
}
