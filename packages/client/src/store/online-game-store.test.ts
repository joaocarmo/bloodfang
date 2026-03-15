import { GamePhase, CardId } from '@bloodfang/engine';
import type { FilteredGameState, ServerMessage } from '@bloodfang/server/protocol';
import { ServerMessageType, SessionPhase } from '@bloodfang/server/protocol';
import { useOnlineGameStore } from './online-game-store.ts';
import { resetStores, createOnlinePlayingState, TEST_DECK_A } from '../test-utils.tsx';

beforeEach(() => {
  resetStores();
});

function createMinimalFilteredState(overrides: Partial<FilteredGameState> = {}): FilteredGameState {
  return {
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ] as unknown as FilteredGameState['board'],
    players: [
      { hand: [], deckCount: 10, mulliganUsed: true },
      { hand: [], deckCount: 10, mulliganUsed: true },
    ],
    currentPlayerIndex: 0,
    turnNumber: 1,
    phase: GamePhase.Playing,
    consecutivePasses: 0,
    continuousModifiers: [],
    cardInstances: {},
    log: [],
    cardDefinitions: {},
    nextInstanceId: 1,
    ...overrides,
  } as FilteredGameState;
}

describe('handleServerMessage', () => {
  it('with State sets opponentConnected to true', () => {
    const state = createMinimalFilteredState();
    const msg: ServerMessage = {
      type: ServerMessageType.State,
      state,
      phase: SessionPhase.Playing,
      validMoves: [],
    };

    useOnlineGameStore.getState().handleServerMessage(msg);

    expect(useOnlineGameStore.getState().opponentConnected).toBe(true);
  });

  it('with OpponentDisconnected sets opponentConnected to false', () => {
    useOnlineGameStore.setState({ opponentConnected: true });

    const msg: ServerMessage = { type: ServerMessageType.OpponentDisconnected };
    useOnlineGameStore.getState().handleServerMessage(msg);

    expect(useOnlineGameStore.getState().opponentConnected).toBe(false);
  });

  it('with OpponentConnected sets opponentConnected to true', () => {
    useOnlineGameStore.setState({ opponentConnected: false });

    const msg: ServerMessage = { type: ServerMessageType.OpponentConnected };
    useOnlineGameStore.getState().handleServerMessage(msg);

    expect(useOnlineGameStore.getState().opponentConnected).toBe(true);
  });

  it('with State clears stale opponentConnected=false', () => {
    useOnlineGameStore.setState({ opponentConnected: false });

    const state = createMinimalFilteredState();
    const msg: ServerMessage = {
      type: ServerMessageType.State,
      state,
      phase: SessionPhase.Playing,
      validMoves: [],
    };

    useOnlineGameStore.getState().handleServerMessage(msg);

    expect(useOnlineGameStore.getState().opponentConnected).toBe(true);
  });

  it('with State clears selectedCardId and hoveredTilePosition', () => {
    useOnlineGameStore.setState({
      selectedCardId: CardId.HopliteGuard,
      hoveredTilePosition: { row: 0, col: 0 },
    });

    const state = createMinimalFilteredState();
    const msg: ServerMessage = {
      type: ServerMessageType.State,
      state,
      phase: SessionPhase.Playing,
      validMoves: [],
    };

    useOnlineGameStore.getState().handleServerMessage(msg);

    expect(useOnlineGameStore.getState().selectedCardId).toBeNull();
    expect(useOnlineGameStore.getState().hoveredTilePosition).toBeNull();
  });

  it('with State stores the filteredGameState', () => {
    const state = createOnlinePlayingState();
    const msg: ServerMessage = {
      type: ServerMessageType.State,
      state,
      phase: SessionPhase.Playing,
      validMoves: [{ cardId: CardId.HopliteGuard, positions: [{ row: 0, col: 0 }] }],
    };

    useOnlineGameStore.getState().handleServerMessage(msg);

    expect(useOnlineGameStore.getState().filteredGameState).toBe(state);
    expect(useOnlineGameStore.getState().validMoves).toHaveLength(1);
  });

  it('with SessionInfo sets sessionPhase and clears serverError', () => {
    useOnlineGameStore.setState({
      serverError: { code: 'internal_error' as never, message: 'fail' },
    });

    const msg: ServerMessage = {
      type: ServerMessageType.SessionInfo,
      sessionId: 'test-session' as never,
      playerId: 0,
      phase: SessionPhase.WaitingForDecks,
    };

    useOnlineGameStore.getState().handleServerMessage(msg);

    expect(useOnlineGameStore.getState().sessionPhase).toBe(SessionPhase.WaitingForDecks);
    expect(useOnlineGameStore.getState().serverError).toBeNull();
  });
});

describe('setPendingDeck', () => {
  it('stores deck and reset clears it', () => {
    useOnlineGameStore.getState().setPendingDeck(TEST_DECK_A);
    expect(useOnlineGameStore.getState().pendingDeck).toEqual(TEST_DECK_A);

    useOnlineGameStore.getState().reset();
    expect(useOnlineGameStore.getState().pendingDeck).toBeNull();
  });
});

describe('selectCard and hoverTile', () => {
  it('selectCard updates selectedCardId', () => {
    useOnlineGameStore.getState().selectCard(CardId.HopliteGuard);
    expect(useOnlineGameStore.getState().selectedCardId).toBe(CardId.HopliteGuard);

    useOnlineGameStore.getState().selectCard(null);
    expect(useOnlineGameStore.getState().selectedCardId).toBeNull();
  });

  it('hoverTile updates hoveredTilePosition', () => {
    useOnlineGameStore.getState().hoverTile({ row: 2, col: 1 });
    expect(useOnlineGameStore.getState().hoveredTilePosition).toEqual({ row: 2, col: 1 });

    useOnlineGameStore.getState().hoverTile(null);
    expect(useOnlineGameStore.getState().hoveredTilePosition).toBeNull();
  });
});
