import type { GameState } from '@bloodfang/engine';
import type { FilteredGameState } from '@bloodfang/server/protocol';

/**
 * Converts a FilteredGameState into a GameState suitable for preview simulation.
 *
 * - Sets `players[x].deck = []` for both players (empty decks — draw side-effects
 *   don't affect preview rendering)
 * - Copies all other fields as-is
 *
 * The engine's `playCard()` works fine with empty decks — it just won't draw a
 * replacement card, which is irrelevant for placement preview.
 */
export function toSimulatableState(filtered: FilteredGameState): GameState {
  return {
    board: filtered.board,
    players: [
      {
        hand: [...filtered.players[0].hand],
        deck: [],
        mulliganUsed: filtered.players[0].mulliganUsed,
      },
      {
        hand: [...filtered.players[1].hand],
        deck: [],
        mulliganUsed: filtered.players[1].mulliganUsed,
      },
    ],
    currentPlayerIndex: filtered.currentPlayerIndex,
    turnNumber: filtered.turnNumber,
    phase: filtered.phase,
    consecutivePasses: filtered.consecutivePasses,
    continuousModifiers: [...filtered.continuousModifiers],
    cardInstances: filtered.cardInstances,
    log: [...filtered.log],
    nextInstanceId: filtered.nextInstanceId,
    cardDefinitions: filtered.cardDefinitions,
  } as GameState;
}
