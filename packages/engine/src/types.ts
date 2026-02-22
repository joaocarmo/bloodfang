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

export type RangeCellType = 'pawn' | 'ability' | 'both';

export interface RangeCell {
  readonly row: number;
  readonly col: number;
  readonly type: RangeCellType;
}

export type CardRank = 1 | 2 | 3 | 'replacement';

// ── Ability System ────────────────────────────────────────────────────

export type AbilityTriggerType =
  | 'whenPlayed' | 'whileInPlay' | 'whenDestroyed'
  | 'whenAlliedDestroyed' | 'whenEnemyDestroyed' | 'whenAnyDestroyed'
  | 'whenFirstEnfeebled' | 'whenFirstEnhanced' | 'whenPowerReachesN'
  | 'scaling' | 'endOfGame';

export type TargetSelectorType =
  | 'rangePattern' | 'self'
  | 'allAllied' | 'allEnemy'
  | 'allInLane' | 'allAlliedInLane' | 'allEnemyInLane';

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

export interface EnhanceEffect {
  readonly type: 'enhance';
  readonly value: number;
  readonly target: TargetSelector;
}

export interface EnfeebleEffect {
  readonly type: 'enfeeble';
  readonly value: number;
  readonly target: TargetSelector;
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

export type GameEventType = 'cardPlayed' | 'cardDestroyed' | 'cardEnfeebled' | 'cardEnhanced' | 'powerChanged';

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

export type GamePhase = 'mulligan' | 'playing' | 'ended';

// ── Action Log ─────────────────────────────────────────────────────────

export type GameAction =
  | { readonly type: 'drawCard'; readonly player: PlayerId; readonly cardId: string }
  | { readonly type: 'placeCard'; readonly player: PlayerId; readonly cardId: string; readonly instanceId: string; readonly position: Position }
  | { readonly type: 'placePawn'; readonly player: PlayerId; readonly position: Position }
  | { readonly type: 'capturePawn'; readonly player: PlayerId; readonly position: Position }
  | { readonly type: 'destroyCard'; readonly instanceId: string; readonly position: Position }
  | { readonly type: 'pass'; readonly player: PlayerId }
  | { readonly type: 'mulligan'; readonly player: PlayerId; readonly returnedCount: number; readonly drawnCount: number }
  | { readonly type: 'gameEnd'; readonly scores: readonly [number, number] }
  | { readonly type: 'abilityTrigger'; readonly instanceId: string; readonly abilityTrigger: AbilityTriggerType }
  | { readonly type: 'enhance'; readonly sourceInstanceId: string; readonly targetInstanceId: string; readonly value: number }
  | { readonly type: 'enfeeble'; readonly sourceInstanceId: string; readonly targetInstanceId: string; readonly value: number }
  | { readonly type: 'spawnCard'; readonly instanceId: string; readonly definitionId: string; readonly position: Position }
  | { readonly type: 'addCardToHand'; readonly player: PlayerId; readonly cardId: string }
  | { readonly type: 'pawnBonus'; readonly player: PlayerId; readonly position: Position; readonly bonusPawns: number };

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
