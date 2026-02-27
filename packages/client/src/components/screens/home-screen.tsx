import { useRef, useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { Link } from '@tanstack/react-router';
import { Route } from '../../routes.ts';
import { Button } from '../ui/button.tsx';

export function HomeScreen() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main
      tabIndex={-1}
      className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 outline-none"
    >
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-5xl font-bold text-text-primary outline-none"
      >
        {t`Blood Fang`}
      </h1>
      <p className="text-text-secondary text-lg text-center max-w-md">
        {t`A strategic card game on a 3×5 grid. Place cards, control lanes, outscore your opponent.`}
      </p>
      <div className="flex flex-col gap-3 items-center">
        <Link to={Route.Setup}>
          <Button variant="primary" size="lg" className="min-w-[200px]">
            {t`Start Local Game`}
          </Button>
        </Link>
        <div className="flex gap-3">
          <Link to={Route.Rules}>
            <Button variant="ghost">{t`Rules`}</Button>
          </Link>
          <Link to={Route.Settings}>
            <Button variant="ghost">{t`Settings`}</Button>
          </Link>
          <Link to={Route.About}>
            <Button variant="ghost">{t`About`}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
