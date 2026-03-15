import { useEffect, useRef, useCallback } from 'react';
import type { ClientMessage, ServerMessage } from '@bloodfang/server/protocol';
import { ClientMessageType } from '@bloodfang/server/protocol';
import { useOnlineGameStore, type ConnectionStatus } from '../store/online-game-store.ts';
import { getWsUrl } from '../lib/server-client.ts';

const MAX_RETRIES = 5;
const PING_INTERVAL_MS = 30_000;

export function useWebSocket(
  sessionId: string | null,
  token: string | null,
): {
  status: ConnectionStatus;
  send: (msg: ClientMessage) => void;
  disconnect: () => void;
} {
  const wsRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const status = useOnlineGameStore((s) => s.connectionStatus);

  const send = useCallback((msg: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    useOnlineGameStore.getState().setConnectionStatus('disconnected');
    useOnlineGameStore.getState().setSend(null);
  }, []);

  useEffect(() => {
    if (!sessionId || !token) return;

    function connect() {
      if (!sessionId || !token) return;
      const url = `${getWsUrl()}/api/sessions/${sessionId}/ws?token=${token}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;
      useOnlineGameStore.getState().setConnectionStatus('connecting');

      ws.addEventListener('open', () => {
        retriesRef.current = 0;
        useOnlineGameStore.getState().setConnectionStatus('connected');
        useOnlineGameStore.getState().setSend(send);

        // Start keepalive ping
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: ClientMessageType.Ping }));
          }
        }, PING_INTERVAL_MS);
      });

      ws.addEventListener('message', (event) => {
        if (typeof event.data !== 'string') return;
        try {
          const msg = JSON.parse(event.data) as ServerMessage;
          useOnlineGameStore.getState().handleServerMessage(msg);
        } catch {
          // Ignore malformed messages
        }
      });

      ws.addEventListener('close', () => {
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        useOnlineGameStore.getState().setSend(null);

        // Attempt reconnect with exponential backoff
        if (retriesRef.current < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, retriesRef.current), 16_000);
          retriesRef.current++;
          useOnlineGameStore.getState().setConnectionStatus('connecting');
          retryTimeoutRef.current = setTimeout(connect, delay);
        } else {
          useOnlineGameStore.getState().setConnectionStatus('disconnected');
        }
      });

      ws.addEventListener('error', () => {
        // The close handler will fire after error, which handles reconnection
      });
    }

    connect();

    return () => {
      retriesRef.current = MAX_RETRIES; // Prevent reconnection during cleanup
      disconnect();
    };
  }, [sessionId, token, send, disconnect]);

  return { status, send, disconnect };
}
