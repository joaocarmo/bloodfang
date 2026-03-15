import type { SessionId, PlayerToken } from '@bloodfang/server/protocol';

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001';

export function getServerUrl(): string {
  return SERVER_URL;
}

export function getWsUrl(): string {
  return SERVER_URL.replace(/^http/, 'ws');
}

export async function createSession(): Promise<{ sessionId: SessionId; token: PlayerToken }> {
  const res = await fetch(`${SERVER_URL}/api/sessions`, { method: 'POST' });
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    throw new Error(body.error ?? `Failed to create session (${String(res.status)})`);
  }
  return res.json() as Promise<{ sessionId: SessionId; token: PlayerToken }>;
}

export async function joinSession(sessionId: string): Promise<{ token: PlayerToken }> {
  const res = await fetch(`${SERVER_URL}/api/sessions/${sessionId}/join`, { method: 'POST' });
  if (!res.ok) {
    const body = (await res.json()) as { error?: string };
    throw new Error(body.error ?? `Failed to join session (${String(res.status)})`);
  }
  return res.json() as Promise<{ token: PlayerToken }>;
}
