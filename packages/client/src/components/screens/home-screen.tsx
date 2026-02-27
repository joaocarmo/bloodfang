import { useRef, useEffect } from 'react';
import { useGameStore } from '../../store/game-store.ts';
import { Button } from '../ui/button.tsx';

export function HomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-5xl font-bold text-text-primary outline-none"
      >
        Blood Fang
      </h1>
      <p className="text-text-secondary text-lg text-center max-w-md">
        A strategic card game on a 3&times;5 grid. Place cards, control lanes, outscore your
        opponent.
      </p>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => setScreen('setup')}
          variant="primary"
          size="lg"
          className="min-w-[200px]"
        >
          Start Local Game
        </Button>
      </div>
    </main>
  );
}
