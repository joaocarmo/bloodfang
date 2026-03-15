import type { GameState, PlayerId } from '@bloodfang/engine';
import { GamePhase, LOG_ACTION_TYPES, opponent } from '@bloodfang/engine';
import type { FilteredGameAction, FilteredGameState, FilteredPlayerState } from './protocol.js';

/**
 * Transforms a full GameState into a FilteredGameState for a specific player.
 *
 * - Own hand visible, opponent hand hidden (empty array, only deckCount exposed)
 * - Players tuple reordered: index 0 = viewing player, index 1 = opponent
 * - currentPlayerIndex remapped to match reordered tuple
 * - Log entries for opponent draws/addCardToHand have cardId redacted to null
 * - At game end, full visibility (no redaction)
 */
export function filterStateForPlayer(state: GameState, viewingPlayer: PlayerId): FilteredGameState {
  const opponentId = opponent(viewingPlayer);
  const isEnded = state.phase === GamePhase.Ended;

  const viewingPlayerState = filterPlayerState(state.players[viewingPlayer], true);
  const opponentPlayerState = filterPlayerState(state.players[opponentId], isEnded);

  // Remap currentPlayerIndex: 0 = viewing player's turn, 1 = opponent's turn
  const currentPlayerIndex: PlayerId = state.currentPlayerIndex === viewingPlayer ? 0 : 1;

  const log: readonly FilteredGameAction[] = isEnded
    ? state.log
    : state.log.map((action) => filterLogAction(action, opponentId));

  return {
    board: state.board,
    players: [viewingPlayerState, opponentPlayerState],
    currentPlayerIndex,
    turnNumber: state.turnNumber,
    phase: state.phase,
    consecutivePasses: state.consecutivePasses,
    continuousModifiers: state.continuousModifiers,
    cardInstances: state.cardInstances,
    log,
    cardDefinitions: state.cardDefinitions,
  };
}

function filterPlayerState(
  playerState: GameState['players'][0],
  visible: boolean,
): FilteredPlayerState {
  return {
    hand: visible ? playerState.hand : [],
    deckCount: playerState.deck.length,
    mulliganUsed: playerState.mulliganUsed,
  };
}

function filterLogAction(action: FilteredGameAction, opponentId: PlayerId): FilteredGameAction {
  if (action.type === LOG_ACTION_TYPES.DRAW_CARD && action.player === opponentId) {
    return { type: LOG_ACTION_TYPES.DRAW_CARD, player: action.player, cardId: null };
  }
  if (action.type === LOG_ACTION_TYPES.ADD_CARD_TO_HAND && action.player === opponentId) {
    return { type: LOG_ACTION_TYPES.ADD_CARD_TO_HAND, player: action.player, cardId: null };
  }
  return action;
}
