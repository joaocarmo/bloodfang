import type { PlayerId } from '@bloodfang/engine';

export function playerTextColor(player: PlayerId): string {
  return player === 0 ? 'text-p0' : 'text-p1';
}
