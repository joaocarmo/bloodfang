import { describe, it, expect } from 'vitest';
import { createBoard, getTile, setTile, isValidPosition } from './board.js';
import { BOARD_ROWS, BOARD_COLS } from './types.js';

describe('isValidPosition', () => {
  it('accepts all in-bounds positions', () => {
    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLS; col++) {
        expect(isValidPosition({ row, col })).toBe(true);
      }
    }
  });

  it('rejects negative row', () => {
    expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
  });

  it('rejects out-of-bounds row', () => {
    expect(isValidPosition({ row: BOARD_ROWS, col: 0 })).toBe(false);
  });

  it('rejects negative col', () => {
    expect(isValidPosition({ row: 0, col: -1 })).toBe(false);
  });

  it('rejects out-of-bounds col', () => {
    expect(isValidPosition({ row: 0, col: BOARD_COLS })).toBe(false);
  });
});

describe('createBoard', () => {
  it('creates a 3x5 grid', () => {
    const board = createBoard();
    expect(board).toHaveLength(BOARD_ROWS);
    for (const row of board) {
      expect(row).toHaveLength(BOARD_COLS);
    }
  });

  it('P0 owns column 0 with 1 pawn each', () => {
    const board = createBoard();
    for (let r = 0; r < BOARD_ROWS; r++) {
      const tile = getTile(board, { row: r, col: 0 });
      expect(tile).toEqual({ owner: 0, pawnCount: 1, cardInstanceId: null });
    }
  });

  it('P1 owns last column with 1 pawn each', () => {
    const board = createBoard();
    for (let r = 0; r < BOARD_ROWS; r++) {
      const tile = getTile(board, { row: r, col: BOARD_COLS - 1 });
      expect(tile).toEqual({ owner: 1, pawnCount: 1, cardInstanceId: null });
    }
  });

  it('middle columns are empty', () => {
    const board = createBoard();
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 1; c < BOARD_COLS - 1; c++) {
        const tile = getTile(board, { row: r, col: c });
        expect(tile).toEqual({ owner: null, pawnCount: 0, cardInstanceId: null });
      }
    }
  });
});

describe('getTile', () => {
  it('returns tile at valid position', () => {
    const board = createBoard();
    const tile = getTile(board, { row: 0, col: 0 });
    expect(tile).toBeDefined();
    expect(tile?.owner).toBe(0);
  });

  it('returns undefined for out-of-bounds position', () => {
    const board = createBoard();
    expect(getTile(board, { row: -1, col: 0 })).toBeUndefined();
    expect(getTile(board, { row: 0, col: BOARD_COLS })).toBeUndefined();
  });
});

describe('setTile', () => {
  it('returns a new board with the tile replaced', () => {
    const board = createBoard();
    const newTile = { owner: 0 as const, pawnCount: 2, cardInstanceId: null };
    const newBoard = setTile(board, { row: 1, col: 2 }, newTile);

    expect(getTile(newBoard, { row: 1, col: 2 })).toEqual(newTile);
    // Original unchanged
    expect(getTile(board, { row: 1, col: 2 })).toEqual({ owner: null, pawnCount: 0, cardInstanceId: null });
  });

  it('does not mutate original board', () => {
    const board = createBoard();
    const newTile = { owner: 1 as const, pawnCount: 3, cardInstanceId: 'test' };
    setTile(board, { row: 0, col: 0 }, newTile);
    expect(getTile(board, { row: 0, col: 0 })).toEqual({ owner: 0, pawnCount: 1, cardInstanceId: null });
  });
});
