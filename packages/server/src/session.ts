import type { CardId, GameState, PlayerId } from '@bloodfang/engine';
import {
  createGame,
  createSeededRng,
  DECK_SIZE,
  GamePhase,
  getAllGameDefinitions,
  getValidMoves,
  mulligan,
  pass,
  playCard,
} from '@bloodfang/engine';
import type { WSContext } from 'hono/ws';
import type { Logger } from './logger.js';
import {
  type ClientMessage,
  ClientMessageType,
  ErrorCode,
  type PlayerToken,
  type ServerMessage,
  ServerMessageType,
  type SessionId,
  SessionPhase,
  WaitingReason,
} from './protocol.js';
import { filterStateForPlayer } from './state-filter.js';

// ── Constants ────────────────────────────────────────────────────────

const RECONNECT_GRACE_MS = 60_000;
const IDLE_TIMEOUT_MS = 10 * 60_000;
const POST_GAME_CLEANUP_MS = 5 * 60_000;
const ABANDONED_NO_WS_MS = 2 * 60_000;
const ABANDONED_WAITING_MS = 5 * 60_000;

// ── Shared Card Definitions (cached once) ────────────────────────────

let cachedDefinitions: ReturnType<typeof getAllGameDefinitions> | undefined;

function getDefinitions() {
  cachedDefinitions ??= getAllGameDefinitions();
  return cachedDefinitions;
}

// ── Player Connection ────────────────────────────────────────────────

interface PlayerConnection {
  ws: WSContext | null;
  token: PlayerToken;
  deck: CardId[] | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
}

// ── Session Class ────────────────────────────────────────────────────

export class Session {
  readonly id: SessionId;
  private phase: SessionPhase;
  private gameState: GameState | null = null;
  private readonly players: [PlayerConnection | null, PlayerConnection | null] = [null, null];
  private readonly mulliganDone: [boolean, boolean] = [false, false];
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private cleanupTimer: ReturnType<typeof setTimeout> | null = null;
  private abandonedTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;
  private readonly logger: Logger;
  private readonly onDispose: (id: SessionId) => void;

  constructor(id: SessionId, logger: Logger, onDispose: (id: SessionId) => void) {
    this.id = id;
    this.phase = SessionPhase.WaitingForPlayers;
    this.logger = logger;
    this.onDispose = onDispose;
    this.startAbandonedTimer(ABANDONED_NO_WS_MS);
  }

  // ── Player Management ────────────────────────────────────────────

  get playerCount(): number {
    return (this.players[0] ? 1 : 0) + (this.players[1] ? 1 : 0);
  }

  getPhase(): SessionPhase {
    return this.phase;
  }

  addPlayer(token: PlayerToken): PlayerId | null {
    if (this.players[0] === null) {
      this.players[0] = { ws: null, token, deck: null, reconnectTimer: null };
      return 0;
    }
    if (this.players[1] === null) {
      this.players[1] = { ws: null, token, deck: null, reconnectTimer: null };
      return 1;
    }
    return null;
  }

  findPlayerByToken(token: PlayerToken): PlayerId | null {
    if (this.players[0]?.token === token) return 0;
    if (this.players[1]?.token === token) return 1;
    return null;
  }

  connectPlayer(playerId: PlayerId, ws: WSContext): void {
    const player = this.players[playerId];
    if (!player) return;

    // Clear reconnect timer if reconnecting
    if (player.reconnectTimer) {
      clearTimeout(player.reconnectTimer);
      player.reconnectTimer = null;
    }

    player.ws = ws;

    // Send session info
    this.send(playerId, {
      type: ServerMessageType.SessionInfo,
      sessionId: this.id,
      playerId,
      phase: this.phase,
    });

    // Notify opponent
    const opponentId = playerId === 0 ? 1 : 0;
    if (this.players[opponentId]?.ws) {
      this.send(opponentId as PlayerId, { type: ServerMessageType.OpponentConnected });
    }

    // Transition if both connected
    if (
      this.phase === SessionPhase.WaitingForPlayers &&
      this.players[0]?.ws &&
      this.players[1]?.ws
    ) {
      this.clearAbandonedTimer();
      this.phase = SessionPhase.WaitingForDecks;
      this.send(0, {
        type: ServerMessageType.SessionInfo,
        sessionId: this.id,
        playerId: 0,
        phase: this.phase,
      });
      this.send(1, {
        type: ServerMessageType.SessionInfo,
        sessionId: this.id,
        playerId: 1,
        phase: this.phase,
      });
    }

    // If reconnecting mid-game, send current state
    if (
      this.gameState &&
      (this.phase === SessionPhase.Mulligan || this.phase === SessionPhase.Playing)
    ) {
      this.sendStateToPlayer(playerId);
    }

    this.resetIdleTimer();
  }

  disconnectPlayer(playerId: PlayerId): void {
    const player = this.players[playerId];
    if (!player) return;

    player.ws = null;

    if (this.phase === SessionPhase.Ended || this.disposed) return;

    // Notify opponent
    const opponentId = (playerId === 0 ? 1 : 0) as PlayerId;
    if (this.players[opponentId]?.ws) {
      this.send(opponentId, { type: ServerMessageType.OpponentDisconnected });
      this.send(opponentId, {
        type: ServerMessageType.Waiting,
        reason: WaitingReason.OpponentReconnecting,
      });
    }

    // Start reconnect grace period
    player.reconnectTimer = setTimeout(() => {
      this.logger.info('session.expired', { sessionId: this.id, reason: 'grace_period' });
      // Notify remaining player
      if (this.players[opponentId]?.ws) {
        this.send(opponentId, {
          type: ServerMessageType.Error,
          code: ErrorCode.OpponentAbandoned,
          message: 'Opponent disconnected and did not reconnect in time',
        });
      }
      this.dispose();
    }, RECONNECT_GRACE_MS);
  }

  // ── Message Handling ─────────────────────────────────────────────

  handleMessage(playerId: PlayerId, message: ClientMessage): void {
    this.resetIdleTimer();
    this.logger.debug('session.message_received', {
      sessionId: this.id,
      playerId,
      messageType: message.type,
    });

    switch (message.type) {
      case ClientMessageType.SubmitDeck:
        this.handleSubmitDeck(playerId, message.deck);
        break;
      case ClientMessageType.Mulligan:
        this.handleMulligan(playerId, message.returnCardIds);
        break;
      case ClientMessageType.PlayCard:
        this.handlePlayCard(playerId, message.cardId, message.position);
        break;
      case ClientMessageType.Pass:
        this.handlePass(playerId);
        break;
      case ClientMessageType.Ping:
        this.send(playerId, { type: ServerMessageType.Pong });
        break;
    }
  }

  private handleSubmitDeck(playerId: PlayerId, deck: CardId[]): void {
    if (this.phase !== SessionPhase.WaitingForDecks) {
      this.sendError(playerId, ErrorCode.InvalidPhase, 'Cannot submit deck in current phase');
      return;
    }

    const player = this.players[playerId];
    if (!player) return;

    if (player.deck !== null) {
      this.sendError(playerId, ErrorCode.DeckAlreadySubmitted, 'Deck already submitted');
      return;
    }

    // Validate deck
    const validationError = this.validateDeck(deck);
    if (validationError) {
      this.sendError(playerId, ErrorCode.InvalidDeck, validationError);
      return;
    }

    player.deck = deck;

    // Notify opponent they're waiting
    const opponentId = (playerId === 0 ? 1 : 0) as PlayerId;
    const opponentPlayer = this.players[opponentId];
    if (opponentPlayer?.deck === null && opponentPlayer.ws) {
      this.send(playerId, { type: ServerMessageType.Waiting, reason: WaitingReason.OpponentDeck });
    }

    // If both decks received, create game
    if (this.players[0]?.deck && this.players[1]?.deck) {
      this.startGame(this.players[0].deck, this.players[1].deck);
    }
  }

  private handleMulligan(playerId: PlayerId, returnCardIds: CardId[]): void {
    if (this.phase !== SessionPhase.Mulligan || !this.gameState) {
      this.sendError(playerId, ErrorCode.InvalidPhase, 'Cannot mulligan in current phase');
      return;
    }

    if (this.mulliganDone[playerId]) {
      this.sendError(playerId, ErrorCode.InvalidPhase, 'Mulligan already completed');
      return;
    }

    try {
      this.gameState = mulligan(this.gameState, playerId, returnCardIds);
      this.mulliganDone[playerId] = true;
    } catch (e) {
      this.sendError(
        playerId,
        ErrorCode.InvalidMulligan,
        e instanceof Error ? e.message : 'Invalid mulligan',
      );
      return;
    }

    // Check if both players are done
    if (this.mulliganDone[0] && this.mulliganDone[1]) {
      // Engine transitions to Playing phase after both mulligans
      if (this.gameState.phase === GamePhase.Playing) {
        this.phase = SessionPhase.Playing;
      }
      this.sendStateToAllPlayers();
    } else {
      // Send updated state to this player, waiting message for opponent status
      this.sendStateToPlayer(playerId);
      const opponentId = (playerId === 0 ? 1 : 0) as PlayerId;
      if (!this.mulliganDone[opponentId]) {
        this.send(playerId, {
          type: ServerMessageType.Waiting,
          reason: WaitingReason.OpponentMulligan,
        });
      }
    }
  }

  private handlePlayCard(
    playerId: PlayerId,
    cardId: CardId,
    position: { row: number; col: number },
  ): void {
    if (this.phase !== SessionPhase.Playing || !this.gameState) {
      this.sendError(playerId, ErrorCode.InvalidPhase, 'Cannot play card in current phase');
      return;
    }

    if (this.gameState.currentPlayerIndex !== playerId) {
      this.sendError(playerId, ErrorCode.NotYourTurn, 'Not your turn');
      return;
    }

    try {
      this.gameState = playCard(this.gameState, cardId, position);
    } catch (e) {
      this.sendError(
        playerId,
        ErrorCode.InvalidMove,
        e instanceof Error ? e.message : 'Invalid move',
      );
      return;
    }

    this.checkGameEnd();
    this.sendStateToAllPlayers();
  }

  private handlePass(playerId: PlayerId): void {
    if (this.phase !== SessionPhase.Playing || !this.gameState) {
      this.sendError(playerId, ErrorCode.InvalidPhase, 'Cannot pass in current phase');
      return;
    }

    if (this.gameState.currentPlayerIndex !== playerId) {
      this.sendError(playerId, ErrorCode.NotYourTurn, 'Not your turn');
      return;
    }

    try {
      this.gameState = pass(this.gameState);
    } catch (e) {
      this.sendError(
        playerId,
        ErrorCode.InvalidMove,
        e instanceof Error ? e.message : 'Invalid pass',
      );
      return;
    }

    this.checkGameEnd();
    this.sendStateToAllPlayers();
  }

  // ── Game Logic ───────────────────────────────────────────────────

  private validateDeck(deck: CardId[]): string | null {
    if (!Array.isArray(deck)) return 'Deck must be an array';
    if (deck.length !== DECK_SIZE) return `Deck must contain exactly ${String(DECK_SIZE)} cards`;

    const definitions = getDefinitions();
    const seen = new Set<CardId>();
    for (const cardId of deck) {
      const def = definitions[cardId];
      if (!def) return `Unknown card ID: ${cardId}`;
      if (def.isToken) return `Token cards cannot be in a deck: ${cardId}`;
      if (seen.has(cardId)) return `Duplicate card ID: ${cardId}`;
      seen.add(cardId);
    }

    return null;
  }

  private startGame(p0Deck: CardId[], p1Deck: CardId[]): void {
    const seed = Math.floor(Math.random() * 0x7fffffff);
    const definitions = getDefinitions();
    const rng = createSeededRng(seed);
    this.gameState = createGame(p0Deck, p1Deck, definitions, undefined, rng);
    this.phase = SessionPhase.Mulligan;
    this.logger.info('session.game_started', { sessionId: this.id, seed });
    this.sendStateToAllPlayers();
  }

  private checkGameEnd(): void {
    if (this.gameState?.phase === GamePhase.Ended) {
      this.phase = SessionPhase.Ended;
      this.logger.info('session.game_ended', { sessionId: this.id });

      // Clear idle timer, set post-game cleanup
      this.clearIdleTimer();
      this.cleanupTimer = setTimeout(() => {
        this.dispose();
      }, POST_GAME_CLEANUP_MS);
    }
  }

  // ── Communication ────────────────────────────────────────────────

  private sendStateToPlayer(playerId: PlayerId): void {
    if (!this.gameState) return;

    const filteredState = filterStateForPlayer(this.gameState, playerId);
    const isCurrentPlayer =
      this.phase === SessionPhase.Playing && this.gameState.currentPlayerIndex === playerId;

    const message: ServerMessage = isCurrentPlayer
      ? {
          type: ServerMessageType.State,
          state: filteredState,
          phase: this.phase,
          validMoves: getValidMoves(this.gameState),
        }
      : {
          type: ServerMessageType.State,
          state: filteredState,
          phase: this.phase,
        };

    this.send(playerId, message);

    this.logger.debug('session.state_sent', { sessionId: this.id, playerId, phase: this.phase });
  }

  private sendStateToAllPlayers(): void {
    this.sendStateToPlayer(0);
    this.sendStateToPlayer(1);
  }

  private send(playerId: PlayerId, message: ServerMessage): void {
    const player = this.players[playerId];
    if (player?.ws) {
      try {
        player.ws.send(JSON.stringify(message));
      } catch {
        // WebSocket may be closing
      }
    }
  }

  private sendError(playerId: PlayerId, code: ErrorCode, message: string): void {
    this.send(playerId, { type: ServerMessageType.Error, code, message });
    this.logger.warn('connection.error', { sessionId: this.id, playerId, errorCode: code });
  }

  // ── Timers ───────────────────────────────────────────────────────

  private resetIdleTimer(): void {
    this.clearIdleTimer();
    this.idleTimer = setTimeout(() => {
      this.logger.info('session.expired', { sessionId: this.id, reason: 'idle' });
      this.sendToAll({
        type: ServerMessageType.Error,
        code: ErrorCode.IdleTimeout,
        message: 'Session timed out due to inactivity',
      });
      this.dispose();
    }, IDLE_TIMEOUT_MS);
  }

  private clearIdleTimer(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  private startAbandonedTimer(ms: number): void {
    this.clearAbandonedTimer();
    this.abandonedTimer = setTimeout(() => {
      this.logger.info('session.expired', { sessionId: this.id, reason: 'abandoned' });
      this.dispose();
    }, ms);
  }

  private clearAbandonedTimer(): void {
    if (this.abandonedTimer) {
      clearTimeout(this.abandonedTimer);
      this.abandonedTimer = null;
    }
  }

  private sendToAll(message: ServerMessage): void {
    this.send(0, message);
    this.send(1, message);
  }

  // ── Lifecycle ────────────────────────────────────────────────────

  /** Notify all players of shutdown and prepare for disposal. */
  notifyShutdown(): void {
    this.sendToAll({
      type: ServerMessageType.Error,
      code: ErrorCode.InternalError,
      message: 'Server shutting down',
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    this.clearIdleTimer();
    this.clearAbandonedTimer();

    if (this.cleanupTimer) {
      clearTimeout(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    for (const player of this.players) {
      if (player?.reconnectTimer) {
        clearTimeout(player.reconnectTimer);
        player.reconnectTimer = null;
      }
      if (player?.ws) {
        try {
          player.ws.close(1001, 'Session ended');
        } catch {
          // Already closed
        }
        player.ws = null;
      }
    }

    this.onDispose(this.id);
  }

  /** Restart the abandoned timer for WaitingForPlayers phase. */
  resetAbandonedTimer(): void {
    if (this.phase === SessionPhase.WaitingForPlayers) {
      this.startAbandonedTimer(ABANDONED_WAITING_MS);
    }
  }
}
