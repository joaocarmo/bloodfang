import type { CardDefinition } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const harpyScreamer: CardDefinition = {
  id: 'harpy-screamer',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
};

export const warChariot: CardDefinition = {
  id: 'war-chariot',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 3, target: { type: 'rangePattern' } },
  },
};

export const thalassicFiend: CardDefinition = {
  id: 'thalassic-fiend',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenAlliedPlayed',
    effect: { type: 'enhance', value: 1, target: { type: 'self' } },
  },
};

export const serpentOfLerna: CardDefinition = {
  id: 'serpent-of-lerna',
  rank: 3,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenEnemyPlayed',
    effect: { type: 'enhance', value: 1, target: { type: 'self' } },
  },
};

export const earthenWyrm: CardDefinition = {
  id: 'earthen-wyrm',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenEnemyDestroyed',
    effect: { type: 'enhance', value: 2, target: { type: 'self' } },
  },
};

export const cursedStag: CardDefinition = {
  id: 'cursed-stag',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: 1, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'endOfGame',
    effect: { type: 'enhance', value: 10, target: { type: 'self' } },
  },
};

export const toxicHydra: CardDefinition = {
  id: 'toxic-hydra',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -1, col: 1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 6, target: { type: 'rangePattern' } },
  },
};

export const motherNymph: CardDefinition = {
  id: 'mother-nymph',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'junior-nymph', count: 1 },
  },
};

export const stoneBasilisk: CardDefinition = {
  id: 'stone-basilisk',
  rank: 3,
  power: 2,
  rangePattern: [
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'rangePattern' } },
  },
};

export const elderDrakon: CardDefinition = {
  id: 'elder-drakon',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const bronzeFortress: CardDefinition = {
  id: 'bronze-fortress',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 3, target: { type: 'allEnemyEnhanced' } },
  },
};

export const ancientAdamantine: CardDefinition = {
  id: 'ancient-adamantine',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'positionRankManip', bonusPawns: 3, target: { type: 'rangePattern' } },
  },
};

export const atlasGunner: CardDefinition = {
  id: 'atlas-gunner',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 0, col: 2, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 8, target: { type: 'rangePattern' } },
  },
};

export const pyriphlegethon: CardDefinition = {
  id: 'pyriphlegethon',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 2, target: { type: 'allAlliedEnhanced' } },
  },
};

export const zeusThunderlord: CardDefinition = {
  id: 'zeus-thunderlord',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -2, col: -2, type: 'both' },
    { row: -2, col: 2, type: 'both' },
    { row: -1, col: -1, type: 'both' },
    { row: -1, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'both' },
    { row: 1, col: 1, type: 'both' },
    { row: 2, col: -2, type: 'both' },
    { row: 2, col: 2, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 3, target: { type: 'rangePattern' } },
  },
};

export const taurusPrimeval: CardDefinition = {
  id: 'taurus-primeval',
  rank: 3,
  power: 6,
  rangePattern: [
    { row: -1, col: 1, type: 'both' },
    { row: 0, col: -1, type: 'both' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enfeeble', value: 5, target: { type: 'rangePattern' } },
  },
};

export const eternalPhoenix: CardDefinition = {
  id: 'eternal-phoenix',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: -1, type: 'both' },
    { row: -1, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'both' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enhance', value: 5, target: { type: 'rangePattern' } },
  },
};

export const oceanLeviathan: CardDefinition = {
  id: 'ocean-leviathan',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: 0, type: 'both' },
    { row: -2, col: 2, type: 'ability' },
    { row: 0, col: -2, type: 'both' },
    { row: 0, col: 2, type: 'both' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: 0, type: 'both' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enfeeble', value: 3, target: { type: 'rangePattern' } },
  },
};

export const divineColossus: CardDefinition = {
  id: 'divine-colossus',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 3, target: { type: 'allAlliedEnfeebled' } },
  },
};

export const kingOfDragons: CardDefinition = {
  id: 'king-of-dragons',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'both' },
    { row: 0, col: 2, type: 'both' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 5, target: { type: 'rangePattern' } },
  },
};

export const drakonAscendant: CardDefinition = {
  id: 'drakon-ascendant',
  rank: 3,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: 'whenPlayed',
    effect: {
      type: 'spawnCard',
      tokenDefinitionId: 'elemental-spark',
      target: { type: 'rangePattern' },
    },
  },
};

export const plumpGryphon: CardDefinition = {
  id: 'plump-gryphon',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 0, col: -2, type: 'pawn' },
    { row: 0, col: 2, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
  ],
};

export const pandorasJar: CardDefinition = {
  id: 'pandoras-jar',
  rank: 3,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 1, type: 'ability' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const aegisKeeper: CardDefinition = {
  id: 'aegis-keeper',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: -1, type: 'ability' },
    { row: -2, col: 0, type: 'pawn' },
    { row: -2, col: 1, type: 'ability' },
    { row: -2, col: 2, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: -1, type: 'ability' },
    { row: 2, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whenFirstEnfeebled',
    effect: { type: 'enfeeble', value: 6, target: { type: 'rangePattern' } },
  },
};

export const worldSerpent: CardDefinition = {
  id: 'world-serpent',
  rank: 3,
  power: 6,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenAnyDestroyed',
    effect: { type: 'enhance', value: 1, target: { type: 'self' } },
  },
};

export const orichalcumGolem: CardDefinition = {
  id: 'orichalcum-golem',
  rank: 3,
  power: 8,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
};

export const krakenTerror: CardDefinition = {
  id: 'kraken-terror',
  rank: 3,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: 'both' },
    { row: -1, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'both' },
    { row: 0, col: -1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'both' },
    { row: 1, col: 0, type: 'both' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const tentacleHorror: CardDefinition = {
  id: 'tentacle-horror',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: 2, type: 'ability' },
    { row: -1, col: -2, type: 'ability' },
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: -1, col: 2, type: 'ability' },
    { row: 1, col: -2, type: 'ability' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
    { row: 1, col: 2, type: 'ability' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const wingedFury: CardDefinition = {
  id: 'winged-fury',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: -1, type: 'both' },
    { row: -1, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'both' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const grandCockatrice: CardDefinition = {
  id: 'grand-cockatrice',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -2, col: 1, type: 'both' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'rangePattern' } },
  },
};

export const tragicHero: CardDefinition = {
  id: 'tragic-hero',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: 1, type: 'both' },
    { row: -1, col: 2, type: 'both' },
    { row: 1, col: 2, type: 'both' },
    { row: 2, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 5, target: { type: 'rangePattern' } },
  },
};

export const labyrinthExperiment: CardDefinition = {
  id: 'labyrinth-experiment',
  rank: 3,
  power: 6,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: 0, type: 'ability' },
    { row: -2, col: 2, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -2, type: 'ability' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 0, col: 2, type: 'ability' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: 0, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const crimsonChariot: CardDefinition = {
  id: 'crimson-chariot',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 0, col: -1, type: 'ability' },
    { row: 0, col: 1, type: 'ability' },
    { row: 1, col: 0, type: 'both' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenFirstEnfeebled',
    effect: { type: 'enfeeble', value: 5, target: { type: 'rangePattern' } },
  },
};

export const forgottenChimera: CardDefinition = {
  id: 'forgotten-chimera',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -2, col: 1, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'ability' },
    { row: 2, col: -1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const scarletDrakon: CardDefinition = {
  id: 'scarlet-drakon',
  rank: 3,
  power: 6,
  rangePattern: [
    { row: -2, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'both' },
    { row: 0, col: 2, type: 'both' },
    { row: 1, col: 1, type: 'both' },
    { row: 2, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const gatesOfErebus: CardDefinition = {
  id: 'gates-of-erebus',
  rank: 3,
  power: 5,
  rangePattern: [
    { row: -1, col: -1, type: 'both' },
    { row: -1, col: 1, type: 'both' },
    { row: 0, col: -1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'both' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enfeeble', value: 9, target: { type: 'rangePattern' } },
  },
};

export const sacredBand: CardDefinition = {
  id: 'sacred-band',
  rank: 3,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: 'whenPlayed',
    effect: {
      type: 'spawnCard',
      tokenDefinitionId: 'zealot-initiate',
      target: { type: 'rangePattern' },
    },
  },
};

export const wheelOfFortune: CardDefinition = {
  id: 'wheel-of-fortune',
  rank: 3,
  power: 2,
  rangePattern: [
    { row: -2, col: -1, type: 'pawn' },
    { row: -2, col: 1, type: 'pawn' },
    { row: -1, col: -2, type: 'pawn' },
    { row: -1, col: 2, type: 'pawn' },
    { row: 1, col: -2, type: 'pawn' },
    { row: 1, col: 2, type: 'pawn' },
    { row: 2, col: -1, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
};

export const arenaMaster: CardDefinition = {
  id: 'arena-master',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 1, target: { type: 'allEnhanced' } },
  },
};

export const fallenSeraph: CardDefinition = {
  id: 'fallen-seraph',
  rank: 3,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'rangePattern' } },
  },
};

export const nyxSovereign: CardDefinition = {
  id: 'nyx-sovereign',
  rank: 3,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 3, target: { type: 'allEnfeebled' } },
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
