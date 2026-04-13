// Types

// Abilities
export {
  collectTriggersForEvents,
  recalculateContinuousEffects,
  resolveAbilities,
  resolveAbilityRangePattern,
  resolveTargets,
} from './abilities.js';
// Board
export { createBoard, getTile, isBoardFull, isValidPosition, setTile } from './board.js';
export type { CardId as CardIdType } from './card-id.js';
// Card IDs
export { CardId } from './card-id.js';
// Card database
export { getAllGameDefinitions } from './cards/all-cards.js';
export type { EffectResult } from './effects.js';

// Effects
export {
  applyAddCardToHand,
  applyDestroy,
  applyDualTargetBuff,
  applyEffect,
  applyEnfeeble,
  applyEnhance,
  applyPositionRankManip,
  applySpawnCard,
  internalDestroyCard,
} from './effects.js';
// Game lifecycle
export {
  canPlayCard,
  createGame,
  destroyCard,
  getEffectivePower,
  getValidMoves,
  mulligan,
  pass,
  playCard,
  resolveRangePattern,
} from './game.js';
export type { LaneScores } from './scoring.js';
// Scoring
export { calculateFinalScores, calculateLaneScores, determineWinner } from './scoring.js';
export type {
  AbilityDefinition,
  AbilityEffect,
  // Ability types
  AbilityTriggerType,
  AddCardToHandEffect,
  Board,
  CardDefinition,
  CardInstance,
  CardRank,
  ContinuousModifier,
  DestroyEffect,
  DualTargetBuffEffect,
  DynamicValue,
  EnfeebleEffect,
  EnhanceEffect,
  GameAction,
  GameConfig,
  GameEvent,
  GameEventType,
  GameState,
  LaneScoreBonusEffect,
  PlayerId,
  PlayerState,
  Position,
  PositionRankManipEffect,
  RangeCell,
  RangeCellType,
  ScalingCondition,
  ScoreRedistributionEffect,
  SelfPowerScalingEffect,
  SpawnCardEffect,
  TargetSelector,
  TargetSelectorType,
  Tile,
} from './types.js';
// Constants & helpers
export {
  ABILITY_TRIGGERS,
  BOARD_COLS,
  BOARD_ROWS,
  CARD_RANKS,
  createSeededRng,
  DECK_SIZE,
  EFFECT_TYPES,
  GAME_EVENT_TYPES,
  GamePhase,
  INITIAL_HAND_SIZE,
  LOG_ACTION_TYPES,
  MAX_PAWN_COUNT,
  opponent,
  RANGE_CELL_TYPES,
  TARGET_SELECTORS,
} from './types.js';
// Utilities
export { fisherYatesShuffle } from './utils.js';
