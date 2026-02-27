import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import { useGameStore } from '../../store/game-store.ts';
import { Route } from '../../routes.ts';
import { ConfirmDialog } from '../ui/confirm-dialog.tsx';

export function ExitConfirmDialog() {
  const showExitConfirm = useGameStore((s) => s.showExitConfirm);
  const setShowExitConfirm = useGameStore((s) => s.setShowExitConfirm);
  const confirmExitToHome = useGameStore((s) => s.confirmExitToHome);
  const navigate = useNavigate();

  return (
    <ConfirmDialog
      open={showExitConfirm}
      title={t`Leave game?`}
      description={t`Your game progress will be lost.`}
      confirmLabel={t`Leave`}
      cancelLabel={t`Cancel`}
      onConfirm={() => {
        confirmExitToHome();
        navigate({ to: Route.Home });
      }}
      onCancel={() => setShowExitConfirm(false)}
    />
  );
}
