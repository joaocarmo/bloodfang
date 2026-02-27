import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import { Route } from '../../routes.ts';
import { Button } from './button.tsx';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <nav aria-label={t`Navigation`}>
      <Button onClick={() => navigate({ to: Route.Home })} variant="ghost" size="sm">
        {t`← Home`}
      </Button>
    </nav>
  );
}
