import { nanoid } from 'nanoid';
import type { Logger } from './logger.js';
import type { PlayerToken, SessionId } from './protocol.js';
import { Session } from './session.js';

// ── Session Store Interface ──────────────────────────────────────────

export interface SessionStore {
  get(id: SessionId): Session | undefined;
  set(id: SessionId, session: Session): void;
  delete(id: SessionId): void;
  values(): IterableIterator<Session>;
  size: number;
}

// ── In-Memory Session Store ──────────────────────────────────────────

export class InMemorySessionStore implements SessionStore {
  private readonly map = new Map<SessionId, Session>();

  get(id: SessionId): Session | undefined {
    return this.map.get(id);
  }

  set(id: SessionId, session: Session): void {
    this.map.set(id, session);
  }

  delete(id: SessionId): void {
    this.map.delete(id);
  }

  values(): IterableIterator<Session> {
    return this.map.values();
  }

  get size(): number {
    return this.map.size;
  }
}

// ── Session Manager ──────────────────────────────────────────────────

const SWEEP_INTERVAL_MS = 60_000;

export class SessionManager {
  private readonly store: SessionStore;
  private readonly maxSessions: number;
  private readonly logger: Logger;
  private sweepTimer: ReturnType<typeof setInterval> | null = null;

  constructor(store: SessionStore, maxSessions: number, logger: Logger) {
    this.store = store;
    this.maxSessions = maxSessions;
    this.logger = logger;
  }

  start(): void {
    this.sweepTimer = setInterval(() => {
      this.sweep();
    }, SWEEP_INTERVAL_MS);
  }

  stop(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
  }

  createSession(): { sessionId: SessionId; token: PlayerToken } {
    if (this.store.size >= this.maxSessions) {
      throw new Error('Maximum number of sessions reached');
    }

    const sessionId: SessionId = nanoid(8);
    const token: PlayerToken = nanoid();

    const session = new Session(sessionId, this.logger, (id) => {
      this.store.delete(id);
    });
    session.addPlayer(token);
    this.store.set(sessionId, session);

    this.logger.info('session.created', { sessionId });
    return { sessionId, token };
  }

  joinSession(sessionId: SessionId): { token: PlayerToken } | null {
    const session = this.store.get(sessionId);
    if (!session) return null;

    if (session.playerCount >= 2) return null;

    const token: PlayerToken = nanoid();
    const playerId = session.addPlayer(token);
    if (playerId === null) return null;

    // Reset abandoned timer since P2 has joined (via HTTP, WS connect comes next)
    session.resetAbandonedTimer();

    this.logger.info('session.joined', { sessionId, playerId });
    return { token };
  }

  getSession(sessionId: SessionId): Session | undefined {
    return this.store.get(sessionId);
  }

  get sessionCount(): number {
    return this.store.size;
  }

  /** Notify all sessions of shutdown. */
  shutdownAll(): void {
    for (const session of this.store.values()) {
      session.notifyShutdown();
      session.dispose();
    }
  }

  private sweep(): void {
    // The sweep is a safety net — sessions normally clean themselves up via dispose().
    // Currently a no-op; can add stale session detection if needed.
  }
}
