import type { CardDefinition } from '../types.js';

// ── Ability Test Cards ────────────────────────────────────────────────

/** whenPlayed → enhance +2 via rangePattern */
export const enhancerOnPlay: CardDefinition = {
  id: 'enhancer-on-play',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enhance', value: 2, target: { type: 'rangePattern' } },
  },
};

/** whenPlayed → enfeeble -3 via rangePattern */
export const enfeebleOnPlay: CardDefinition = {
  id: 'enfeeble-on-play',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 3, target: { type: 'rangePattern' } },
  },
};

/** whenPlayed → destroy via rangePattern */
export const destroyerOnPlay: CardDefinition = {
  id: 'destroyer-on-play',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'destroy', target: { type: 'rangePattern' } },
  },
};

/** whileInPlay → enhance +1 via rangePattern (continuous) */
export const auraBuffer: CardDefinition = {
  id: 'aura-buffer',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }, { row: 0, col: -1, type: 'ability' }],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'enhance', value: 1, target: { type: 'rangePattern' } },
  },
};

/** whenDestroyed → enfeeble -2 allEnemyInLane */
export const deathCurse: CardDefinition = {
  id: 'death-curse',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: 'whenDestroyed',
    effect: { type: 'enfeeble', value: 2, target: { type: 'allEnemyInLane' } },
  },
};

/** whenAlliedDestroyed → enhance +2 self */
export const avenger: CardDefinition = {
  id: 'avenger',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: 'whenAlliedDestroyed',
    effect: { type: 'enhance', value: 2, target: { type: 'self' } },
  },
};

/** whenEnemyDestroyed → enhance +3 self */
export const predator: CardDefinition = {
  id: 'predator',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: 'whenEnemyDestroyed',
    effect: { type: 'enhance', value: 3, target: { type: 'self' } },
  },
};

/** whenAnyDestroyed → enhance +1 self */
export const scavenger: CardDefinition = {
  id: 'scavenger',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: 'whenAnyDestroyed',
    effect: { type: 'enhance', value: 1, target: { type: 'self' } },
  },
};

/** whenFirstEnfeebled → enhance +3 self */
export const resilient: CardDefinition = {
  id: 'resilient',
  rank: 1,
  power: 4,
  rangePattern: [],
  ability: {
    trigger: 'whenFirstEnfeebled',
    effect: { type: 'enhance', value: 3, target: { type: 'self' } },
  },
};

/** whenFirstEnhanced → enhance +1 allAlliedInLane */
export const inspirer: CardDefinition = {
  id: 'inspirer',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: 'whenFirstEnhanced',
    effect: { type: 'enhance', value: 1, target: { type: 'allAlliedInLane' } },
  },
};

/** whenPowerReachesN(5) → destroy allEnemyInLane */
export const threshold5Destroyer: CardDefinition = {
  id: 'threshold5-destroyer',
  rank: 1,
  power: 3,
  rangePattern: [],
  ability: {
    trigger: 'whenPowerReachesN',
    effect: { type: 'destroy', target: { type: 'allEnemyInLane' } },
    threshold: 5,
  },
};

/** scaling → selfPowerScaling (alliedCardsInLane, +2) */
export const armyScaler: CardDefinition = {
  id: 'army-scaler',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: 'scaling',
    effect: { type: 'selfPowerScaling', condition: { type: 'alliedCardsInLane' }, valuePerUnit: 2 },
  },
};

/** endOfGame → laneScoreBonus +5 */
export const laneBonus: CardDefinition = {
  id: 'lane-bonus',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: 'endOfGame',
    effect: { type: 'laneScoreBonus', value: 5 },
  },
};

/** whenPlayed → addCardToHand (token-basic, count 2) */
export const handGenerator: CardDefinition = {
  id: 'hand-generator',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'addCardToHand', tokenDefinitionId: 'token-basic', count: 2 },
  },
};

/** whenPlayed → spawnCard (token-basic) via rangePattern */
export const spawner: CardDefinition = {
  id: 'spawner',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'spawnCard', tokenDefinitionId: 'token-basic', target: { type: 'rangePattern' } },
  },
};

/** whenPlayed → positionRankManip +2 via rangePattern */
export const rankBooster: CardDefinition = {
  id: 'rank-booster',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'positionRankManip', bonusPawns: 2, target: { type: 'rangePattern' } },
  },
};

/** endOfGame → scoreRedistribution */
export const scoreRedistributor: CardDefinition = {
  id: 'score-redistributor',
  rank: 1,
  power: 1,
  rangePattern: [],
  ability: {
    trigger: 'endOfGame',
    effect: { type: 'scoreRedistribution' },
  },
};

/** whileInPlay → dualTargetBuff +1/-1 via rangePattern */
export const dualAura: CardDefinition = {
  id: 'dual-aura',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }, { row: 0, col: -1, type: 'ability' }],
  ability: {
    trigger: 'whileInPlay',
    effect: { type: 'dualTargetBuff', alliedValue: 1, enemyValue: -1, target: { type: 'rangePattern' } },
  },
};

/** whenPlayed → enfeeble -5 via rangePattern (for cascade testing: kills a 5-power card) */
export const chainKiller: CardDefinition = {
  id: 'chain-killer',
  rank: 1,
  power: 2,
  rangePattern: [{ row: 0, col: 1, type: 'ability' }],
  ability: {
    trigger: 'whenPlayed',
    effect: { type: 'enfeeble', value: 5, target: { type: 'rangePattern' } },
  },
};

/** whenAnyDestroyed → enhance +2 self (for cascade testing) */
export const cascadeGrower: CardDefinition = {
  id: 'cascade-grower',
  rank: 1,
  power: 2,
  rangePattern: [],
  ability: {
    trigger: 'whenAnyDestroyed',
    effect: { type: 'enhance', value: 2, target: { type: 'self' } },
  },
};

// ── Helpers ───────────────────────────────────────────────────────────

const ALL_ABILITY_CARDS: readonly CardDefinition[] = [
  enhancerOnPlay, enfeebleOnPlay, destroyerOnPlay, auraBuffer, deathCurse,
  avenger, predator, scavenger, resilient, inspirer, threshold5Destroyer,
  armyScaler, laneBonus, handGenerator, spawner, rankBooster,
  scoreRedistributor, dualAura, chainKiller, cascadeGrower,
];

export function getAllAbilityTestDefinitions(): Record<string, CardDefinition> {
  const defs: Record<string, CardDefinition> = {};
  for (const card of ALL_ABILITY_CARDS) {
    defs[card.id] = card;
  }
  return defs;
}
