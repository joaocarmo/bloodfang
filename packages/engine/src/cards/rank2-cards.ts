import type { CardDefinition } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const spartanSentinel: CardDefinition = {
  id: 'spartan-sentinel',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
  ],
};

export const fireHurler: CardDefinition = {
  id: 'fire-hurler',
  rank: 2,
  power: 1,
  rangePattern: [{ row: 0, col: 2, type: 'ability' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const bronzeSweeper: CardDefinition = {
  id: 'bronze-sweeper',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
};

export const venomousAsp: CardDefinition = {
  id: 'venomous-asp',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 0, target: { type: 'rangePattern' } },
  },
};

export const caveSprite: CardDefinition = {
  id: 'cave-sprite',
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 1, target: { type: 'rangePattern' } },
  },
};

export const warElephant: CardDefinition = {
  id: 'war-elephant',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
};

export const featheredDrake: CardDefinition = {
  id: 'feathered-drake',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
  ],
};

export const rocOfOlympus: CardDefinition = {
  id: 'roc-of-olympus',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
};

export const centaurCharger: CardDefinition = {
  id: 'centaur-charger',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -1, col: -2, type: 'pawn' },
    { row: 0, col: -2, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 1, col: -2, type: 'pawn' },
  ],
};

export const cyclopsBrute: CardDefinition = {
  id: 'cyclops-brute',
  rank: 2,
  power: 5,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -2, col: 1, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
};

export const zephyrSpirit: CardDefinition = {
  id: 'zephyr-spirit',
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const psycheLeech: CardDefinition = {
  id: 'psyche-leech',
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'both' },
    { row: 1, col: 0, type: 'both' },
    { row: 1, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const nautilusGuardian: CardDefinition = {
  id: 'nautilus-guardian',
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 4, target: { type: 'rangePattern' } },
  },
};

export const royalSpear: CardDefinition = {
  id: 'royal-spear',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'both' },
    { row: 2, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 2, target: { type: 'rangePattern' } },
  },
};

export const kingOfShades: CardDefinition = {
  id: 'king-of-shades',
  rank: 2,
  power: 1,
  rangePattern: [{ row: 0, col: 1, type: 'pawn' }],
  ability: {
    trigger: 'whenAlliedDestroyed',
    effect: { type: 'enhance', value: 2, target: { type: 'self' } },
  },
};

export const petrifyingRooster: CardDefinition = {
  id: 'petrifying-rooster',
  rank: 2,
  power: 3,
  rangePattern: [{ row: 0, col: 1, type: 'both' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'rangePattern' } },
  },
};

export const volcanicImp: CardDefinition = {
  id: 'volcanic-imp',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'both' },
    { row: 1, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const minotaurThug: CardDefinition = {
  id: 'minotaur-thug',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -2, col: 1, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
};

export const desertNaga: CardDefinition = {
  id: 'desert-naga',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: 'both' },
    { row: -2, col: 1, type: 'both' },
    { row: 2, col: 0, type: 'both' },
    { row: 2, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const tripleChimera: CardDefinition = {
  id: 'triple-chimera',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 2, target: { type: 'allEnemy' } },
  },
};

export const hermesTrickster: CardDefinition = {
  id: 'hermes-trickster',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -2, col: 1, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenAnyDestroyed',
    effect: { type: 'enhance', value: 1, target: { type: 'self' } },
  },
};

export const ironGiant: CardDefinition = {
  id: 'iron-giant',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'ability' },
    { row: 2, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enfeeble', value: 2, target: { type: 'rangePattern' } },
  },
};

export const chaosWyvern: CardDefinition = {
  id: 'chaos-wyvern',
  rank: 2,
  power: 6,
  rangePattern: [
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'both' },
    { row: 0, col: -1, type: 'ability' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const caveLurker: CardDefinition = {
  id: 'cave-lurker',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'both' },
    { row: 0, col: 1, type: 'ability' },
    { row: 1, col: 1, type: 'both' },
    { row: 2, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenFirstEnfeebled',
    effect: { type: 'enfeeble', value: 2, target: { type: 'rangePattern' } },
  },
};

export const janusMask: CardDefinition = {
  id: 'janus-mask',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: {
      type: 'dualTargetBuff',
      alliedValue: 4,
      enemyValue: -4,
      target: { type: 'rangePattern' },
    },
  },
};

export const phantomVulture: CardDefinition = {
  id: 'phantom-vulture',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 2, target: { type: 'allAllied' } },
  },
};

export const gorgoSerpent: CardDefinition = {
  id: 'gorgo-serpent',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'positionRankManip', bonusPawns: 2, target: { type: 'rangePattern' } },
  },
};

export const minosJudge: CardDefinition = {
  id: 'minos-judge',
  rank: 2,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: 'scaling',
    effect: {
      type: 'selfPowerScaling',
      condition: { type: 'alliedCardsOnBoard' },
      valuePerUnit: 2,
    },
  },
};

export const ironMyrmidon: CardDefinition = {
  id: 'iron-myrmidon',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 0, type: 'both' },
    { row: -2, col: 1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const nemeanGuardian: CardDefinition = {
  id: 'nemean-guardian',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 0, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enhance', value: 4, target: { type: 'rangePattern' } },
  },
};

export const achillesReborn: CardDefinition = {
  id: 'achilles-reborn',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'ability' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -1, type: 'ability' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'ability' },
    { row: 1, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPowerReachesN',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
    threshold: 7,
  },
};

export const oracleOfDelphi: CardDefinition = {
  id: 'oracle-of-delphi',
  rank: 2,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const boreasQueen: CardDefinition = {
  id: 'boreas-queen',
  rank: 2,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: 'whenPlayed',
    effect: {
      type: 'spawnCard',
      tokenDefinitionId: 'frost-crystal-minor',
      target: { type: 'rangePattern' },
    },
  },
};

export const gaiaTitan: CardDefinition = {
  id: 'gaia-titan',
  rank: 2,
  power: 5,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'positionRankManip', bonusPawns: 2, target: { type: 'rangePattern' } },
  },
};

export const aresAllfather: CardDefinition = {
  id: 'ares-allfather',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 2, target: { type: 'allEnemy' } },
  },
};

export const spriteTrio: CardDefinition = {
  id: 'sprite-trio',
  rank: 2,
  power: 1,
  rangePattern: [
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'sprite-mage', count: 1 },
  },
};

export const frogHunter: CardDefinition = {
  id: 'frog-hunter',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenEnemyDestroyed',
    effect: { type: 'enhance', value: 2, target: { type: 'self' } },
  },
};

export const tyrantAndBeast: CardDefinition = {
  id: 'tyrant-and-beast',
  rank: 2,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'thorny-imp', count: 1 },
  },
};

export const goldenTyrant: CardDefinition = {
  id: 'golden-tyrant',
  rank: 2,
  power: 4,
  rangePattern: [
    { row: -2, col: -1, type: 'pawn' },
    { row: -2, col: 1, type: 'pawn' },
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 1, type: 'pawn' },
    { row: 2, col: -1, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
};

export const warRider: CardDefinition = {
  id: 'war-rider',
  rank: 2,
  power: 5,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: 0, type: 'ability' },
    { row: -2, col: 2, type: 'ability' },
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'both' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -2, type: 'ability' },
    { row: 0, col: -1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 0, col: 2, type: 'ability' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'both' },
    { row: 1, col: 1, type: 'ability' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: 0, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const gryphonRider: CardDefinition = {
  id: 'gryphon-rider',
  rank: 2,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'pawn' }],
  ability: {
    trigger: 'endOfGame',
    effect: { type: 'enhance', value: 10, target: { type: 'self' } },
  },
};

export const festivalGuard: CardDefinition = {
  id: 'festival-guard',
  rank: 2,
  power: 3,
  rangePattern: [
    { row: -2, col: 1, type: 'pawn' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'pawn' },
  ],
};

export const circeEnchantress: CardDefinition = {
  id: 'circe-enchantress',
  rank: 2,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: 'ability' },
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -2, type: 'ability' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 0, col: 2, type: 'ability' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'ability' },
    { row: 2, col: 0, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
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
