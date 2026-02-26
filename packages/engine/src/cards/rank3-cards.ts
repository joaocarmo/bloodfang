import type { CardDefinition } from '../types.js';
import { ABILITY_TRIGGERS, EFFECT_TYPES, RANGE_CELL_TYPES, TARGET_SELECTORS } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const harpyScreamer: CardDefinition = {
  id: 'harpy-screamer',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const warChariot: CardDefinition = {
  id: 'war-chariot',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
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

export const thalassicFiend: CardDefinition = {
  id: 'thalassic-fiend',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ALLIED_PLAYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const serpentOfLerna: CardDefinition = {
  id: 'serpent-of-lerna',
  rank: 3,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ENEMY_PLAYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const earthenWyrm: CardDefinition = {
  id: 'earthen-wyrm',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ENEMY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 2, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const cursedStag: CardDefinition = {
  id: 'cursed-stag',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.END_OF_GAME,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 10, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const toxicHydra: CardDefinition = {
  id: 'toxic-hydra',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 6,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const motherNymph: CardDefinition = {
  id: 'mother-nymph',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.ADD_CARD_TO_HAND, tokenDefinitionId: 'junior-nymph', count: 1 },
  },
};

export const stoneBasilisk: CardDefinition = {
  id: 'stone-basilisk',
  rank: 3,
  power: 2,
  rangePattern: [
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.RANGE_PATTERN } },
  },
};

export const elderDrakon: CardDefinition = {
  id: 'elder-drakon',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const bronzeFortress: CardDefinition = {
  id: 'bronze-fortress',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.ALL_ENEMY_ENHANCED },
    },
  },
};

export const ancientAdamantine: CardDefinition = {
  id: 'ancient-adamantine',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.POSITION_RANK_MANIP,
      bonusPawns: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const atlasGunner: CardDefinition = {
  id: 'atlas-gunner',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 8,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const pyriphlegethon: CardDefinition = {
  id: 'pyriphlegethon',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 2,
      target: { type: TARGET_SELECTORS.ALL_ALLIED_ENHANCED },
    },
  },
};

export const zeusThunderlord: CardDefinition = {
  id: 'zeus-thunderlord',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.BOTH },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.BOTH },
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

export const taurusPrimeval: CardDefinition = {
  id: 'taurus-primeval',
  rank: 3,
  power: 6,
  rangePattern: [
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 5,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const eternalPhoenix: CardDefinition = {
  id: 'eternal-phoenix',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 5,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const oceanLeviathan: CardDefinition = {
  id: 'ocean-leviathan',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const divineColossus: CardDefinition = {
  id: 'divine-colossus',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.ALL_ALLIED_ENFEEBLED },
    },
  },
};

export const kingOfDragons: CardDefinition = {
  id: 'king-of-dragons',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 5,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const drakonAscendant: CardDefinition = {
  id: 'drakon-ascendant',
  rank: 3,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.SPAWN_CARD,
      tokenDefinitionId: 'elemental-spark',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const plumpGryphon: CardDefinition = {
  id: 'plump-gryphon',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -2, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const pandorasJar: CardDefinition = {
  id: 'pandoras-jar',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.ABILITY },
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

export const aegisKeeper: CardDefinition = {
  id: 'aegis-keeper',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 6,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const worldSerpent: CardDefinition = {
  id: 'world-serpent',
  rank: 3,
  power: 6,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_ANY_DESTROYED,
    effect: { type: EFFECT_TYPES.ENHANCE, value: 1, target: { type: TARGET_SELECTORS.SELF } },
  },
};

export const orichalcumGolem: CardDefinition = {
  id: 'orichalcum-golem',
  rank: 3,
  power: 8,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const krakenTerror: CardDefinition = {
  id: 'kraken-terror',
  rank: 3,
  power: 2,
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
  ability: {
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 1,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const tentacleHorror: CardDefinition = {
  id: 'tentacle-horror',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: -1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -2, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: 2, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENHANCED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const wingedFury: CardDefinition = {
  id: 'winged-fury',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const grandCockatrice: CardDefinition = {
  id: 'grand-cockatrice',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.RANGE_PATTERN } },
  },
};

export const tragicHero: CardDefinition = {
  id: 'tragic-hero',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 2, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 2, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 5,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const labyrinthExperiment: CardDefinition = {
  id: 'labyrinth-experiment',
  rank: 3,
  power: 6,
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
    trigger: ABILITY_TRIGGERS.WHILE_IN_PLAY,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const crimsonChariot: CardDefinition = {
  id: 'crimson-chariot',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_FIRST_ENFEEBLED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 5,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const forgottenChimera: CardDefinition = {
  id: 'forgotten-chimera',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.ABILITY },
    { row: 2, col: -1, type: RANGE_CELL_TYPES.ABILITY },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const scarletDrakon: CardDefinition = {
  id: 'scarlet-drakon',
  rank: 3,
  power: 6,
  rangePattern: [
    { row: -2, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 2, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 2, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 4,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const gatesOfErebus: CardDefinition = {
  id: 'gates-of-erebus',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: -1, type: RANGE_CELL_TYPES.BOTH },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_DESTROYED,
    effect: {
      type: EFFECT_TYPES.ENFEEBLE,
      value: 9,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const sacredBand: CardDefinition = {
  id: 'sacred-band',
  rank: 3,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.SPAWN_CARD,
      tokenDefinitionId: 'zealot-initiate',
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const wheelOfFortune: CardDefinition = {
  id: 'wheel-of-fortune',
  rank: 3,
  power: 2,
  rangePattern: [
    { row: -2, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: -2, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: -2, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 2, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: -2, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 2, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 2, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const arenaMaster: CardDefinition = {
  id: 'arena-master',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 1,
      target: { type: TARGET_SELECTORS.ALL_ENHANCED },
    },
  },
};

export const fallenSeraph: CardDefinition = {
  id: 'fallen-seraph',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.BOTH },
    { row: 0, col: -1, type: RANGE_CELL_TYPES.PAWN },
    { row: 0, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.BOTH },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: { type: EFFECT_TYPES.DESTROY, target: { type: TARGET_SELECTORS.RANGE_PATTERN } },
  },
};

export const nyxSovereign: CardDefinition = {
  id: 'nyx-sovereign',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: -1, col: 1, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 1, type: RANGE_CELL_TYPES.PAWN },
  ],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.ENHANCE,
      value: 3,
      target: { type: TARGET_SELECTORS.ALL_ENFEEBLED },
    },
  },
};

const ALL_RANK3_CARDS: readonly CardDefinition[] = [
  harpyScreamer,
  warChariot,
  thalassicFiend,
  serpentOfLerna,
  earthenWyrm,
  cursedStag,
  toxicHydra,
  motherNymph,
  stoneBasilisk,
  elderDrakon,
  bronzeFortress,
  ancientAdamantine,
  atlasGunner,
  pyriphlegethon,
  zeusThunderlord,
  taurusPrimeval,
  eternalPhoenix,
  oceanLeviathan,
  divineColossus,
  kingOfDragons,
  drakonAscendant,
  plumpGryphon,
  pandorasJar,
  aegisKeeper,
  worldSerpent,
  orichalcumGolem,
  krakenTerror,
  tentacleHorror,
  wingedFury,
  grandCockatrice,
  tragicHero,
  labyrinthExperiment,
  crimsonChariot,
  forgottenChimera,
  scarletDrakon,
  gatesOfErebus,
  sacredBand,
  wheelOfFortune,
  arenaMaster,
  fallenSeraph,
  nyxSovereign,
];

export function getRank3Definitions(): Record<string, CardDefinition> {
  return cardsToDefinitionMap(ALL_RANK3_CARDS);
}
