import { useGameStore } from '../../store/game-store.ts';

export function Announcer() {
  const announcement = useGameStore((s) => s.announcement);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}
