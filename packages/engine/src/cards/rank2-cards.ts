import type { CardDefinition } from '../types.js';
import { ABILITY_TRIGGERS, EFFECT_TYPES, RANGE_CELL_TYPES, TARGET_SELECTORS } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const spartanSentinel: CardDefinition = {
  id: 'spartan-sentinel',
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
  id: 'fire-hurler',
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
  id: 'bronze-sweeper',
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
  id: 'venomous-asp',
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
  id: 'cave-sprite',
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
  id: 'war-elephant',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const featheredDrake: CardDefinition = {
  id: 'feathered-drake',
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
  id: 'roc-of-olympus',
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
  id: 'centaur-charger',
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
  id: 'cyclops-brute',
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
  id: 'zephyr-spirit',
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
  id: 'psyche-leech',
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
  id: 'nautilus-guardian',
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
  id: 'royal-spear',
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
  id: 'king-of-shades',
  rank: 2,
  power: 1,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ALLIED_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 2, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const petrifyingRooster: CardDefinition = {
  id: 'petrifying-rooster',
  rank: 2,
  power: 3,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.RANGE_PATTERN } },
  },
};

export const volcanicImp: CardDefinition = {
  id: 'volcanic-imp',
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
  id: 'minotaur-thug',
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
  id: 'desert-naga',
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
  id: 'triple-chimera',
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
  id: 'hermes-trickster',
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
  id: 'iron-giant',
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
  id: 'chaos-wyvern',
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
  id: 'cave-lurker',
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
  id: 'janus-mask',
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
  id: 'phantom-vulture',
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
  id: 'gorgo-serpent',
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
  id: 'minos-judge',
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
  id: 'iron-myrmidon',
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
  id: 'nemean-guardian',
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
  id: 'achilles-reborn',
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
  id: 'oracle-of-delphi',
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
  id: 'boreas-queen',
  rank: 2,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.SPAWN_CARD,
      tokenDefinitionId: 'frost-crystal-minor',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const gaiaTitan: CardDefinition = {
  id: 'gaia-titan',
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
  id: 'ares-allfather',
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
  id: 'sprite-trio',
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
      tokenDefinitionId: 'sprite-mage',
      count: 1,
      additionalTokens: [{ tokenDefinitionId: 'sprite-bard', count: 1 }],
    },
  },
};

export const frogHunter: CardDefinition = {
  id: 'frog-hunter',
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
  id: 'tyrant-and-beast',
  rank: 2,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ADD_CARD_TO_HAND,
      tokenDefinitionId: 'thorny-imp',
      count: 1,
      additionalTokens: [{ tokenDefinitionId: 'little-shade', count: 1 }],
    },
  },
};

export const goldenTyrant: CardDefinition = {
  id: 'golden-tyrant',
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
  id: 'war-rider',
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
  id: 'gryphon-rider',
  rank: 2,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN }],
  ability: {
    trigger: ABILITY_TRIGGERS.END_OF_GAME,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 10, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const festivalGuard: CardDefinition = {
  id: 'festival-guard',
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
  id: 'circe-enchantress',
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
