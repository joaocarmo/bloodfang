import { useRef, useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { Link } from '@tanstack/react-router';
import { Route } from '../../routes.ts';

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
        <Link
          to={Route.Setup}
          className="rounded-lg font-medium transition-colors focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 bg-p0/20 border border-p0 text-p0-light hover:bg-p0/30 px-8 py-3 min-h-[48px] text-lg min-w-[200px] inline-flex items-center justify-center"
        >
          {t`Start Local Game`}
        </Link>
        <div className="flex gap-3">
          <Link
            to={Route.Rules}
            className="rounded-lg font-medium transition-colors focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 text-text-muted hover:text-text-secondary underline px-6 py-2 min-h-[44px] inline-flex items-center"
          >
            {t`Rules`}
          </Link>
          <Link
            to={Route.Settings}
            className="rounded-lg font-medium transition-colors focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 text-text-muted hover:text-text-secondary underline px-6 py-2 min-h-[44px] inline-flex items-center"
          >
            {t`Settings`}
          </Link>
          <Link
            to={Route.About}
            className="rounded-lg font-medium transition-colors focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 text-text-muted hover:text-text-secondary underline px-6 py-2 min-h-[44px] inline-flex items-center"
          >
            {t`About`}
          </Link>
        </div>
      </nav>
    </main>
  );
}
