import { CardId } from '../card-id.js';
import type { CardDefinition } from '../types.js';
import { ABILITY_TRIGGERS, EFFECT_TYPES, RANGE_CELL_TYPES, TARGET_SELECTORS } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const harpyScreamer: CardDefinition = {
  id: CardId.HarpyScreamer,
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
  id: CardId.WarChariot,
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
  id: CardId.ThalassicFiend,
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
  id: CardId.SerpentOfLerna,
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
  id: CardId.EarthenWyrm,
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
  id: CardId.CursedStag,
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
  id: CardId.ToxicHydra,
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
  id: CardId.MotherNymph,
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
    effect: {
      type: EFFECT_TYPES.ADD_CARD_TO_HAND,
      tokenDefinitionId: CardId.JuniorNymph,
      count: 1,
    },
  },
};

export const stoneBasilisk: CardDefinition = {
  id: CardId.StoneBasilisk,
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
  id: CardId.ElderDrakon,
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
  id: CardId.BronzeFortress,
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
  id: CardId.AncientAdamantine,
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
  id: CardId.AtlasGunner,
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
  id: CardId.Pyriphlegethon,
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
  id: CardId.ZeusThunderlord,
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
  id: CardId.TaurusPrimeval,
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
  id: CardId.EternalPhoenix,
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
  id: CardId.OceanLeviathan,
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
  id: CardId.DivineColossus,
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
  id: CardId.KingOfDragons,
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
  id: CardId.DrakonAscendant,
  rank: 3,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.SPAWN_CARD,
      tokenDefinitionId: CardId.ElementalSpark,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const plumpGryphon: CardDefinition = {
  id: CardId.PlumpGryphon,
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
  id: CardId.PandorasJar,
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
  id: CardId.AegisKeeper,
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
  id: CardId.WorldSerpent,
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
  id: CardId.OrichalcumGolem,
  rank: 3,
  power: 8,
  rangePattern: [
    { row: -1, col: 0, type: RANGE_CELL_TYPES.PAWN },
    { row: 1, col: 0, type: RANGE_CELL_TYPES.PAWN },
  ],
};

export const krakenTerror: CardDefinition = {
  id: CardId.KrakenTerror,
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
  id: CardId.TentacleHorror,
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
  id: CardId.WingedFury,
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
  id: CardId.GrandCockatrice,
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
  id: CardId.TragicHero,
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
  id: CardId.LabyrinthExperiment,
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
  id: CardId.CrimsonChariot,
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
  id: CardId.ForgottenChimera,
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
  id: CardId.ScarletDrakon,
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
  id: CardId.GatesOfErebus,
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
  id: CardId.SacredBand,
  rank: 3,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: ABILITY_TRIGGERS.WHEN_PLAYED,
    effect: {
      type: EFFECT_TYPES.SPAWN_CARD,
      tokenDefinitionId: CardId.ZealotInitiate,
      target: { type: TARGET_SELECTORS.RANGE_PATTERN },
    },
  },
};

export const wheelOfFortune: CardDefinition = {
  id: CardId.WheelOfFortune,
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
  id: CardId.ArenaMaster,
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
  id: CardId.FallenSeraph,
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
  id: CardId.NyxSovereign,
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
