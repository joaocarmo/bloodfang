// Types
export type {
  PlayerId,
  Position,
  RangeCellType,
  RangeCell,
  CardRank,
  CardDefinition,
  CardInstance,
  ContinuousModifier,
  Tile,
  Board,
  PlayerState,
  GamePhase,
  GameAction,
  GameConfig,
  GameState,
  // Ability types
  AbilityTriggerType,
  TargetSelectorType,
  TargetSelector,
  ScalingCondition,
  AbilityEffect,
  EnhanceEffect,
  EnfeebleEffect,
  DestroyEffect,
  SelfPowerScalingEffect,
  LaneScoreBonusEffect,
  AddCardToHandEffect,
  SpawnCardEffect,
  PositionRankManipEffect,
  ScoreRedistributionEffect,
  DualTargetBuffEffect,
  AbilityDefinition,
  GameEventType,
  GameEvent,
} from './types.js';

// Constants & helpers
export {
  BOARD_ROWS,
  BOARD_COLS,
  MAX_PAWN_COUNT,
  DECK_SIZE,
  INITIAL_HAND_SIZE,
  opponent,
  createSeededRng,
} from './types.js';

// Board
export { createBoard, getTile, setTile, isValidPosition } from './board.js';

// Game lifecycle
export {
  createGame,
  mulligan,
  playCard,
  pass,
  destroyCard,
  canPlayCard,
  getValidMoves,
  getEffectivePower,
  resolveRangePattern,
} from './game.js';

// Abilities
export {
  resolveAbilities,
  resolveAbilityRangePattern,
  resolveTargets,
  collectTriggersForEvents,
  recalculateContinuousEffects,
} from './abilities.js';

// Effects
export {
  applyEffect,
  applyEnhance,
  applyEnfeeble,
  applyDestroy,
  applyAddCardToHand,
  applySpawnCard,
  applyPositionRankManip,
  applyDualTargetBuff,
  internalDestroyCard,
} from './effects.js';
export type { EffectResult } from './effects.js';

// Scoring
export { calculateLaneScores, calculateFinalScores, determineWinner } from './scoring.js';
export type { LaneScores } from './scoring.js';
