import type { CardDefinition } from '../types.js';
import { ABILITY_TRIGGERS, EFFECT_TYPES, RANGE_CELL_TYPES, TARGET_SELECTORS } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const hopliteGuard: CardDefinition = {
  id: 'hoplite-guard',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const sirenQueen: CardDefinition = {
  id: 'siren-queen',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const swiftHare: CardDefinition = {
  id: 'swift-hare',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const arcadianWolf: CardDefinition = {
  id: 'arcadian-wolf',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const dryadSeedling: CardDefinition = {
  id: 'dryad-seedling',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'nymph-sprout', count: 1 },
  },
};

export const goldenBramble: CardDefinition = {
  id: 'golden-bramble',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
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

export const crystalKarkinos: CardDefinition = {
  id: 'crystal-karkinos',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
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

export const amorphousOoze: CardDefinition = {
  id: 'amorphous-ooze',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const myrmexCrawler: CardDefinition = {
  id: 'myrmex-crawler',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const ancientDrakon: CardDefinition = {
  id: 'ancient-drakon',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const chariotOfAres: CardDefinition = {
  id: 'chariot-of-ares',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const pegasusScout: CardDefinition = {
  id: 'pegasus-scout',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const emberSalamander: CardDefinition = {
  id: 'ember-salamander',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.BOTH },
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

export const copperAutomaton: CardDefinition = {
  id: 'copper-automaton',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
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

export const allSeeingEye: CardDefinition = {
  id: 'all-seeing-eye',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
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

export const pyroclastSoldier: CardDefinition = {
  id: 'pyroclast-soldier',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const athenasOwl: CardDefinition = {
  id: 'athenas-owl',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
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

export const sandGorgon: CardDefinition = {
  id: 'sand-gorgon',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const resilientPolyp: CardDefinition = {
  id: 'resilient-polyp',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
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

export const heatGolem: CardDefinition = {
  id: 'heat-golem',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'heat-fragment', count: 1 },
  },
};

export const stygianClaw: CardDefinition = {
  id: 'stygian-claw',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ENEMY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const twinSerpent: CardDefinition = {
  id: 'twin-serpent',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const narcissusTrap: CardDefinition = {
  id: 'narcissus-trap',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const proteanMass: CardDefinition = {
  id: 'protean-mass',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ADD_CARD_TO_HAND,
      tokenDefinitionId: 'reformed-protean',
      count: 1,
    },
  },
};

export const carrionHarpy: CardDefinition = {
  id: 'carrion-harpy',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ALLIED_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const scorpionOfArtemis: CardDefinition = {
  id: 'scorpion-of-artemis',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
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

export const desertTriton: CardDefinition = {
  id: 'desert-triton',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const marbleColossus: CardDefinition = {
  id: 'marble-colossus',
  rank: 1,
  power: 4,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const twinHeadedOracle: CardDefinition = {
  id: 'twin-headed-oracle',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
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

export const nyxWing: CardDefinition = {
  id: 'nyx-wing',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
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

export const cerberusHound: CardDefinition = {
  id: 'cerberus-hound',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const ghastlyShade: CardDefinition = {
  id: 'ghastly-shade',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.ALL_ENFEEBLED },
    },
  },
};

export const eliteMyrmidon: CardDefinition = {
  id: 'elite-myrmidon',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.BOTH },
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

export const hundredEyedArgus: CardDefinition = {
  id: 'hundred-eyed-argus',
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
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const phantomWraith: CardDefinition = {
  id: 'phantom-wraith',
  rank: 1,
  power: 1,
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
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const amazonStriker: CardDefinition = {
  id: 'amazon-striker',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.END_OF_GAME,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 5, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const flameOfPrometheus: CardDefinition = {
  id: 'flame-of-prometheus',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
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

export const fortuneSphinx: CardDefinition = {
  id: 'fortune-sphinx',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'battle-sprite', count: 1 },
  },
};

export const daedalusPilot: CardDefinition = {
  id: 'daedalus-pilot',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'daedalus-glider', count: 1 },
  },
};

export const lycaonCursed: CardDefinition = {
  id: 'lycaon-cursed',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'lycaon-beast', count: 1 },
  },
};

export const gryphonAndSprite: CardDefinition = {
  id: 'gryphon-and-sprite',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.ALL_ALLIED_ENHANCED },
    },
  },
};

export const goldenGryphon: CardDefinition = {
  id: 'golden-gryphon',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.END_OF_GAME,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 3, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const swiftBlade: CardDefinition = {
  id: 'swift-blade',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 2,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const ironFist: CardDefinition = {
  id: 'iron-fist',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
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

export const silentDagger: CardDefinition = {
  id: 'silent-dagger',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH }],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 99,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const shadowCommander: CardDefinition = {
  id: 'shadow-commander',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
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

export const starVoyager: CardDefinition = {
  id: 'star-voyager',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.ALL_ENEMY_ENHANCED },
    },
  },
};

export const houseOfHades: CardDefinition = {
  id: 'house-of-hades',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 2, type: RANGE_CELL_TYPES.ABILITY },
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

export const tragicMuse: CardDefinition = {
  id: 'tragic-muse',
  rank: 1,
  power: 1,
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
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const dionysusReveler: CardDefinition = {
  id: 'dionysus-reveler',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.SCORE_REDISTRIBUTION },
  },
};

const ALL_RANK1_CARDS: readonly CardDefinition[] = [
  hopliteGuard,
  sirenQueen,
  swiftHare,
  arcadianWolf,
  dryadSeedling,
  goldenBramble,
  crystalKarkinos,
  amorphousOoze,
  myrmexCrawler,
  ancientDrakon,
  chariotOfAres,
  pegasusScout,
  emberSalamander,
  copperAutomaton,
  allSeeingEye,
  pyroclastSoldier,
  athenasOwl,
  sandGorgon,
  resilientPolyp,
  heatGolem,
  stygianClaw,
  twinSerpent,
  narcissusTrap,
  proteanMass,
  carrionHarpy,
  scorpionOfArtemis,
  desertTriton,
  marbleColossus,
  twinHeadedOracle,
  nyxWing,
  cerberusHound,
  ghastlyShade,
  eliteMyrmidon,
  hundredEyedArgus,
  phantomWraith,
  amazonStriker,
  flameOfPrometheus,
  fortuneSphinx,
  daedalusPilot,
  lycaonCursed,
  gryphonAndSprite,
  goldenGryphon,
  swiftBlade,
  ironFist,
  silentDagger,
  shadowCommander,
  starVoyager,
  houseOfHades,
  tragicMuse,
  dionysusReveler,
];

export function getRank1Definitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_RANK1_CARDS);
}
