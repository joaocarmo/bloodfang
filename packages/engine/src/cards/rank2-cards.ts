import { CardId } from '../card-id.js';
import type { CardDefinition } from '../types.js';
import { ABILITY_TRIGGERS, EFFECT_TYPES, RANGE_CELL_TYPES, TARGET_SELECTORS } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const spartanSentinel: CardDefinition = {
  id: CardId.SpartanSentinel,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const fireHurler: CardDefinition = {
  id: CardId.FireHurler,
  rank: 2,
  power: 1,
  rangePattern: [{ row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const bronzeSweeper: CardDefinition = {
  id: CardId.BronzeSweeper,
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const venomousAsp: CardDefinition = {
  id: CardId.VenomousAsp,
  rank: 2,
  power: 2,
  rangePattern: [
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 0,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const caveSprite: CardDefinition = {
  id: CardId.CaveSprite,
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const warElephant: CardDefinition = {
  id: CardId.WarElephant,
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const featheredDrake: CardDefinition = {
  id: CardId.FeatheredDrake,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const rocOfOlympus: CardDefinition = {
  id: CardId.RocOfOlympus,
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const centaurCharger: CardDefinition = {
  id: CardId.CentaurCharger,
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -1, col: -2, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -2, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const cyclopsBrute: CardDefinition = {
  id: CardId.CyclopsBrute,
  rank: 2,
  power: 5,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const zephyrSpirit: CardDefinition = {
  id: CardId.ZephyrSpirit,
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const psycheLeech: CardDefinition = {
  id: CardId.PsycheLeech,
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const nautilusGuardian: CardDefinition = {
  id: CardId.NautilusGuardian,
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const royalSpear: CardDefinition = {
  id: CardId.RoyalSpear,
  rank: 2,
  power: 2,
  rangePattern: [
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const kingOfShades: CardDefinition = {
  id: CardId.KingOfShades,
  rank: 2,
  power: 1,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ALLIED_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 2, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const petrifyingRooster: CardDefinition = {
  id: CardId.PetrifyingRooster,
  rank: 2,
  power: 3,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.RANGE_PATTERN } },
  },
};

export const volcanicImp: CardDefinition = {
  id: CardId.VolcanicImp,
  rank: 2,
  power: 2,
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
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const minotaurThug: CardDefinition = {
  id: CardId.MinotaurThug,
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const desertNaga: CardDefinition = {
  id: CardId.DesertNaga,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const tripleChimera: CardDefinition = {
  id: CardId.TripleChimera,
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.ALL_ENEMY_ENFEEBLED },
    },
  },
};

export const hermesTrickster: CardDefinition = {
  id: CardId.HermesTrickster,
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ANY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const ironGiant: CardDefinition = {
  id: CardId.IronGiant,
  rank: 2,
  power: 4,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const chaosWyvern: CardDefinition = {
  id: CardId.ChaosWyvern,
  rank: 2,
  power: 6,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const caveLurker: CardDefinition = {
  id: CardId.CaveLurker,
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const janusMask: CardDefinition = {
  id: CardId.JanusMask,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.DUAL_TARGET_BUFF,
      alliedValue: 4,
      enemyValue: -4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const phantomVulture: CardDefinition = {
  id: CardId.PhantomVulture,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.ALL_ALLIED_ENFEEBLED },
    },
  },
};

export const gorgoSerpent: CardDefinition = {
  id: CardId.GorgoSerpent,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.POSITION_RANK_MANIP,
      bonusPawns: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const minosJudge: CardDefinition = {
  id: CardId.MinosJudge,
  rank: 2,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.ALL_ENFEEBLED },
    },
  },
};

export const ironMyrmidon: CardDefinition = {
  id: CardId.IronMyrmidon,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const nemeanGuardian: CardDefinition = {
  id: CardId.NemeanGuardian,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const achillesReborn: CardDefinition = {
  id: CardId.AchillesReborn,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_POWER_REACHES_N,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
    threshold: 7,
  },
};

export const oracleOfDelphi: CardDefinition = {
  id: CardId.OracleOfDelphi,
  rank: 2,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const boreasQueen: CardDefinition = {
  id: CardId.BoreasQueen,
  rank: 2,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.SPAWN_CARD,
      tokenDefinitionId: CardId.FrostCrystalMinor,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const gaiaTitan: CardDefinition = {
  id: CardId.GaiaTitan,
  rank: 2,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.POSITION_RANK_MANIP,
      bonusPawns: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const aresAllfather: CardDefinition = {
  id: CardId.AresAllfather,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.ALL_ENEMY_ENHANCED },
    },
  },
};

export const spriteTrio: CardDefinition = {
  id: CardId.SpriteTrio,
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ADD_CARD_TO_HAND,
      tokenDefinitionId: CardId.SpriteMage,
      count: 1,
      additionalTokens: [{ tokenDefinitionId: CardId.SpriteBard, count: 1 }],
    },
  },
};

export const frogHunter: CardDefinition = {
  id: CardId.FrogHunter,
  rank: 2,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ENEMY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 2, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const tyrantAndBeast: CardDefinition = {
  id: CardId.TyrantAndBeast,
  rank: 2,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ADD_CARD_TO_HAND,
      tokenDefinitionId: CardId.ThornyImp,
      count: 1,
      additionalTokens: [{ tokenDefinitionId: CardId.LittleShade, count: 1 }],
    },
  },
};

export const goldenTyrant: CardDefinition = {
  id: CardId.GoldenTyrant,
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -2, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const warRider: CardDefinition = {
  id: CardId.WarRider,
  rank: 2,
  power: 5,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const gryphonRider: CardDefinition = {
  id: CardId.GryphonRider,
  rank: 2,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN }],
  ability: {
    trigger: ABILITY_TRIGGERS.END_OF_GAME,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 10, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const festivalGuard: CardDefinition = {
  id: CardId.FestivalGuard,
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const circeEnchantress: CardDefinition = {
  id: CardId.CirceEnchantress,
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
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
};

const ALL_RANK2_CARDS: readonly CardDefinition[] = [
  spartanSentinel,
  fireHurler,
  bronzeSweeper,
  venomousAsp,
  caveSprite,
  warElephant,
  featheredDrake,
  rocOfOlympus,
  centaurCharger,
  cyclopsBrute,
  zephyrSpirit,
  psycheLeech,
  nautilusGuardian,
  royalSpear,
  kingOfShades,
  petrifyingRooster,
  volcanicImp,
  minotaurThug,
  desertNaga,
  tripleChimera,
  hermesTrickster,
  ironGiant,
  chaosWyvern,
  caveLurker,
  janusMask,
  phantomVulture,
  gorgoSerpent,
  minosJudge,
  ironMyrmidon,
  nemeanGuardian,
  achillesReborn,
  oracleOfDelphi,
  boreasQueen,
  gaiaTitan,
  aresAllfather,
  spriteTrio,
  frogHunter,
  tyrantAndBeast,
  goldenTyrant,
  warRider,
  gryphonRider,
  festivalGuard,
  circeEnchantress,
];

export function getRank2Definitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_RANK2_CARDS);
}
