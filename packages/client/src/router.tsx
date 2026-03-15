import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Route } from './routes.ts';
import { Announcer } from './components/game/announcer.tsx';
import { RouteAnnouncer } from './components/ui/route-announcer.tsx';
import { HomeScreen } from './components/screens/home-screen.tsx';
import { SetupScreen } from './components/screens/setup-screen.tsx';
import { GameScreen } from './components/game/game-screen.tsx';
import { ResultsScreen } from './components/game/results-screen.tsx';
import { RulesScreen } from './components/screens/rules-screen.tsx';
import { SettingsScreen } from './components/screens/settings-screen.tsx';
import { AboutScreen } from './components/screens/about-screen.tsx';
import { OnlineSetupScreen } from './components/screens/online-setup-screen.tsx';
import { OnlineLobbyScreen } from './components/screens/online-lobby-screen.tsx';
import { OnlineGameScreen } from './components/game/online-game-screen.tsx';
import { OnlineResultsScreen } from './components/game/online-results-screen.tsx';

function RootLayout() {
  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Announcer />
      <RouteAnnouncer />
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

const onlineSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.OnlineSetup,
  component: OnlineSetupScreen,
});

const onlineLobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.OnlineLobby,
  component: OnlineLobbyScreen,
  validateSearch: (search: Record<string, unknown>) => ({
    deck: (search['deck'] as string) || '',
  }),
});

const onlineGameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.OnlineGame,
  component: OnlineGameScreen,
});

const onlineResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: Route.OnlineResults,
  component: OnlineResultsScreen,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  setupRoute,
  gameRoute,
  resultsRoute,
  rulesRoute,
  settingsRoute,
  aboutRoute,
  onlineSetupRoute,
  onlineLobbyRoute,
  onlineGameRoute,
  onlineResultsRoute,
]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
