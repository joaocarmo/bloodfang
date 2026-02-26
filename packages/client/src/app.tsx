import { useGameStore } from './store/game-store.ts';
import { HomeScreen } from './components/screens/home-screen.tsx';
import { SetupScreen } from './components/screens/setup-screen.tsx';
import { GameScreen } from './components/game/game-screen.tsx';
import { ResultsScreen } from './components/game/results-screen.tsx';
import { Announcer } from './components/game/announcer.tsx';

export function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Announcer />
      <main>
        {screen === 'home' && <HomeScreen />}
        {screen === 'setup' && <SetupScreen />}
        {screen === 'game' && <GameScreen />}
        {screen === 'results' && <ResultsScreen />}
      </main>
    </div>
  );
}
