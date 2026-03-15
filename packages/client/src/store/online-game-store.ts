import { create } from 'zustand';
import { t } from '@lingui/core/macro';
import type { CardDefinition, CardId, Position } from '@bloodfang/engine';
import { getAllGameDefinitions, GamePhase } from '@bloodfang/engine';
import type {
  FilteredGameState,
  ServerMessage,
  ValidMove,
  WaitingReason,
  ErrorCode,
  SessionId,
  PlayerToken,
  ClientMessage,
} from '@bloodfang/server/protocol';
import { ServerMessageType } from '@bloodfang/server/protocol';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

interface OnlineGameStore {
  // Session
  sessionId: SessionId | null;
  playerToken: PlayerToken | null;
  connectionStatus: ConnectionStatus;
  sessionPhase: string | null;

  // Game state
  filteredGameState: FilteredGameState | null;
  validMoves: ValidMove[];
  definitions: Record<string, CardDefinition>;

  // Waiting / connection
  waitingReason: WaitingReason | null;
  opponentConnected: boolean;
  serverError: { code: ErrorCode; message: string } | null;

  // Pending deck (set during setup, consumed in lobby)
  pendingDeck: readonly CardId[] | null;
  setPendingDeck: (deck: readonly CardId[]) => void;

  // UI interaction
  selectedCardId: CardId | null;
  hoveredTilePosition: Position | null;
  announcement: string;

  // WebSocket send function ref (set by useWebSocket hook)
  _send: ((msg: ClientMessage) => void) | null;
  setSend: (send: ((msg: ClientMessage) => void) | null) => void;

  // Session setup
  setSession: (sessionId: SessionId, token: PlayerToken) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;

  // Local UI actions
  selectCard: (cardId: CardId | null) => void;
  hoverTile: (position: Position | null) => void;
  announce: (message: string) => void;

  // Server message handler
  handleServerMessage: (msg: ServerMessage) => void;

  // Reset
  reset: () => void;
}

export const useOnlineGameStore = create<OnlineGameStore>((set, get) => {
  const definitions = getAllGameDefinitions();

  return {
    sessionId: null,
    playerToken: null,
    connectionStatus: 'disconnected',
    sessionPhase: null,

    filteredGameState: null,
    validMoves: [],
    definitions,

    waitingReason: null,
    opponentConnected: false,
    serverError: null,

    pendingDeck: null,
    setPendingDeck: (deck) => {
      set({ pendingDeck: deck });
    },

    selectedCardId: null,
    hoveredTilePosition: null,
    announcement: '',

    _send: null,
    setSend: (send) => {
      set({ _send: send });
    },

    setSession: (sessionId, token) => {
      set({ sessionId, playerToken: token, serverError: null });
    },

    setConnectionStatus: (status) => {
      set({ connectionStatus: status });
    },

    selectCard: (cardId) => {
      set({ selectedCardId: cardId });
    },

    hoverTile: (position) => {
      set({ hoveredTilePosition: position });
    },

    announce: (message) => {
      set({ announcement: message });
    },

    handleServerMessage: (msg) => {
      switch (msg.type) {
        case ServerMessageType.SessionInfo: {
          set({ sessionPhase: msg.phase, serverError: null });
          break;
        }

        case ServerMessageType.State: {
          const prevState = get().filteredGameState;
          const newState = msg.state;

          set({
            filteredGameState: newState,
            validMoves: msg.validMoves ? [...msg.validMoves] : [],
            sessionPhase: msg.phase,
            waitingReason: null,
            opponentConnected: true,
            selectedCardId: null,
            hoveredTilePosition: null,
          });

          // Announce state transitions
          if (newState.phase === GamePhase.Mulligan) {
            if (!newState.players[0].mulliganUsed) {
              get().announce(t`Mulligan phase. Select cards to return.`);
            }
          } else if (newState.phase === GamePhase.Playing) {
            if (prevState?.phase === GamePhase.Mulligan) {
              get().announce(t`Mulligan complete. Game started.`);
            }
            if (newState.currentPlayerIndex === 0) {
              get().announce(t`Your turn.`);
            } else {
              get().announce(t`Opponent's turn.`);
            }
          } else {
            // phase === GamePhase.Ended
            get().announce(t`Game over.`);
          }
          break;
        }

        case ServerMessageType.Waiting: {
          set({ waitingReason: msg.reason });
          break;
        }

        case ServerMessageType.OpponentConnected: {
          set({ opponentConnected: true, serverError: null });
          get().announce(t`Opponent connected.`);
          break;
        }

        case ServerMessageType.OpponentDisconnected: {
          set({ opponentConnected: false });
          get().announce(t`Opponent disconnected.`);
          break;
        }

        case ServerMessageType.Error: {
          set({ serverError: { code: msg.code, message: msg.message } });
          get().announce(t`Error: ${msg.message}`);
          break;
        }

        case ServerMessageType.Pong:
          break;
      }
    },

    reset: () => {
      set({
        sessionId: null,
        playerToken: null,
        connectionStatus: 'disconnected',
        sessionPhase: null,
        filteredGameState: null,
        validMoves: [],
        waitingReason: null,
        opponentConnected: false,
        serverError: null,
        pendingDeck: null,
        selectedCardId: null,
        hoveredTilePosition: null,
        announcement: '',
        _send: null,
      });
    },
  };
});

// Helper to get the send function and call it
export function sendMessage(msg: ClientMessage): void {
  const send = useOnlineGameStore.getState()._send;
  if (send) {
    send(msg);
  }
}
