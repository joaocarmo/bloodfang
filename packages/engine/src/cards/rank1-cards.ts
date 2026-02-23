import type { CardDefinition } from '../types.js';
import { cardsToDefinitionMap } from './utils.js';

export const hopliteGuard: CardDefinition = {
  id: 'hoplite-guard',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
};

export const sirenQueen: CardDefinition = {
  id: 'siren-queen',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
  ],
};

export const swiftHare: CardDefinition = {
  id: 'swift-hare',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
};

export const arcadianWolf: CardDefinition = {
  id: 'arcadian-wolf',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
};

export const dryadSeedling: CardDefinition = {
  id: 'dryad-seedling',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'nymph-sprout', count: 1 },
  },
};

export const goldenBramble: CardDefinition = {
  id: 'golden-bramble',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const crystalKarkinos: CardDefinition = {
  id: 'crystal-karkinos',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const amorphousOoze: CardDefinition = {
  id: 'amorphous-ooze',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
  ],
};

export const myrmexCrawler: CardDefinition = {
  id: 'myrmex-crawler',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
};

export const ancientDrakon: CardDefinition = {
  id: 'ancient-drakon',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: -1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 3, target: { type: 'rangePattern' } },
  },
};

export const chariotOfAres: CardDefinition = {
  id: 'chariot-of-ares',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 2, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 3, target: { type: 'rangePattern' } },
  },
};

export const pegasusScout: CardDefinition = {
  id: 'pegasus-scout',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -2, col: -2, type: 'pawn' },
    { row: -1, col: -1, type: 'pawn' },
    { row: 1, col: -1, type: 'pawn' },
    { row: 2, col: -2, type: 'pawn' },
  ],
};

export const emberSalamander: CardDefinition = {
  id: 'ember-salamander',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: 'both' },
    { row: 2, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const copperAutomaton: CardDefinition = {
  id: 'copper-automaton',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const allSeeingEye: CardDefinition = {
  id: 'all-seeing-eye',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -1, col: 0, type: 'ability' },
    { row: 1, col: 0, type: 'ability' },
    { row: 2, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 1, target: { type: 'rangePattern' } },
  },
};

export const pyroclastSoldier: CardDefinition = {
  id: 'pyroclast-soldier',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -1, col: -1, type: 'both' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'both' },
    { row: 1, col: -1, type: 'both' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enfeeble', value: 3, target: { type: 'rangePattern' } },
  },
};

export const athenasOwl: CardDefinition = {
  id: 'athenas-owl',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const sandGorgon: CardDefinition = {
  id: 'sand-gorgon',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 0, col: 1, type: 'both' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const resilientPolyp: CardDefinition = {
  id: 'resilient-polyp',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 0, col: 2, type: 'ability' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const heatGolem: CardDefinition = {
  id: 'heat-golem',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'heat-fragment', count: 1 },
  },
};

export const stygianClaw: CardDefinition = {
  id: 'stygian-claw',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenEnemyDestroyed',
    effect: { type: 'enhance', value: 1, target: { type: 'self' } },
  },
};

export const twinSerpent: CardDefinition = {
  id: 'twin-serpent',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: 'both' },
    { row: -1, col: 0, type: 'ability' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const narcissusTrap: CardDefinition = {
  id: 'narcissus-trap',
  rank: 1,
  power: 1,
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
    trigger: 'whenDestroyed',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const proteanMass: CardDefinition = {
  id: 'protean-mass',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'reformed-protean', count: 1 },
  },
};

export const carrionHarpy: CardDefinition = {
  id: 'carrion-harpy',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenAlliedDestroyed',
    effect: { type: 'enhance', value: 1, target: { type: 'self' } },
  },
};

export const scorpionOfArtemis: CardDefinition = {
  id: 'scorpion-of-artemis',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -2, col: 1, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenFirstEnfeebled',
    effect: { type: 'enfeeble', value: 2, target: { type: 'rangePattern' } },
  },
};

export const desertTriton: CardDefinition = {
  id: 'desert-triton',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenFirstEnfeebled',
    effect: { type: 'enhance', value: 4, target: { type: 'rangePattern' } },
  },
};

export const marbleColossus: CardDefinition = {
  id: 'marble-colossus',
  rank: 1,
  power: 4,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enfeeble', value: 4, target: { type: 'rangePattern' } },
  },
};

export const twinHeadedOracle: CardDefinition = {
  id: 'twin-headed-oracle',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'positionRankManip', bonusPawns: 2, target: { type: 'rangePattern' } },
  },
};

export const nyxWing: CardDefinition = {
  id: 'nyx-wing',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: 'both' },
    { row: 0, col: -1, type: 'both' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const cerberusHound: CardDefinition = {
  id: 'cerberus-hound',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 1, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'both' },
    { row: 1, col: 1, type: 'ability' },
    { row: 2, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const ghastlyShade: CardDefinition = {
  id: 'ghastly-shade',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 1, target: { type: 'allEnfeebled' } },
  },
};

export const eliteMyrmidon: CardDefinition = {
  id: 'elite-myrmidon',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: 'both' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 2, col: 0, type: 'both' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const hundredEyedArgus: CardDefinition = {
  id: 'hundred-eyed-argus',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: 0, type: 'ability' },
    { row: -2, col: 2, type: 'ability' },
    { row: 0, col: -2, type: 'ability' },
    { row: 0, col: 2, type: 'ability' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: 0, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enhance', value: 3, target: { type: 'rangePattern' } },
  },
};

export const phantomWraith: CardDefinition = {
  id: 'phantom-wraith',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'ability' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -1, type: 'ability' },
    { row: 0, col: 1, type: 'ability' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'ability' },
    { row: 1, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 1, target: { type: 'rangePattern' } },
  },
};

export const amazonStriker: CardDefinition = {
  id: 'amazon-striker',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'endOfGame',
    effect: { type: 'enhance', value: 5, target: { type: 'self' } },
  },
};

export const flameOfPrometheus: CardDefinition = {
  id: 'flame-of-prometheus',
  rank: 1,
  power: 3,
  rangePattern: [
    { row: -2, col: -2, type: 'ability' },
    { row: -2, col: 0, type: 'ability' },
    { row: -2, col: 2, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -2, type: 'ability' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 0, col: 2, type: 'ability' },
    { row: 2, col: -2, type: 'ability' },
    { row: 2, col: 0, type: 'ability' },
    { row: 2, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whenFirstEnfeebled',
    effect: { type: 'enfeeble', value: 2, target: { type: 'rangePattern' } },
  },
};

export const fortuneSphinx: CardDefinition = {
  id: 'fortune-sphinx',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'battle-sprite', count: 1 },
  },
};

export const daedalusPilot: CardDefinition = {
  id: 'daedalus-pilot',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'daedalus-glider', count: 1 },
  },
};

export const lycaonCursed: CardDefinition = {
  id: 'lycaon-cursed',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'lycaon-beast', count: 1 },
  },
};

export const gryphonAndSprite: CardDefinition = {
  id: 'gryphon-and-sprite',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 1, target: { type: 'allAlliedEnhanced' } },
  },
};

export const goldenGryphon: CardDefinition = {
  id: 'golden-gryphon',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'endOfGame',
    effect: { type: 'enhance', value: 3, target: { type: 'self' } },
  },
};

export const swiftBlade: CardDefinition = {
  id: 'swift-blade',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 2, col: 0, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enfeeble', value: 2, target: { type: 'rangePattern' } },
  },
};

export const ironFist: CardDefinition = {
  id: 'iron-fist',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: 'ability' },
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const silentDagger: CardDefinition = {
  id: 'silent-dagger',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'both' }],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enfeeble', value: 99, target: { type: 'rangePattern' } },
  },
};

export const shadowCommander: CardDefinition = {
  id: 'shadow-commander',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 0, col: 2, type: 'ability' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enhance', value: 4, target: { type: 'rangePattern' } },
  },
};

export const starVoyager: CardDefinition = {
  id: 'star-voyager',
  rank: 1,
  power: 2,
  rangePattern: [
    { row: -2, col: 0, type: 'pawn' },
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 1, target: { type: 'allEnemyEnhanced' } },
  },
};

export const houseOfHades: CardDefinition = {
  id: 'house-of-hades',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: -1, col: 1, type: 'ability' },
    { row: -1, col: 2, type: 'ability' },
    { row: 1, col: 0, type: 'pawn' },
    { row: 1, col: 1, type: 'ability' },
    { row: 1, col: 2, type: 'ability' },
  ],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

export const tragicMuse: CardDefinition = {
  id: 'tragic-muse',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: -1, type: 'ability' },
    { row: -1, col: 0, type: 'ability' },
    { row: -1, col: 1, type: 'ability' },
    { row: 0, col: -1, type: 'ability' },
    { row: 0, col: 1, type: 'ability' },
    { row: 1, col: -1, type: 'ability' },
    { row: 1, col: 0, type: 'ability' },
    { row: 1, col: 1, type: 'ability' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 1, target: { type: 'rangePattern' } },
  },
};

export const dionysusReveler: CardDefinition = {
  id: 'dionysus-reveler',
  rank: 1,
  power: 1,
  rangePattern: [
    { row: -1, col: 0, type: 'pawn' },
    { row: 0, col: -1, type: 'pawn' },
    { row: 0, col: 1, type: 'pawn' },
    { row: 1, col: 0, type: 'pawn' },
  ],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'scoreRedistribution' },
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
