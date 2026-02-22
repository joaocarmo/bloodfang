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

// ── Card Definition (static data) ──────────────────────────────────────

export interface CardDefinition {
  readonly id: string;
  readonly rank: CardRank;
  readonly power: number;
  readonly rangePattern: readonly RangeCell[];
}

// ── Card Instance (runtime, on the board) ──────────────────────────────

export interface CardInstance {
  readonly instanceId: string;
  readonly definitionId: string;
  readonly owner: PlayerId;
  readonly position: Position;
  readonly basePower: number;
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
  | { readonly type: 'gameEnd'; readonly scores: readonly [number, number] };

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
