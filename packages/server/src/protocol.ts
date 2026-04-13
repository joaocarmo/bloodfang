import type {
  Board,
  CardDefinition,
  CardId,
  CardInstance,
  ContinuousModifier,
  GameAction,
  GamePhase,
  PlayerId,
  Position,
} from '@bloodfang/engine';

// ── Branded Types ────────────────────────────────────────────────────

export type SessionId = string & { readonly __brand: 'SessionId' };
export type PlayerToken = string & { readonly __brand: 'PlayerToken' };

// ── Session Phase ────────────────────────────────────────────────────

export enum SessionPhase {
  WaitingForPlayers = 'waiting_for_players',
  WaitingForDecks = 'waiting_for_decks',
  Mulligan = 'mulligan',
  Playing = 'playing',
  Ended = 'ended',
}

// ── Client → Server ──────────────────────────────────────────────────

export enum ClientMessageType {
  SubmitDeck = 'submit_deck',
  Mulligan = 'mulligan',
  PlayCard = 'play_card',
  Pass = 'pass',
  Ping = 'ping',
}

export type ClientMessage =
  | { readonly type: ClientMessageType.SubmitDeck; readonly deck: CardId[] }
  | { readonly type: ClientMessageType.Mulligan; readonly returnCardIds: CardId[] }
  | {
      readonly type: ClientMessageType.PlayCard;
      readonly cardId: CardId;
      readonly position: Position;
    }
  | { readonly type: ClientMessageType.Pass }
  | { readonly type: ClientMessageType.Ping };

// ── Server → Client ──────────────────────────────────────────────────

export enum ServerMessageType {
  SessionInfo = 'session_info',
  State = 'state',
  Waiting = 'waiting',
  OpponentConnected = 'opponent_connected',
  OpponentDisconnected = 'opponent_disconnected',
  Error = 'error',
  Pong = 'pong',
}

export enum WaitingReason {
  OpponentDeck = 'opponent_deck',
  OpponentMulligan = 'opponent_mulligan',
  OpponentTurn = 'opponent_turn',
  OpponentReconnecting = 'opponent_reconnecting',
}

export enum ErrorCode {
  // Protocol errors
  InvalidMessage = 'invalid_message',
  InvalidSession = 'invalid_session',
  InvalidToken = 'invalid_token',

  // Session state errors
  SessionFull = 'session_full',
  NotYourTurn = 'not_your_turn',
  InvalidPhase = 'invalid_phase',

  // Game action errors
  InvalidDeck = 'invalid_deck',
  DeckAlreadySubmitted = 'deck_already_submitted',
  InvalidMove = 'invalid_move',
  InvalidMulligan = 'invalid_mulligan',

  // Connection errors
  SessionExpired = 'session_expired',
  OpponentAbandoned = 'opponent_abandoned',
  IdleTimeout = 'idle_timeout',

  // Server errors
  InternalError = 'internal_error',
}

// ── Filtered State Types ─────────────────────────────────────────────

export interface FilteredPlayerState {
  readonly hand: readonly CardId[];
  readonly deckCount: number;
  readonly mulliganUsed: boolean;
}

export type FilteredGameAction =
  | GameAction
  | {
      readonly type: 'drawCard';
      readonly player: PlayerId;
      readonly cardId: null;
    }
  | {
      readonly type: 'addCardToHand';
      readonly player: PlayerId;
      readonly cardId: null;
    };

export interface FilteredGameState {
  readonly board: Board;
  readonly players: readonly [FilteredPlayerState, FilteredPlayerState];
  readonly currentPlayerIndex: PlayerId;
  readonly turnNumber: number;
  readonly phase: GamePhase;
  readonly consecutivePasses: number;
  readonly continuousModifiers: readonly ContinuousModifier[];
  readonly cardInstances: Readonly<Record<string, CardInstance>>;
  readonly log: readonly FilteredGameAction[];
  readonly cardDefinitions: Readonly<Record<string, CardDefinition>>;
  readonly nextInstanceId: number;
}

export interface ValidMove {
  readonly cardId: CardId;
  readonly positions: readonly Position[];
}

// ── Server Message Union ─────────────────────────────────────────────

export type ServerMessage =
  | {
      readonly type: ServerMessageType.SessionInfo;
      readonly sessionId: SessionId;
      readonly playerId: PlayerId;
      readonly phase: SessionPhase;
    }
  | {
      readonly type: ServerMessageType.State;
      readonly state: FilteredGameState;
      readonly phase: SessionPhase;
      readonly validMoves?: readonly ValidMove[];
    }
  | { readonly type: ServerMessageType.Waiting; readonly reason: WaitingReason }
  | { readonly type: ServerMessageType.OpponentConnected }
  | { readonly type: ServerMessageType.OpponentDisconnected }
  | { readonly type: ServerMessageType.Error; readonly code: ErrorCode; readonly message: string }
  | { readonly type: ServerMessageType.Pong };
