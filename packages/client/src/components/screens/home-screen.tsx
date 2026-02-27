import { useRef, useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { Route } from '../../routes.ts';
import { LinkButton } from '../ui/link-button.tsx';

export function HomeScreen() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main
      tabIndex={-1}
      className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 sm:gap-8 sm:p-8 outline-none"
    >
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary outline-none"
      >
        {t`Blood Fang`}
      </h1>
      <p className="text-text-secondary text-base sm:text-lg text-center max-w-md">
        {t`A strategic card game on a 3×5 grid. Place cards, control lanes, outscore your opponent.`}
      </p>
      <nav className="flex flex-col gap-3 items-center" aria-label={t`Main menu`}>
        <LinkButton to={Route.Setup} variant="primary" size="lg" className="min-w-[200px]">
          {t`Start Local Game`}
        </LinkButton>
        <div className="flex gap-3">
          <LinkButton to={Route.Rules} variant="ghost">
            {t`Rules`}
          </LinkButton>
          <LinkButton to={Route.Settings} variant="ghost">
            {t`Settings`}
          </LinkButton>
          <LinkButton to={Route.About} variant="ghost">
            {t`About`}
          </LinkButton>
        </div>
      </nav>
    </main>
  );
}
