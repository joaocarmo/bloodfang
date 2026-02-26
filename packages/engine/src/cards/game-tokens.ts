import type { CardDefinition } from '../types.js';
import { ABILITY_TRIGGERS, EFFECT_TYPES, RANGE_CELL_TYPES, TARGET_SELECTORS } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const nymphSprout: CardDefinition = {
  id: 'nymph-sprout',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  isToken: true,
};

export const battleSprite: CardDefinition = {
  id: 'battle-sprite',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  isToken: true,
};

export const spriteMage: CardDefinition = {
  id: 'sprite-mage',
  rank: 1,
  power: 2,
  rangePattern: [{ row: -2, col: 2, type: RANGE_CELL_TYPES.BOTH }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const spriteBard: CardDefinition = {
  id: 'sprite-bard',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const littleShade: CardDefinition = {
  id: 'little-shade',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH }],
  isToken: true,
};

export const juniorNymph: CardDefinition = {
  id: 'junior-nymph',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'baby-nymph', count: 1 },
  },
  isToken: true,
};

export const babyNymph: CardDefinition = {
  id: 'baby-nymph',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  isToken: true,
};

export const daedalusGlider: CardDefinition = {
  id: 'daedalus-glider',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  isToken: true,
};

export const lycaonBeast: CardDefinition = {
  id: 'lycaon-beast',
  rank: 1,
  power: 4,
  rangePattern: [
    { row: -2, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const heatFragment: CardDefinition = {
  id: 'heat-fragment',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  isToken: true,
};

export const reformedProtean: CardDefinition = {
  id: 'reformed-protean',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  isToken: true,
};

export const thornyImp: CardDefinition = {
  id: 'thorny-imp',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  isToken: true,
};

export const elementalSpark: CardDefinition = {
  id: 'elemental-spark',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const elementalFlame: CardDefinition = {
  id: 'elemental-flame',
  rank: 1,
  power: 4,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const elementalStorm: CardDefinition = {
  id: 'elemental-storm',
  rank: 1,
  power: 6,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 6,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const zealotInitiate: CardDefinition = {
  id: 'zealot-initiate',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const zealotWarrior: CardDefinition = {
  id: 'zealot-warrior',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const zealotChampion: CardDefinition = {
  id: 'zealot-champion',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
  isToken: true,
};

export const frostCrystalMinor: CardDefinition = {
  id: 'frost-crystal-minor',
  rank: 1,
  power: 2,
  rangePattern: [],
  isToken: true,
};

export const frostCrystalMajor: CardDefinition = {
  id: 'frost-crystal-major',
  rank: 1,
  power: 4,
  rangePattern: [],
  isToken: true,
};

export const frostCrystalGrand: CardDefinition = {
  id: 'frost-crystal-grand',
  rank: 1,
  power: 6,
  rangePattern: [],
  isToken: true,
};

const ALL_GAMETOKEN_CARDS: readonly CardDefinition[] = [
  nymphSprout,
  battleSprite,
  spriteMage,
  spriteBard,
  littleShade,
  juniorNymph,
  babyNymph,
  daedalusGlider,
  lycaonBeast,
  heatFragment,
  reformedProtean,
  thornyImp,
  elementalSpark,
  elementalFlame,
  elementalStorm,
  zealotInitiate,
  zealotWarrior,
  zealotChampion,
  frostCrystalMinor,
  frostCrystalMajor,
  frostCrystalGrand,
];

export function getGameTokenDefinitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_GAMETOKEN_CARDS);
}
