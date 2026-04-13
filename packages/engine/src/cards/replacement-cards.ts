import { CardId } from '../card-id.js';
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
  id: CardId.MantisChimera,
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
  id: CardId.TitanFrog,
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
  id: CardId.GreatHornedBeast,
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
  id: CardId.GoldenGriffin,
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
  id: CardId.WraithOfTartarus,
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
  id: CardId.HarmonyDuality,
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
  id: CardId.ChaoticShade,
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
  id: CardId.FrostReaver,
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
  id: CardId.ShadowArtemis,
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
  id: CardId.WarriorOfManyArms,
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
  id: CardId.ShadeCommander,
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
