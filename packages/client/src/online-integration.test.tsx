/**
 * Client integration tests with a real server.
 *
 * Spins up the actual game server, connects two Node.js WebSocket clients,
 * drives the game through the server protocol, feeds received messages into
 * the client Zustand store, renders components, and asserts the DOM.
 *
 * No code-level mocking — the server, store, providers, and components are all real.
 */

import type { CardId } from '@bloodfang/engine';
import { DECK_SIZE, GamePhase, getAllGameDefinitions } from '@bloodfang/engine';
import type { ServerMessage } from '@bloodfang/server/protocol';
import { ServerMessageType, SessionPhase } from '@bloodfang/server/protocol';
import { createApp, Route } from '@bloodfang/server/testing';
import type { ServerType } from '@hono/node-server';
import { serve } from '@hono/node-server';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import WebSocket from 'ws';
import { PassButton } from './components/game/pass-button.tsx';
import { TurnIndicator } from './components/game/turn-indicator.tsx';
import { Hand } from './components/hand/hand.tsx';
import { useOnlineGameStore } from './store/online-game-store.ts';
import { renderWithOnlineProviders, resetStores, screen } from './test-utils.tsx';

// ── Server setup ────────────────────────────────────────────────────────

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

const definitions = getAllGameDefinitions();
const allNonTokenIds = (Object.entries(definitions) as [CardId, (typeof definitions)[string]][])
  .filter(([_, def]) => !def.isToken)
  .map(([id]) => id);

function buildDeck(start: number): CardId[] {
  return allNonTokenIds.slice(start, start + DECK_SIZE);
}

function baseUrl() {
  return `http://127.0.0.1:${String(port)}`;
}

function wsUrl(sessionId: string, token: string) {
  const path = Route.SessionWs.replace(':id', sessionId);
  return `ws://127.0.0.1:${String(port)}${path}?token=${token}`;
}

// ── WebSocket test client ───────────────────────────────────────────────

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
            `Timed out (${String(timeoutMs)}ms). Messages: ${JSON.stringify(messages.map((m) => m.type))}`,
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

  return {
    ws,
    messages,
    send: (msg) => {
      ws.send(JSON.stringify(msg));
    },
    close: () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close();
    },
    waitFor,
  };
}

async function connectPlayer(sessionId: string, token: string): Promise<TestClient> {
  const client = connectWs(wsUrl(sessionId, token));
  await new Promise<void>((resolve, reject) => {
    client.ws.once('open', resolve);
    client.ws.once('error', reject);
  });
  return client;
}

async function createSession(): Promise<{ sessionId: string; token: string }> {
  const res = await fetch(`${baseUrl()}${Route.Sessions}`, { method: 'POST' });
  return (await res.json()) as { sessionId: string; token: string };
}

async function joinSession(sessionId: string): Promise<{ token: string }> {
  const path = Route.SessionJoin.replace(':id', sessionId);
  const res = await fetch(`${baseUrl()}${path}`, { method: 'POST' });
  return (await res.json()) as { token: string };
}

// ── Lifecycle ───────────────────────────────────────────────────────────

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
  resetStores();
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

// ── Helper: drive both players to Playing phase, feed P0 state to store ─

async function setupToPlaying() {
  const { sessionId, token: p0Token } = await createSession();
  const { token: p1Token } = await joinSession(sessionId);

  const p0 = await connectPlayer(sessionId, p0Token);
  const p1 = await connectPlayer(sessionId, p1Token);
  track(p0, p1);

  // Wait for WaitingForDecks
  await Promise.all([
    p0.waitFor(
      (m) => m.type === ServerMessageType.SessionInfo && m.phase === SessionPhase.WaitingForDecks,
    ),
    p1.waitFor(
      (m) => m.type === ServerMessageType.SessionInfo && m.phase === SessionPhase.WaitingForDecks,
    ),
  ]);

  // Submit decks
  p0.send({ type: 'submit_deck', deck: buildDeck(0) });
  p1.send({ type: 'submit_deck', deck: buildDeck(DECK_SIZE) });

  // Wait for mulligan
  await Promise.all([
    p0.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Mulligan),
    p1.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Mulligan),
  ]);

  // Skip mulligan
  p0.send({ type: 'mulligan', returnCardIds: [] });
  p1.send({ type: 'mulligan', returnCardIds: [] });

  // Wait for Playing state
  const [p0PlayMsg] = await Promise.all([
    p0.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Playing),
    p1.waitFor((m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Playing),
  ]);

  return { sessionId, p0, p1, p0Token, p1Token, p0PlayMsg };
}

/** Feed a server message into the client store (the network boundary). */
function feedToStore(msg: ServerMessage) {
  useOnlineGameStore.getState().handleServerMessage(msg);
}

// ── Helpers ─────────────────────────────────────────────────────────────

function getState() {
  const state = useOnlineGameStore.getState().filteredGameState;
  if (!state) throw new Error('Expected filteredGameState to be set');
  return state;
}

/** Make it the opponent's turn by playing a card or passing. */
async function advanceToOpponentTurn(p0: TestClient) {
  const validMoves = useOnlineGameStore.getState().validMoves;
  const firstMove = validMoves[0];
  if (firstMove) {
    const pos = firstMove.positions[0];
    if (pos) {
      p0.send({ type: 'play_card', cardId: firstMove.cardId, position: pos });
    } else {
      p0.send({ type: 'pass' });
    }
  } else {
    p0.send({ type: 'pass' });
  }

  const nextMsg = await p0.waitFor(
    (m) =>
      m.type === ServerMessageType.State &&
      m.phase === SessionPhase.Playing &&
      m.state.currentPlayerIndex === 1,
  );
  feedToStore(nextMsg);
}

// ── Tests ───────────────────────────────────────────────────────────────

describe('Client + real server integration', () => {
  it('opponent connected banner clears after State message from server', async () => {
    const { p0PlayMsg } = await setupToPlaying();

    // Simulate the stale state: opponentConnected was false from lobby handshake
    useOnlineGameStore.setState({ opponentConnected: false, connectionStatus: 'connected' });

    // Feed the real State message from the server
    feedToStore(p0PlayMsg);

    // Store should now have opponentConnected = true
    const store = useOnlineGameStore.getState();
    expect(store.opponentConnected).toBe(true);
    expect(store.filteredGameState).not.toBeNull();
    expect(store.filteredGameState?.phase).toBe(GamePhase.Playing);
  }, 15000);

  it('real server State message renders correct turn indicator', async () => {
    const { p0PlayMsg } = await setupToPlaying();
    feedToStore(p0PlayMsg);

    renderWithOnlineProviders(<TurnIndicator />);

    const state = getState();
    if (state.currentPlayerIndex === 0) {
      expect(screen.getByText(/Your Turn/)).toBeInTheDocument();
    } else {
      expect(screen.getByText(/Opponent/)).toBeInTheDocument();
    }
    expect(screen.getByText(new RegExp(`Turn ${String(state.turnNumber)}`))).toBeInTheDocument();
  }, 15000);

  it('real server State message renders hand with correct card count', async () => {
    const { p0PlayMsg } = await setupToPlaying();
    feedToStore(p0PlayMsg);

    renderWithOnlineProviders(<Hand />);

    const state = getState();
    const handSize = state.players[0].hand.length;

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(`Your Hand (${String(handSize)})`);

    if (state.currentPlayerIndex === 0) {
      // My turn: hand should be interactive
      const listbox = screen.getByRole('listbox');
      expect(listbox.className).not.toContain('opacity-50');
    }
  }, 15000);

  it('hand is dimmed when opponent has the turn (real server state)', async () => {
    const { p0, p0PlayMsg } = await setupToPlaying();

    // Feed the Playing state
    feedToStore(p0PlayMsg);

    const state = getState();

    if (state.currentPlayerIndex === 0) {
      await advanceToOpponentTurn(p0);
    }

    // Now it should be opponent's turn (currentPlayerIndex === 1)
    expect(useOnlineGameStore.getState().filteredGameState?.currentPlayerIndex).toBe(1);

    renderWithOnlineProviders(<Hand />);

    const handEl = screen.queryByRole('listbox');
    if (handEl) {
      expect(handEl.className).toContain('opacity-50');
      expect(handEl.className).toContain('pointer-events-none');
    }
    expect(screen.getByText(/Waiting for opponent/i)).toBeInTheDocument();
  }, 15000);

  it('pass button has aria-disabled when not my turn (real server state)', async () => {
    const { p0, p0PlayMsg } = await setupToPlaying();
    feedToStore(p0PlayMsg);

    const state = getState();

    if (state.currentPlayerIndex === 0) {
      await advanceToOpponentTurn(p0);
    }

    renderWithOnlineProviders(<PassButton />);

    const button = screen.getByRole('button', { name: /Pass/i });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button.className).toContain('opacity-50');
  }, 15000);

  it('opponent deck count is available from real server state', async () => {
    const { p0PlayMsg } = await setupToPlaying();
    feedToStore(p0PlayMsg);

    const state = getState();
    const opponentPlayer = state.players[1];
    expect('deckCount' in opponentPlayer).toBe(true);
    if ('deckCount' in opponentPlayer) {
      // Opponent should have cards in deck (DECK_SIZE - hand size drawn)
      expect(opponentPlayer.deckCount).toBeGreaterThan(0);
    }
  }, 15000);

  it('disconnect and reconnect updates store correctly with real server', async () => {
    const { sessionId, p0, p1, p1Token } = await setupToPlaying();

    // Feed initial state
    const p0PlayMsg = p0.messages.find(
      (m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Playing,
    );
    if (!p0PlayMsg) throw new Error('Expected Playing state message');
    feedToStore(p0PlayMsg);
    expect(useOnlineGameStore.getState().opponentConnected).toBe(true);

    // Disconnect P1
    p1.close();

    // Wait for OpponentDisconnected
    const disconnectMsg = await p0.waitFor(
      (m) => m.type === ServerMessageType.OpponentDisconnected,
    );
    feedToStore(disconnectMsg);
    expect(useOnlineGameStore.getState().opponentConnected).toBe(false);

    // Reconnect P1
    const p1Reconnected = await connectPlayer(sessionId, p1Token);
    track(p1Reconnected);

    // Wait for OpponentConnected
    const connectMsg = await p0.waitFor((m) => m.type === ServerMessageType.OpponentConnected);
    feedToStore(connectMsg);
    expect(useOnlineGameStore.getState().opponentConnected).toBe(true);
  }, 15000);

  it('pendingDeck store round-trip matches what server accepts', async () => {
    const deck = buildDeck(0);

    // Store deck via setPendingDeck (the new flow)
    useOnlineGameStore.getState().setPendingDeck(deck);
    expect(useOnlineGameStore.getState().pendingDeck).toEqual(deck);

    // Create session and submit the pending deck
    const { sessionId, token: p0Token } = await createSession();
    const { token: p1Token } = await joinSession(sessionId);

    const p0 = await connectPlayer(sessionId, p0Token);
    const p1 = await connectPlayer(sessionId, p1Token);
    track(p0, p1);

    await p0.waitFor(
      (m) => m.type === ServerMessageType.SessionInfo && m.phase === SessionPhase.WaitingForDecks,
    );

    // Submit the pending deck (same flow as lobby screen)
    const storedDeck = useOnlineGameStore.getState().pendingDeck;
    if (!storedDeck) throw new Error('Expected pendingDeck to be set');
    p0.send({ type: 'submit_deck', deck: [...storedDeck] });
    p1.send({ type: 'submit_deck', deck: buildDeck(DECK_SIZE) });

    // Should get State (mulligan) — deck was accepted
    const stateMsg = await p0.waitFor(
      (m) => m.type === ServerMessageType.State && m.phase === SessionPhase.Mulligan,
    );
    expect(stateMsg.type).toBe(ServerMessageType.State);
  }, 15000);
});
