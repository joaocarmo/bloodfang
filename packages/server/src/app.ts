import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { InMemorySessionStore, SessionManager } from './session-manager.js';
import { parseClientMessage } from './validation.js';
import {
  type SessionId,
  type PlayerToken,
  ClientMessageType,
  ServerMessageType,
  ErrorCode,
} from './protocol.js';
import type { Logger } from './logger.js';
import { Route } from './routes.js';
import { HttpStatus } from './http-status.js';
import { createRateLimiter } from './rate-limiter.js';
import { getClientIp } from './client-ip.js';

// ── App Factory ─────────────────────────────────────────────────────

export interface AppOptions {
  corsOrigin: string;
  maxSessions: number;
  logger: Logger;
  /** Disable rate limiting (for tests). Defaults to false. */
  disableRateLimit?: boolean;
}

export interface AppInstance {
  app: Hono;
  manager: SessionManager;
  injectWebSocket: ReturnType<typeof createNodeWebSocket>['injectWebSocket'];
}

export function createApp(options: AppOptions): AppInstance {
  const { corsOrigin, maxSessions, logger, disableRateLimit = false } = options;
  const store = new InMemorySessionStore();
  const manager = new SessionManager(store, maxSessions, logger);

  const app = new Hono();
  const nodeWs = createNodeWebSocket({ app });
  const { upgradeWebSocket } = nodeWs;

  const isRateLimited = disableRateLimit ? () => false : createRateLimiter();
  const wsMessageCounters = new Map<string, { count: number; resetAt: number }>();

  // ── Middleware ──────────────────────────────────────────────────
  app.use('*', cors({ origin: corsOrigin }));

  // ── Health Check ───────────────────────────────────────────────
  app.get(Route.Health, (c) => {
    return c.json({ status: 'ok', sessions: manager.sessionCount });
  });

  // ── HTTP Routes ────────────────────────────────────────────────
  app.post(Route.Sessions, (c) => {
    const ip = getClientIp(c);
    if (isRateLimited(`create:${ip}`, 5)) {
      return c.json({ error: 'Rate limit exceeded' }, HttpStatus.TooManyRequests);
    }

    try {
      const result = manager.createSession();
      return c.json(result, HttpStatus.Created);
    } catch {
      return c.json({ error: 'Maximum sessions reached' }, HttpStatus.ServiceUnavailable);
    }
  });

  app.post(Route.SessionJoin, (c) => {
    const ip = getClientIp(c);
    if (isRateLimited(`join:${ip}`, 10)) {
      return c.json({ error: 'Rate limit exceeded' }, HttpStatus.TooManyRequests);
    }

    const sessionId = c.req.param('id') as SessionId;
    const result = manager.joinSession(sessionId);

    if (!result) {
      return c.json({ error: 'Session not found or full' }, HttpStatus.NotFound);
    }

    return c.json(result);
  });

  app.get(Route.SessionStatus, (c) => {
    const sessionId = c.req.param('id') as SessionId;
    const session = manager.getSession(sessionId);

    if (!session) {
      return c.json({ error: 'Session not found' }, HttpStatus.NotFound);
    }

    return c.json({
      sessionId,
      phase: session.getPhase(),
      playerCount: session.playerCount,
    });
  });

  // ── WebSocket ──────────────────────────────────────────────────
  app.get(
    Route.SessionWs,
    upgradeWebSocket((c) => {
      const sessionId = c.req.param('id') as SessionId;
      const token = c.req.query('token') as PlayerToken | undefined;

      // Validate origin (skip when corsOrigin is wildcard, e.g. in tests)
      if (corsOrigin !== '*') {
        const origin = c.req.header('origin');
        if (origin && origin !== corsOrigin) {
          return {
            onOpen(_event, ws) {
              ws.send(
                JSON.stringify({
                  type: ServerMessageType.Error,
                  code: ErrorCode.InvalidToken,
                  message: 'Invalid origin',
                }),
              );
              ws.close(1008, 'Invalid origin');
            },
          };
        }
      }

      const session = manager.getSession(sessionId);
      if (!session || !token) {
        return {
          onOpen(_event, ws) {
            ws.send(
              JSON.stringify({
                type: ServerMessageType.Error,
                code: ErrorCode.InvalidSession,
                message: 'Session not found',
              }),
            );
            ws.close(1008, 'Invalid session');
          },
        };
      }

      const playerId = session.findPlayerByToken(token);
      if (playerId === null) {
        return {
          onOpen(_event, ws) {
            ws.send(
              JSON.stringify({
                type: ServerMessageType.Error,
                code: ErrorCode.InvalidToken,
                message: 'Invalid token',
              }),
            );
            ws.close(1008, 'Invalid token');
          },
        };
      }

      const connectionKey = `${sessionId}:${String(playerId)}`;

      return {
        onOpen(_event, ws) {
          session.connectPlayer(playerId, ws);
        },

        onMessage(event, _ws) {
          const now = Date.now();
          const counter = wsMessageCounters.get(connectionKey);
          if (!counter || now >= counter.resetAt) {
            wsMessageCounters.set(connectionKey, { count: 1, resetAt: now + 1_000 });
          } else {
            counter.count++;
            if (counter.count > 30) {
              session.disconnectPlayer(playerId);
              return;
            }
          }

          if (typeof event.data !== 'string') return;
          const raw = event.data;
          const message = parseClientMessage(raw);
          if (!message) {
            session.handleMessage(playerId, { type: ClientMessageType.Ping });
            return;
          }
          session.handleMessage(playerId, message);
        },

        onClose() {
          wsMessageCounters.delete(connectionKey);
          session.disconnectPlayer(playerId);
        },

        onError() {
          wsMessageCounters.delete(connectionKey);
          session.disconnectPlayer(playerId);
        },
      };
    }),
  );

  return {
    app,
    manager,
    injectWebSocket: nodeWs.injectWebSocket.bind(nodeWs),
  };
}
