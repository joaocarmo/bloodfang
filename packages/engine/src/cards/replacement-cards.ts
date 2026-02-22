import type { CardDefinition } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const mantisChimera: CardDefinition = {
  id: 'mantis-chimera',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'self' } },
  },
};

export const titanFrog: CardDefinition = {
  id: 'titan-frog',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'self' } },
  },
};

export const greatHornedBeast: CardDefinition = {
  id: 'great-horned-beast',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'self' } },
  },
};

export const goldenGriffin: CardDefinition = {
  id: 'golden-griffin',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 0, target: { type: 'rangePattern' } },
  },
};

export const wraithOfTartarus: CardDefinition = {
  id: 'wraith-of-tartarus',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 0, target: { type: 'rangePattern' } },
  },
};

export const harmonyDuality: CardDefinition = {
  id: 'harmony-duality',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: 'ability' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 2, col: 0, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 0, target: { type: 'rangePattern' } },
  },
};

export const chaoticShade: CardDefinition = {
  id: 'chaotic-shade',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'ability' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 0, target: { type: 'rangePattern' } },
  },
};

export const frostReaver: CardDefinition = {
  id: 'frost-reaver',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -2, col: 1, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 0, target: { type: 'allInLane' } },
  },
};

export const shadowArtemis: CardDefinition = {
  id: 'shadow-artemis',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'both' },
    { row: 1, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 0, target: { type: 'rangePattern' } },
  },
};

export const warriorOfManyArms: CardDefinition = {
  id: 'warrior-of-many-arms',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: 2, type: 'ability' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 0, target: { type: 'rangePattern' } },
  },
};

export const shadeCommander: CardDefinition = {
  id: 'shade-commander',
  rank: 'replacement',
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 0, target: { type: 'rangePattern' } },
  },
};

const ALL_REPLACEMENT_CARDS: readonly CardDefinition[] = [
  mantisChimera,
  titanFrog,
  greatHornedBeast,
  goldenGriffin,
  wraithOfTartarus,
  harmonyDuality,
  chaoticShade,
  frostReaver,
  shadowArtemis,
  warriorOfManyArms,
  shadeCommander,
];

export function getReplacementDefinitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_REPLACEMENT_CARDS);
}
