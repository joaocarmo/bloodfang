import type { CardId as CardIdType } from '@bloodfang/engine';
import { type ClientMessage, ClientMessageType } from './protocol.js';

/**
 * Parse and validate a raw WebSocket message into a typed ClientMessage.
 * Returns null for malformed or unrecognized messages.
 */
export function parseClientMessage(raw: string): ClientMessage | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isObject(data) || typeof data['type'] !== 'string') {
    return null;
  }

  const type = data['type'] as ClientMessageType;
  switch (type) {
    case ClientMessageType.SubmitDeck:
      return parseSubmitDeck(data);
    case ClientMessageType.Mulligan:
      return parseMulligan(data);
    case ClientMessageType.PlayCard:
      return parsePlayCard(data);
    case ClientMessageType.Pass:
      return { type: ClientMessageType.Pass };
    case ClientMessageType.Ping:
      return { type: ClientMessageType.Ping };
    default:
      return null;
  }
}

function isCardId(value: unknown): value is CardIdType {
  return typeof value === 'string';
}

function parseSubmitDeck(data: Record<string, unknown>): ClientMessage | null {
  const deck = data['deck'];
  if (!Array.isArray(deck)) return null;
  if (!deck.every(isCardId)) return null;
  return { type: ClientMessageType.SubmitDeck, deck };
}

function parseMulligan(data: Record<string, unknown>): ClientMessage | null {
  const returnCardIds = data['returnCardIds'];
  if (!Array.isArray(returnCardIds)) return null;
  if (!returnCardIds.every(isCardId)) return null;
  return { type: ClientMessageType.Mulligan, returnCardIds };
}

function parsePlayCard(data: Record<string, unknown>): ClientMessage | null {
  const cardId = data['cardId'];
  if (!isCardId(cardId)) return null;

  const position = data['position'];
  if (!isObject(position)) return null;
  if (typeof position['row'] !== 'number' || typeof position['col'] !== 'number') return null;

  return {
    type: ClientMessageType.PlayCard,
    cardId,
    position: { row: position['row'], col: position['col'] },
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
