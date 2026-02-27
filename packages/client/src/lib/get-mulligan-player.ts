import type { PlayerId } from '@bloodfang/engine';

export function getMulliganPlayer(gameState: {
  currentPlayerIndex: PlayerId;
  players: readonly { mulliganUsed: boolean }[];
}): PlayerId {
  const first = gameState.currentPlayerIndex;
  if (gameState.players[first]?.mulliganUsed === false) return first;
  const second: PlayerId = first === 0 ? 1 : 0;
  if (gameState.players[second]?.mulliganUsed === false) return second;
  return first;
}
