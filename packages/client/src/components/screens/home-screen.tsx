import { useRef, useEffect } from 'react';
import { useGameStore } from '../../store/game-store.ts';

export function HomeScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
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
        <button
          onClick={() => setScreen('setup')}
          className="px-8 py-3 bg-p0/20 border border-p0 rounded-lg text-lg font-medium text-p0-light
            hover:bg-p0/30 focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
            min-w-[200px] min-h-[48px] transition-colors"
        >
          Start Local Game
        </button>
      </div>
    </div>
  );
}
