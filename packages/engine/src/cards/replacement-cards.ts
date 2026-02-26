import type { CardDefinition } from '../types.js';
import {
  ABILITY_TRIGGERS,
  CARD_RANKS,
  EFFECT_TYPES,
  RANGE_CELL_TYPES,
  TARGET_SELECTORS,
} from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const mantisChimera: CardDefinition = {
  id: 'mantis-chimera',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const titanFrog: CardDefinition = {
  id: 'titan-frog',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const greatHornedBeast: CardDefinition = {
  id: 'great-horned-beast',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const goldenGriffin: CardDefinition = {
  id: 'golden-griffin',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const wraithOfTartarus: CardDefinition = {
  id: 'wraith-of-tartarus',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const harmonyDuality: CardDefinition = {
  id: 'harmony-duality',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const chaoticShade: CardDefinition = {
  id: 'chaotic-shade',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const frostReaver: CardDefinition = {
  id: 'frost-reaver',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.ALL_ENFEEBLED },
    },
  },
};

export const shadowArtemis: CardDefinition = {
  id: 'shadow-artemis',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const warriorOfManyArms: CardDefinition = {
  id: 'warrior-of-many-arms',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const shadeCommander: CardDefinition = {
  id: 'shade-commander',
  rank: CARD_RANKS.REPLACEMENT,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 0,
      dynamicValue: 'replacedCardPower',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
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
