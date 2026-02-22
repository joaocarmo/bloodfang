import type { CardDefinition } from '../types.js';
import { getRank1Definitions } from './rank1-cards.js';
import { getRank2Definitions } from './rank2-cards.js';
import { getRank3Definitions } from './rank3-cards.js';
import { getReplacementDefinitions } from './replacement-cards.js';
import { getGameTokenDefinitions } from './game-tokens.js';

export function getAllGameDefinitions(): Record<string, CardDefinition> {
  return {
    ...getRank1Definitions(),
    ...getRank2Definitions(),
    ...getRank3Definitions(),
    ...getReplacementDefinitions(),
    ...getGameTokenDefinitions(),
  };
}
