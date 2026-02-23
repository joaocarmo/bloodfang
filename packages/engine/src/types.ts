// ── Constants ──────────────────────────────────────────────────────────

export const BOARD_ROWS = 3;
export const BOARD_COLS = 5;
export const MAX_PAWN_COUNT = 3;
export const DECK_SIZE = 15;
export const INITIAL_HAND_SIZE = 5;

// ── Primitives ─────────────────────────────────────────────────────────

export type PlayerId = 0 | 1;

export interface Position {
  readonly row: number;
  readonly col: number;
}

export const RANGE_CELL_TYPES = { PAWN: 'pawn', ABILITY: 'ability', BOTH: 'both' } as const;
export type RangeCellType = (typeof RANGE_CELL_TYPES)[keyof typeof RANGE_CELL_TYPES];

export interface RangeCell {
  readonly row: number;
  readonly col: number;
  readonly type: RangeCellType;
}

export type CardRank = 1 | 2 | 3 | 'replacement';

// ── Ability System ────────────────────────────────────────────────────

export const ABILITY_TRIGGERS = {
  WHEN_PLAYED: 'whenPlayed',
  WHILE_IN_PLAY: 'whileInPlay',
  WHEN_DESTROYED: 'whenDestroyed',
  WHEN_ALLIED_DESTROYED: 'whenAlliedDestroyed',
  WHEN_ENEMY_DESTROYED: 'whenEnemyDestroyed',
  WHEN_ANY_DESTROYED: 'whenAnyDestroyed',
  WHEN_ALLIED_PLAYED: 'whenAlliedPlayed',
  WHEN_ENEMY_PLAYED: 'whenEnemyPlayed',
  WHEN_FIRST_ENFEEBLED: 'whenFirstEnfeebled',
  WHEN_FIRST_ENHANCED: 'whenFirstEnhanced',
  WHEN_POWER_REACHES_N: 'whenPowerReachesN',
  SCALING: 'scaling',
  END_OF_GAME: 'endOfGame',
} as const;
export type AbilityTriggerType = (typeof ABILITY_TRIGGERS)[keyof typeof ABILITY_TRIGGERS];

export const TARGET_SELECTORS = {
  RANGE_PATTERN: 'rangePattern',
  SELF: 'self',
  ALL_ALLIED: 'allAllied',
  ALL_ENEMY: 'allEnemy',
  ALL_IN_LANE: 'allInLane',
  ALL_ALLIED_IN_LANE: 'allAlliedInLane',
  ALL_ENEMY_IN_LANE: 'allEnemyInLane',
  ALL_ALLIED_ENHANCED: 'allAlliedEnhanced',
  ALL_ENEMY_ENHANCED: 'allEnemyEnhanced',
  ALL_ENHANCED: 'allEnhanced',
  ALL_ALLIED_ENFEEBLED: 'allAlliedEnfeebled',
  ALL_ENEMY_ENFEEBLED: 'allEnemyEnfeebled',
  ALL_ENFEEBLED: 'allEnfeebled',
} as const;
export type TargetSelectorType = (typeof TARGET_SELECTORS)[keyof typeof TARGET_SELECTORS];

export interface TargetSelector {
  readonly type: TargetSelectorType;
}

export type ScalingCondition =
  | { readonly type: 'alliedCardsInLane' }
  | { readonly type: 'enemyCardsInLane' }
  | { readonly type: 'alliedCardsOnBoard' }
  | { readonly type: 'enemyCardsOnBoard' }
  | { readonly type: 'allCardsOnBoard' }
  | { readonly type: 'controlledTilesInLane' };

export type DynamicValue = 'replacedCardPower';

export interface EnhanceEffect {
  readonly type: 'enhance';
  readonly value: number;
  readonly target: TargetSelector;
  readonly dynamicValue?: DynamicValue;
}

export interface EnfeebleEffect {
  readonly type: 'enfeeble';
  readonly value: number;
  readonly target: TargetSelector;
  readonly dynamicValue?: DynamicValue;
}

export interface DestroyEffect {
  readonly type: 'destroy';
  readonly target: TargetSelector;
}

export interface SelfPowerScalingEffect {
  readonly type: 'selfPowerScaling';
  readonly condition: ScalingCondition;
  readonly valuePerUnit: number;
}

export interface LaneScoreBonusEffect {
  readonly type: 'laneScoreBonus';
  readonly value: number;
}

export interface AddCardToHandEffect {
  readonly type: 'addCardToHand';
  readonly tokenDefinitionId: string;
  readonly count: number;
  readonly additionalTokens?: readonly { readonly tokenDefinitionId: string; readonly count: number }[];
}

export interface SpawnCardEffect {
  readonly type: 'spawnCard';
  readonly tokenDefinitionId: string;
  readonly target: TargetSelector;
}

export interface PositionRankManipEffect {
  readonly type: 'positionRankManip';
  readonly bonusPawns: number;
  readonly target: TargetSelector;
}

export interface ScoreRedistributionEffect {
  readonly type: 'scoreRedistribution';
}

export interface DualTargetBuffEffect {
  readonly type: 'dualTargetBuff';
  readonly alliedValue: number;
  readonly enemyValue: number;
  readonly target: TargetSelector;
}

export const EFFECT_TYPES = {
  ENHANCE: 'enhance',
  ENFEEBLE: 'enfeeble',
  DESTROY: 'destroy',
  SELF_POWER_SCALING: 'selfPowerScaling',
  LANE_SCORE_BONUS: 'laneScoreBonus',
  ADD_CARD_TO_HAND: 'addCardToHand',
  SPAWN_CARD: 'spawnCard',
  POSITION_RANK_MANIP: 'positionRankManip',
  SCORE_REDISTRIBUTION: 'scoreRedistribution',
  DUAL_TARGET_BUFF: 'dualTargetBuff',
} as const;

export type AbilityEffect =
  | EnhanceEffect
  | EnfeebleEffect
  | DestroyEffect
  | SelfPowerScalingEffect
  | LaneScoreBonusEffect
  | AddCardToHandEffect
  | SpawnCardEffect
  | PositionRankManipEffect
  | ScoreRedistributionEffect
  | DualTargetBuffEffect;

export interface AbilityDefinition {
  readonly trigger: AbilityTriggerType;
  readonly effect: AbilityEffect;
  readonly threshold?: number;
}

// ── Game Events (internal, for cascade resolution) ────────────────────

export const GAME_EVENT_TYPES = {
  CARD_PLAYED: 'cardPlayed',
  CARD_DESTROYED: 'cardDestroyed',
  CARD_ENFEEBLED: 'cardEnfeebled',
  CARD_ENHANCED: 'cardEnhanced',
  POWER_CHANGED: 'powerChanged',
} as const;
export type GameEventType = (typeof GAME_EVENT_TYPES)[keyof typeof GAME_EVENT_TYPES];

export interface GameEvent {
  readonly type: GameEventType;
  readonly instanceId: string;
  readonly owner: PlayerId;
}

// ── Card Definition (static data) ──────────────────────────────────────

export interface CardDefinition {
  readonly id: string;
  readonly rank: CardRank;
  readonly power: number;
  readonly rangePattern: readonly RangeCell[];
  readonly ability?: AbilityDefinition;
  readonly isToken?: boolean;
}

// ── Card Instance (runtime, on the board) ──────────────────────────────

export interface CardInstance {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly owner: PlayerId;
  readonly position: Position;
  readonly basePower: number;
  readonly bonusPower: number;
  readonly hasBeenEnfeebled?: boolean;
  readonly hasBeenEnhanced?: boolean;
  readonly powerReachedN?: boolean;
}

// ── Continuous Modifier (tracked on game state) ────────────────────────

export interface ContinuousModifier {
  readonly sourceInstanceId: string;
  readonly targetInstanceId: string;
  readonly value: number;
}

// ── Board ──────────────────────────────────────────────────────────────

export interface Tile {
  readonly owner: PlayerId | null;
  readonly pawnCount: number;
  readonly cardInstanceId: string | null;
}

export type Board = readonly (readonly Tile[])[];

// ── Player State ───────────────────────────────────────────────────────

export interface PlayerState {
  readonly deck: readonly string[];
  readonly hand: readonly string[];
  readonly mulliganUsed: boolean;
}

// ── Game Phase ─────────────────────────────────────────────────────────

export const GAME_PHASES = { MULLIGAN: 'mulligan', PLAYING: 'playing', ENDED: 'ended' } as const;
export type GamePhase = (typeof GAME_PHASES)[keyof typeof GAME_PHASES];

// ── Action Log ─────────────────────────────────────────────────────────

export type GameAction =
  | { readonly type: 'drawCard'; readonly player: PlayerId; readonly cardId: string }
  | {
      readonly type: 'placeCard';
      readonly player: PlayerId;
      readonly cardId: string;
      readonly instanceId: string;
      readonly position: Position;
    }
  | { readonly type: 'placePawn'; readonly player: PlayerId; readonly position: Position }
  | { readonly type: 'capturePawn'; readonly player: PlayerId; readonly position: Position }
  | { readonly type: 'destroyCard'; readonly instanceId: string; readonly position: Position }
  | { readonly type: 'pass'; readonly player: PlayerId }
  | {
      readonly type: 'mulligan';
      readonly player: PlayerId;
      readonly returnedCount: number;
      readonly drawnCount: number;
    }
  | { readonly type: 'gameEnd'; readonly scores: readonly [number, number] }
  | {
      readonly type: 'abilityTrigger';
      readonly instanceId: string;
      readonly abilityTrigger: AbilityTriggerType;
    }
  | {
      readonly type: 'enhance';
      readonly sourceInstanceId: string;
      readonly targetInstanceId: string;
      readonly value: number;
    }
  | {
      readonly type: 'enfeeble';
      readonly sourceInstanceId: string;
      readonly targetInstanceId: string;
      readonly value: number;
    }
  | {
      readonly type: 'spawnCard';
      readonly instanceId: string;
      readonly definitionId: string;
      readonly position: Position;
    }
  | { readonly type: 'addCardToHand'; readonly player: PlayerId; readonly cardId: string }
  | {
      readonly type: 'pawnBonus';
      readonly player: PlayerId;
      readonly position: Position;
      readonly bonusPawns: number;
    };

// ── Game Config ────────────────────────────────────────────────────────

export interface GameConfig {
  readonly firstPlayer?: PlayerId;
  readonly initialHandSize?: number;
}

// ── Game State ─────────────────────────────────────────────────────────

export interface GameState {
  readonly board: Board;
  readonly players: readonly [PlayerState, PlayerState];
  readonly currentPlayerIndex: PlayerId;
  readonly turnNumber: number;
  readonly phase: GamePhase;
  readonly consecutivePasses: number;
  readonly continuousModifiers: readonly ContinuousModifier[];
  readonly cardInstances: Readonly<Record<string, CardInstance>>;
  readonly log: readonly GameAction[];
  readonly nextInstanceId: number;
  readonly cardDefinitions: Readonly<Record<string, CardDefinition>>;
  readonly replacedCardPower?: number | undefined;
}

// ── Helpers ────────────────────────────────────────────────────────────

export function opponent(player: PlayerId): PlayerId {
  return player === 0 ? 1 : 0;
}

// ── Seeded RNG ─────────────────────────────────────────────────────────

export function createSeededRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}
