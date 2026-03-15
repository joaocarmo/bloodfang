import { useGameStore } from '../../store/game-store.ts';
import { useOnlineGameStore } from '../../store/online-game-store.ts';

export function Announcer() {
  const localAnnouncement = useGameStore((s) => s.announcement);
  const onlineAnnouncement = useOnlineGameStore((s) => s.announcement);

  // Use whichever announcement was set most recently (non-empty takes precedence)
  const announcement = onlineAnnouncement || localAnnouncement;

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}
