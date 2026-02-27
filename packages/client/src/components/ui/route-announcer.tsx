import { useEffect, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';
import { t } from '@lingui/core/macro';
import { Route } from '../../routes.ts';

function getPageName(pathname: string): string {
  switch (pathname) {
    case Route.Home:
      return t`Home`;
    case Route.Setup:
      return t`Game Setup`;
    case Route.Game:
      return t`Game`;
    case Route.Results:
      return t`Results`;
    case Route.Rules:
      return t`Rules`;
    case Route.Settings:
      return t`Settings`;
    case Route.About:
      return t`About`;
    default:
      return t`Page`;
  }
}

export function RouteAnnouncer() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const announcementRef = useRef('');

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;

    const pageName = getPageName(location.pathname);
    announcementRef.current = pageName;

    const main = document.querySelector<HTMLElement>('main[tabindex]');
    main?.focus();
  }, [location.pathname]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announcementRef.current}
    </div>
  );
}
