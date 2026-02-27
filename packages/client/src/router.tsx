import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Route } from './routes.ts';
import { Announcer } from './components/game/announcer.tsx';
import { RouteAnnouncer } from './components/ui/route-announcer.tsx';
import { ExitConfirmDialog } from './components/game/exit-confirm-dialog.tsx';
import { HomeScreen } from './components/screens/home-screen.tsx';
import { SetupScreen } from './components/screens/setup-screen.tsx';
import { GameScreen } from './components/game/game-screen.tsx';
import { ResultsScreen } from './components/game/results-screen.tsx';
import { RulesScreen } from './components/screens/rules-screen.tsx';
import { SettingsScreen } from './components/screens/settings-screen.tsx';
import { AboutScreen } from './components/screens/about-screen.tsx';

function RootLayout() {
  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Announcer />
      <RouteAnnouncer />
      <ExitConfirmDialog />
      <Outlet />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.Home,
  component: HomeScreen,
});

const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.Setup,
  component: SetupScreen,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.Game,
  component: GameScreen,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.Results,
  component: ResultsScreen,
});

const rulesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.Rules,
  component: RulesScreen,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.Settings,
  component: SettingsScreen,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.About,
  component: AboutScreen,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  setupRoute,
  gameRoute,
  resultsRoute,
  rulesRoute,
  settingsRoute,
  aboutRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
