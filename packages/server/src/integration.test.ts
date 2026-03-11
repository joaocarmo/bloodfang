import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { serve } from '@hono/node-server';
import type { ServerType } from '@hono/node-server';
import WebSocket from 'ws';
import { getAllGameDefinitions, DECK_SIZE } from '@bloodfang/engine';
import type { CardId } from '@bloodfang/engine';
import { createApp } from './app.js';
import type { ServerMessage } from './protocol.js';
import { ServerMessageType, SessionPhase, ErrorCode } from './protocol.js';

// ── Helpers ──────────────────────────────────────────────────────────

const definitions = getAllGameDefinitions();
const allNonTokenIds = (Object.entries(definitions) as [CardId, (typeof definitions)[string]][])
  .filter(([_, def]) => !def.isToken)
  .map(([id]) => id);

function buildDeck(start: number): CardId[] {
  return allNonTokenIds.slice(start, start + DECK_SIZE);
}

const silentLogger = {
  debug() {
    /* noop */
  },
  info() {
    /* noop */
  },
  warn() {
    /* noop */
  },
  error() {
    /* noop */
  },
};

let server: ServerType;
let port: number;
let manager: ReturnType<typeof createApp>['manager'];

function baseUrl() {
  return `http://127.0.0.1:${String(port)}`;
}

function wsUrl(sessionId: string, token: string) {
  return `ws://127.0.0.1:${String(port)}/api/sessions/${sessionId}/ws?token=${token}`;
}

interface TestClient {
  ws: WebSocket;
  messages: ServerMessage[];
  send: (msg: Record<string, unknown>) => void;
  close: () => void;
  waitFor: (
    predicate: (msg: ServerMessage) => boolean,
    timeoutMs?: number,
  ) => Promise<ServerMessage>;
}

/** Connect a WebSocket and collect messages. */
function connectWs(url: string): TestClient {
  const messages: ServerMessage[] = [];
  const ws = new WebSocket(url);
  const listeners: ((msg: ServerMessage) => void)[] = [];

  ws.on('message', (data) => {
    const msg = JSON.parse((data as Buffer).toString('utf-8')) as ServerMessage;
    messages.push(msg);
    for (const fn of listeners) fn(msg);
  });

  const waitFor = (
    predicate: (msg: ServerMessage) => boolean,
    timeoutMs = 5000,
  ): Promise<ServerMessage> => {
    const existing = messages.find(predicate);
    if (existing) return Promise.resolve(existing);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(
          new Error(
            `Timed out waiting for message (${String(timeoutMs)}ms). Got ${String(messages.length)} messages: ${JSON.stringify(messages.map((m) => m.type))}`,
          ),
        );
      }, timeoutMs);

      function handler(msg: ServerMessage) {
        if (predicate(msg)) {
          cleanup();
          resolve(msg);
        }
      }

      function cleanup() {
        clearTimeout(timer);
        const idx = listeners.indexOf(handler);
        if (idx >= 0) listeners.splice(idx, 1);
      }

      listeners.push(handler);
    });
  };

  const send = (msg: Record<string, unknown>) => {
    ws.send(JSON.stringify(msg));
  };
  const close = () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };

  return { ws, messages, send, close, waitFor };
}

/** Open WS and wait for connection + first session_info. */
async function connectPlayer(sessionId: string, token: string): Promise<TestClient> {
  const client = connectWs(wsUrl(sessionId, token));

  await new Promise<void>((resolve, reject) => {
    client.ws.once('open', resolve);
    client.ws.once('error', reject);
  });

  return client;
}

async function createSession(): Promise<{ sessionId: string; token: string }> {
  const res = await fetch(`${baseUrl()}/api/sessions`, { method: 'POST' });
  expect(res.status).toBe(201);
  return (await res.json()) as { sessionId: string; token: string };
}

async function joinSession(sessionId: string): Promise<{ token: string }> {
  const res = await fetch(`${baseUrl()}/api/sessions/${sessionId}/join`, { method: 'POST' });
  expect(res.status).toBe(200);
  return (await res.json()) as { token: string };
}

/** Create session, join, connect both, wait until WaitingForDecks. */
async function setupBothConnected() {
  const { sessionId, token: p0Token } = await createSession();
  const { token: p1Token } = await joinSession(sessionId);

  const p0 = await connectPlayer(sessionId, p0Token);
  const p1 = await connectPlayer(sessionId, p1Token);

  // Wait for both to receive WaitingForDecks
  await Promise.all([
    p0.waitFor(
      (m) => m.type === ServerMessageType.SessionInfo && m.phase === SessionPhase.WaitingForDecks,
    ),
    p1.waitFor(
      (m) => m.type === ServerMessageType.SessionInfo && m.phase === SessionPhase.WaitingForDecks,
    ),
  ]);

  return { sessionId, p0, p1 };
}

/** Setup through to Playing phase. */
async function setupPlayingGame() {
  const { sessionId, p0, p1 } = await setupBothConnected();

  // Submit decks
  p0.send({ type: 'submit_deck', deck: buildDeck(0) });
  p1.send({ type: 'submit_deck', deck: buildDeck(DECK_SIZE) });

  // Wait for mulligan state
  await Promise.all([
    p0.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Mulligan),
    p1.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Mulligan),
  ]);

  // Mulligan (keep all)
  p0.send({ type: 'mulligan', returnCardIds: [] });
  p1.send({ type: 'mulligan', returnCardIds: [] });

  // Wait for playing state
  await Promise.all([
    p0.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Playing),
    p1.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Playing),
  ]);

  return { sessionId, p0, p1 };
}

// ── Setup / Teardown ─────────────────────────────────────────────────

const openClients: TestClient[] = [];

function track(...clients: TestClient[]) {
  openClients.push(...clients);
}

beforeAll(async () => {
  const appInstance = createApp({
    corsOrigin: '*',
    maxSessions: 100,
    logger: silentLogger,
    disableRateLimit: true,
  });
  manager = appInstance.manager;
  manager.start();

  await new Promise<void>((resolve) => {
    server = serve({ fetch: appInstance.app.fetch, port: 0 }, (info) => {
      port = info.port;
      appInstance.injectWebSocket(server);
      resolve();
    });
  });
});

afterEach(() => {
  for (const c of openClients) c.close();
  openClients.length = 0;
});

afterAll(async () => {
  manager.shutdownAll();
  manager.stop();
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});

// ── Tests ────────────────────────────────────────────────────────────

describe('HTTP API', () => {
  it('GET /health returns ok', async () => {
    const res = await fetch(`${baseUrl()}/health`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe('ok');
  });

  it('POST /api/sessions creates a session', async () => {
    const { sessionId, token } = await createSession();
    expect(sessionId).toBeTruthy();
    expect(token).toBeTruthy();
  });

  it('POST /api/sessions/:id/join joins existing session', async () => {
    const { sessionId } = await createSession();
    const { token } = await joinSession(sessionId);
    expect(token).toBeTruthy();
  });

  it('POST /api/sessions/:id/join returns 404 for unknown session', async () => {
    const res = await fetch(`${baseUrl()}/api/sessions/nonexist/join`, { method: 'POST' });
    expect(res.status).toBe(404);
  });

  it('GET /api/sessions/:id returns session status', async () => {
    const { sessionId } = await createSession();
    const res = await fetch(`${baseUrl()}/api/sessions/${sessionId}`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { sessionId: string; phase: string; playerCount: number };
    expect(body.sessionId).toBe(sessionId);
    expect(body.phase).toBe(SessionPhase.WaitingForPlayers);
    expect(body.playerCount).toBe(1);
  });

  it('GET /api/sessions/:id returns 404 for unknown session', async () => {
    const res = await fetch(`${baseUrl()}/api/sessions/nonexist`);
    expect(res.status).toBe(404);
  });
});

describe('WebSocket connection', () => {
  it('rejects connection with invalid session', async () => {
    const client = await connectPlayer('nonexist', 'badtoken');
    track(client);

    const msg = await client.waitFor((m) => m.type === ServerMessageType.Error);
    expect(msg.type).toBe(ServerMessageType.Error);
    if (msg.type === ServerMessageType.Error) {
      expect(msg.code).toBe(ErrorCode.InvalidSession);
    }
  });

  it('rejects connection with invalid token', async () => {
    const { sessionId } = await createSession();
    const client = await connectPlayer(sessionId, 'badtoken');
    track(client);

    const msg = await client.waitFor((m) => m.type === ServerMessageType.Error);
    expect(msg.type).toBe(ServerMessageType.Error);
    if (msg.type === ServerMessageType.Error) {
      expect(msg.code).toBe(ErrorCode.InvalidToken);
    }
  });

  it('sends session_info on valid connection', async () => {
    const { sessionId, token } = await createSession();
    const client = await connectPlayer(sessionId, token);
    track(client);

    const info = await client.waitFor((m) => m.type === ServerMessageType.SessionInfo);
    expect(info.type).toBe(ServerMessageType.SessionInfo);
    if (info.type === ServerMessageType.SessionInfo) {
      expect(info.sessionId).toBe(sessionId);
      expect(info.playerId).toBe(0);
    }
  });

  it('transitions to WaitingForDecks when both connect', async () => {
    const { p0, p1 } = await setupBothConnected();
    track(p0, p1);

    // Both should have received WaitingForDecks (setupBothConnected waits for it)
    const p0Info = p0.messages.find(
      (m): m is ServerMessage & { type: ServerMessageType.SessionInfo } =>
        m.type === ServerMessageType.SessionInfo && m.phase === SessionPhase.WaitingForDecks,
    );
    expect(p0Info).toBeDefined();
  });
});

describe('Full game flow', () => {
  it('two players play a complete game (pass-pass)', async () => {
    const { p0, p1 } = await setupPlayingGame();
    track(p0, p1);

    // Play a few cards
    let movesPlayed = 0;
    const MAX_MOVES = 4;

    while (movesPlayed < MAX_MOVES) {
      // Find who has valid moves (current player receives validMoves in state)
      const p0State = [...p0.messages].reverse().find((m) => m.type === ServerMessageType.State) as
        | (ServerMessage & { type: ServerMessageType.State })
        | undefined;
      const p1State = [...p1.messages].reverse().find((m) => m.type === ServerMessageType.State) as
        | (ServerMessage & { type: ServerMessageType.State })
        | undefined;

      let currentPlayer: TestClient | undefined;
      let validMoves:
        | NonNullable<(ServerMessage & { type: ServerMessageType.State })['validMoves']>
        | undefined;

      if (p0State?.validMoves && p0State.validMoves.length > 0) {
        currentPlayer = p0;
        validMoves = p0State.validMoves;
      } else if (p1State?.validMoves && p1State.validMoves.length > 0) {
        currentPlayer = p1;
        validMoves = p1State.validMoves;
      }

      if (!currentPlayer || !validMoves) break;

      const move = validMoves[0];
      const pos = move?.positions[0];
      if (!move || !pos) break;
      const stateCountP0 = p0.messages.filter((m) => m.type === ServerMessageType.State).length;
      const stateCountP1 = p1.messages.filter((m) => m.type === ServerMessageType.State).length;

      currentPlayer.send({
        type: 'play_card',
        cardId: move.cardId,
        position: { row: pos.row, col: pos.col },
      });

      // Wait for both to get new state
      await Promise.all([
        p0.waitFor(
          () => p0.messages.filter((m) => m.type === ServerMessageType.State).length > stateCountP0,
        ),
        p1.waitFor(
          () => p1.messages.filter((m) => m.type === ServerMessageType.State).length > stateCountP1,
        ),
      ]);

      movesPlayed++;
    }

    // End the game with pass-pass
    // Determine current player
    const p0Latest = [...p0.messages].reverse().find((m) => m.type === ServerMessageType.State) as
      | (ServerMessage & { type: ServerMessageType.State })
      | undefined;

    const firstPasser = p0Latest?.state.currentPlayerIndex === 0 ? p0 : p1;
    const secondPasser = firstPasser === p0 ? p1 : p0;

    // First pass
    const countBefore1 = secondPasser.messages.filter(
      (m) => m.type === ServerMessageType.State,
    ).length;
    firstPasser.send({ type: 'pass' });
    await secondPasser.waitFor(
      () =>
        secondPasser.messages.filter((m) => m.type === ServerMessageType.State).length >
        countBefore1,
    );

    // Second pass — ends the game
    secondPasser.send({ type: 'pass' });

    // Both should receive Ended state
    const [p0End, p1End] = await Promise.all([
      p0.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Ended),
      p1.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Ended),
    ]);

    expect(p0End.type).toBe(ServerMessageType.State);
    expect(p1End.type).toBe(ServerMessageType.State);
    if (p0End.type === ServerMessageType.State) {
      expect(p0End.phase).toBe(SessionPhase.Ended);
    }
  }, 15000);
});

describe('Game action validation', () => {
  it('rejects play_card when not your turn', async () => {
    const { p0, p1 } = await setupPlayingGame();
    track(p0, p1);

    // Find non-current player
    const p0State = [...p0.messages].reverse().find((m) => m.type === ServerMessageType.State) as
      | (ServerMessage & { type: ServerMessageType.State })
      | undefined;

    const notCurrent = p0State?.validMoves ? p1 : p0;
    notCurrent.send({ type: 'play_card', cardId: 'anything', position: { row: 0, col: 0 } });

    const err = await notCurrent.waitFor(
      (m) => m.type === ServerMessageType.Error && m.code === ErrorCode.NotYourTurn,
    );
    expect(err.type).toBe(ServerMessageType.Error);
  }, 10000);

  it('rejects pass when not your turn', async () => {
    const { p0, p1 } = await setupPlayingGame();
    track(p0, p1);

    const p0State = [...p0.messages].reverse().find((m) => m.type === ServerMessageType.State) as
      | (ServerMessage & { type: ServerMessageType.State })
      | undefined;

    const notCurrent = p0State?.validMoves ? p1 : p0;
    notCurrent.send({ type: 'pass' });

    const err = await notCurrent.waitFor(
      (m) => m.type === ServerMessageType.Error && m.code === ErrorCode.NotYourTurn,
    );
    expect(err.type).toBe(ServerMessageType.Error);
  }, 10000);

  it('rejects duplicate deck submission', async () => {
    const { p0, p1 } = await setupBothConnected();
    track(p0, p1);

    p0.send({ type: 'submit_deck', deck: buildDeck(0) });
    // Wait for the first deck to be accepted (waiting message or state)
    await p0.waitFor(
      (m) => m.type === ServerMessageType.Waiting || m.type === ServerMessageType.State,
    );

    // Submit again
    p0.send({ type: 'submit_deck', deck: buildDeck(0) });

    const err = await p0.waitFor(
      (m) => m.type === ServerMessageType.Error && m.code === ErrorCode.DeckAlreadySubmitted,
    );
    expect(err.type).toBe(ServerMessageType.Error);
  }, 10000);

  it('rejects invalid deck size', async () => {
    const { p0, p1 } = await setupBothConnected();
    track(p0, p1);

    p0.send({ type: 'submit_deck', deck: allNonTokenIds.slice(0, 5) });

    const err = await p0.waitFor(
      (m) => m.type === ServerMessageType.Error && m.code === ErrorCode.InvalidDeck,
    );
    expect(err.type).toBe(ServerMessageType.Error);
  }, 10000);

  it('responds to ping with pong', async () => {
    const { sessionId, token } = await createSession();
    const client = await connectPlayer(sessionId, token);
    track(client);

    await client.waitFor((m) => m.type === ServerMessageType.SessionInfo);
    client.send({ type: 'ping' });

    const pong = await client.waitFor((m) => m.type === ServerMessageType.Pong);
    expect(pong.type).toBe(ServerMessageType.Pong);
  }, 5000);
});
