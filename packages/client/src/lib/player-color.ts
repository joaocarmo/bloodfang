import type { PlayerId } from '@bloodfang/engine';

export function playerTextColor(player: PlayerId): string {
  return player === 0 ? 'text-p0' : 'text-p1';
}

export function playerLightTextColor(player: PlayerId): string {
  return player === 0 ? 'text-p0-light' : 'text-p1-light';
}
