import { serve } from '@hono/node-server';
import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { loadConfig } from './config.js';
import { ConsoleLogger } from './logger.js';
import { InMemorySessionStore, SessionManager } from './session-manager.js';
import { parseClientMessage } from './validation.js';
import { type SessionId, type PlayerToken, ServerMessageType, ErrorCode } from './protocol.js';

// ── Bootstrap ────────────────────────────────────────────────────────

const config = loadConfig();
const logger = new ConsoleLogger(config.logLevel);
const store = new InMemorySessionStore();
const manager = new SessionManager(store, config.maxSessions, logger);

const app = new Hono();
const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

// ── Rate Limiting ────────────────────────────────────────────────────

const rateLimitCounters = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const entry = rateLimitCounters.get(key);
  if (!entry || now >= entry.resetAt) {
    rateLimitCounters.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > maxPerMinute;
}

function getClientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  return (
    c.req.header('cf-connecting-ip') ??
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

// ── Middleware ────────────────────────────────────────────────────────

app.use('*', cors({ origin: config.corsOrigin }));

// ── Health Check ─────────────────────────────────────────────────────

app.get('/health', (c) => {
  return c.json({ status: 'ok', sessions: manager.sessionCount });
});

// ── HTTP Routes ──────────────────────────────────────────────────────

app.post('/api/sessions', (c) => {
  const ip = getClientIp(c);
  if (isRateLimited(`create:${ip}`, 5)) {
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }

  try {
    const result = manager.createSession();
    return c.json(result, 201);
  } catch {
    return c.json({ error: 'Maximum sessions reached' }, 503);
  }
});

app.post('/api/sessions/:id/join', (c) => {
  const ip = getClientIp(c);
  if (isRateLimited(`join:${ip}`, 10)) {
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }

  const sessionId = c.req.param('id') as SessionId;
  const result = manager.joinSession(sessionId);

  if (!result) {
    return c.json({ error: 'Session not found or full' }, 404);
  }

  return c.json(result);
});

app.get('/api/sessions/:id', (c) => {
  const sessionId = c.req.param('id') as SessionId;
  const session = manager.getSession(sessionId);

  if (!session) {
    return c.json({ error: 'Session not found' }, 404);
  }

  return c.json({
    sessionId,
    phase: session.getPhase(),
    playerCount: session.playerCount,
  });
});

// ── WebSocket ────────────────────────────────────────────────────────

const wsMessageCounters = new Map<string, { count: number; resetAt: number }>();

app.get(
  '/api/sessions/:id/ws',
  upgradeWebSocket((c) => {
    const sessionId = c.req.param('id') as SessionId;
    const token = c.req.query('token') as PlayerToken | undefined;

    // Validate origin in production
    if (config.corsOrigin !== 'http://localhost:5173') {
      const origin = c.req.header('origin');
      if (origin && origin !== config.corsOrigin) {
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
        // Rate limit WS messages
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

        const raw = typeof event.data === 'string' ? event.data : String(event.data);
        const message = parseClientMessage(raw);
        if (!message) {
          session.handleMessage(playerId, { type: 'ping' } as never);
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

// ── Server Start ─────────────────────────────────────────────────────

manager.start();

const server = serve({ fetch: app.fetch, port: config.port }, (info) => {
  logger.info('server.started', { port: info.port, logLevel: config.logLevel });
  injectWebSocket(server);
});

// ── Graceful Shutdown ────────────────────────────────────────────────

function shutdown(signal: string) {
  logger.info('server.shutdown', { reason: signal });
  manager.shutdownAll();
  manager.stop();

  server.close(() => {
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
