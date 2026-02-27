import type { PlayerId } from '@bloodfang/engine';

export function playerTextColor(player: PlayerId): string {
  return player === 0 ? 'text-p0' : 'text-p1';
}

export function playerBgColor(player: PlayerId): string {
  return player === 0 ? 'bg-p0' : 'bg-p1';
}

export function tileBgColor(owner: PlayerId | null): string {
  return owner === 0 ? 'bg-tile-p0' : owner === 1 ? 'bg-tile-p1' : 'bg-tile-empty';
}

export function playerBgOpacity(player: PlayerId, opacity: number): string {
  return player === 0 ? `bg-p0/${opacity}` : `bg-p1/${opacity}`;
}
