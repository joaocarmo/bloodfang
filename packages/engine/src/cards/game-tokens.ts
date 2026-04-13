import { CardId } from '../card-id.js';
import type { CardDefinition } from '../types.js';
import { ABILITY_TRIGGERS, EFFECT_TYPES, RANGE_CELL_TYPES, TARGET_SELECTORS } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const nymphSprout: CardDefinition = {
  id: CardId.NymphSprout,
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  isToken: true,
};

export const battleSprite: CardDefinition = {
  id: CardId.BattleSprite,
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
  id: CardId.SpriteMage,
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
  id: CardId.SpriteBard,
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
  id: CardId.LittleShade,
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH }],
  isToken: true,
};

export const juniorNymph: CardDefinition = {
  id: CardId.JuniorNymph,
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
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: CardId.BabyNymph, count: 1 },
  },
  isToken: true,
};

export const babyNymph: CardDefinition = {
  id: CardId.BabyNymph,
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
  id: CardId.DaedalusGlider,
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
  id: CardId.LycaonBeast,
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
  id: CardId.HeatFragment,
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
  id: CardId.ReformedProtean,
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  isToken: true,
};

export const thornyImp: CardDefinition = {
  id: CardId.ThornyImp,
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
  id: CardId.ElementalSpark,
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
  id: CardId.ElementalFlame,
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
  id: CardId.ElementalStorm,
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
  id: CardId.ZealotInitiate,
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
  id: CardId.ZealotWarrior,
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
  id: CardId.ZealotChampion,
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
  id: CardId.FrostCrystalMinor,
  rank: 1,
  power: 2,
  rangePattern: [],
  isToken: true,
};

export const frostCrystalMajor: CardDefinition = {
  id: CardId.FrostCrystalMajor,
  rank: 1,
  power: 4,
  rangePattern: [],
  isToken: true,
};

export const frostCrystalGrand: CardDefinition = {
  id: CardId.FrostCrystalGrand,
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
