import { describe, expect, it } from 'vitest';
import { ClientMessageType } from './protocol.js';
import { parseClientMessage } from './validation.js';

describe('parseClientMessage', () => {
  it('parses submit_deck message', () => {
    const raw = JSON.stringify({ type: 'submit_deck', deck: ['achilles-reborn', 'aegis-keeper'] });
    const msg = parseClientMessage(raw);
    expect(msg).toEqual({
      type: ClientMessageType.SubmitDeck,
      deck: ['achilles-reborn', 'aegis-keeper'],
    });
  });

  it('parses mulligan message', () => {
    const raw = JSON.stringify({ type: 'mulligan', returnCardIds: ['achilles-reborn'] });
    const msg = parseClientMessage(raw);
    expect(msg).toEqual({
      type: ClientMessageType.Mulligan,
      returnCardIds: ['achilles-reborn'],
    });
  });

  it('parses play_card message', () => {
    const raw = JSON.stringify({
      type: 'play_card',
      cardId: 'achilles-reborn',
      position: { row: 0, col: 0 },
    });
    const msg = parseClientMessage(raw);
    expect(msg).toEqual({
      type: ClientMessageType.PlayCard,
      cardId: 'achilles-reborn',
      position: { row: 0, col: 0 },
    });
  });

  it('parses pass message', () => {
    const msg = parseClientMessage(JSON.stringify({ type: 'pass' }));
    expect(msg).toEqual({ type: ClientMessageType.Pass });
  });

  it('parses ping message', () => {
    const msg = parseClientMessage(JSON.stringify({ type: 'ping' }));
    expect(msg).toEqual({ type: ClientMessageType.Ping });
  });

  it('returns null for malformed JSON', () => {
    expect(parseClientMessage('not json')).toBeNull();
  });

  it('returns null for missing type field', () => {
    expect(parseClientMessage(JSON.stringify({ foo: 'bar' }))).toBeNull();
  });

  it('returns null for unknown message type', () => {
    expect(parseClientMessage(JSON.stringify({ type: 'unknown' }))).toBeNull();
  });

  it('returns null for submit_deck with non-array deck', () => {
    expect(
      parseClientMessage(JSON.stringify({ type: 'submit_deck', deck: 'not-an-array' })),
    ).toBeNull();
  });

  it('returns null for submit_deck with non-string card IDs', () => {
    expect(parseClientMessage(JSON.stringify({ type: 'submit_deck', deck: [123] }))).toBeNull();
  });

  it('returns null for play_card with missing position', () => {
    expect(
      parseClientMessage(JSON.stringify({ type: 'play_card', cardId: 'achilles-reborn' })),
    ).toBeNull();
  });

  it('returns null for play_card with invalid position', () => {
    expect(
      parseClientMessage(
        JSON.stringify({
          type: 'play_card',
          cardId: 'achilles-reborn',
          position: { row: 'a', col: 0 },
        }),
      ),
    ).toBeNull();
  });

  it('returns null for non-object input', () => {
    expect(parseClientMessage(JSON.stringify(42))).toBeNull();
    expect(parseClientMessage(JSON.stringify(null))).toBeNull();
    expect(parseClientMessage(JSON.stringify([1, 2]))).toBeNull();
  });
});
