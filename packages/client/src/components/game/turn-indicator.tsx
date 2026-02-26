import { useGameStore } from '../../store/game-store.ts';

export function TurnIndicator() {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState) return null;

  const player = gameState.currentPlayerIndex;
  const colorClass = player === 0 ? 'text-p0' : 'text-p1';

  return (
    <div className="text-center" aria-current="true">
      <span className={`${colorClass} font-bold text-lg`}>Player {player + 1}&apos;s Turn</span>
      <span className="text-text-muted text-sm ml-2">Turn {gameState.turnNumber}</span>
    </div>
  );
}
