import type { ClientMessage, ServerMessage } from '@bloodfang/server/protocol';
import { ClientMessageType } from '@bloodfang/server/protocol';
import { useCallback, useEffect } from 'react';
import { getWsUrl } from '../lib/server-client.ts';
import { type ConnectionStatus, useOnlineGameStore } from '../store/online-game-store.ts';

const MAX_RETRIES = 5;
const PING_INTERVAL_MS = 30_000;

// Module-level refs so the WebSocket persists across component mounts/unmounts
let ws: WebSocket | null = null;
let retries = 0;
let retryTimeout: ReturnType<typeof setTimeout> | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
let activeSessionId: string | null = null;
let activeToken: string | null = null;

function sendMsg(msg: ClientMessage): void {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function connectWs(sessionId: string, token: string): void {
  // Don't reconnect if already connected to the same session
  if (ws && activeSessionId === sessionId && activeToken === token) {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      return;
    }
  }

  // Clean up any existing connection
  cleanupWs();

  activeSessionId = sessionId;
  activeToken = token;

  const url = `${getWsUrl()}/api/sessions/${sessionId}/ws?token=${token}`;
  const newWs = new WebSocket(url);
  ws = newWs;
  useOnlineGameStore.getState().setConnectionStatus('connecting');

  newWs.addEventListener('open', () => {
    retries = 0;
    useOnlineGameStore.getState().setConnectionStatus('connected');
    useOnlineGameStore.getState().setSend(sendMsg);

    pingInterval = setInterval(() => {
      if (newWs.readyState === WebSocket.OPEN) {
        newWs.send(JSON.stringify({ type: ClientMessageType.Ping }));
      }
    }, PING_INTERVAL_MS);
  });

  newWs.addEventListener('message', (event) => {
    if (typeof event.data !== 'string') return;
    try {
      const msg = JSON.parse(event.data) as ServerMessage;
      useOnlineGameStore.getState().handleServerMessage(msg);
    } catch {
      // Ignore malformed messages
    }
  });

  newWs.addEventListener('close', () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    useOnlineGameStore.getState().setSend(null);
    ws = null;

    // Attempt reconnect with exponential backoff
    if (retries < MAX_RETRIES && activeSessionId && activeToken) {
      const delay = Math.min(1000 * 2 ** retries, 16_000);
      retries++;
      useOnlineGameStore.getState().setConnectionStatus('connecting');
      retryTimeout = setTimeout(() => {
        if (activeSessionId && activeToken) {
          connectWs(activeSessionId, activeToken);
        }
      }, delay);
    } else {
      useOnlineGameStore.getState().setConnectionStatus('disconnected');
    }
  });

  newWs.addEventListener('error', () => {
    // The close handler will fire after error, which handles reconnection
  });
}

function cleanupWs(): void {
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (ws) {
    ws.close();
    ws = null;
  }
}

export function disconnectWs(): void {
  activeSessionId = null;
  activeToken = null;
  retries = MAX_RETRIES; // Prevent reconnection
  cleanupWs();
  useOnlineGameStore.getState().setConnectionStatus('disconnected');
  useOnlineGameStore.getState().setSend(null);
}

/**
 * Hook that ensures a WebSocket connection is active for the given session.
 * The actual connection is module-level so it persists across route changes.
 * Only disconnects when explicitly called via disconnectWs() or store reset.
 */
export function useWebSocket(
  sessionId: string | null,
  token: string | null,
): {
  status: ConnectionStatus;
  send: (msg: ClientMessage) => void;
  disconnect: () => void;
} {
  const status = useOnlineGameStore((s) => s.connectionStatus);

  useEffect(() => {
    if (sessionId && token) {
      connectWs(sessionId, token);
    }
  }, [sessionId, token]);

  const disconnect = useCallback(() => {
    disconnectWs();
  }, []);

  return { status, send: sendMsg, disconnect };
}
