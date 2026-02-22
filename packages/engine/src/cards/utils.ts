import type { CardDefinition } from '../types.js';

export function cardsToDefinitionMap(
  cards: readonly CardDefinition[],
): Record<string, CardDefinition> {
  const defs: Record<string, CardDefinition> = {};
  for (const card of cards) {
    defs[card.id] = card;
  }
  return defs;
}
