import { useGameStore } from '../../store/game-store.ts';
import { Board } from '../board/board.tsx';
import { Hand } from '../hand/hand.tsx';
import { MulliganScreen } from './mulligan-screen.tsx';
import { TurnIndicator } from './turn-indicator.tsx';
import { TurnTransition } from './turn-transition.tsx';
import { PassButton } from './pass-button.tsx';
import { ActionLog } from './action-log.tsx';

export function GameScreen() {
  const gameState = useGameStore((s) => s.gameState);

  if (!gameState) return null;

  if (gameState.phase === 'mulligan') {
    return (
      <>
        <TurnTransition />
        <MulliganScreen />
      </>
    );
  }

  return (
    <>
      <TurnTransition />
      <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
        <h1 className="sr-only">Game Board</h1>

        <TurnIndicator />

        <section aria-label="Board">
          <Board />
        </section>

        <div className="flex items-center justify-center gap-4">
          <PassButton />
        </div>

        <section aria-label="Hand">
          <Hand />
        </section>

        <ActionLog />
      </div>
    </>
  );
}
