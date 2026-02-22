import type { Board, Position, Tile } from './types.js';
import { BOARD_ROWS, BOARD_COLS } from './types.js';

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_ROWS && pos.col >= 0 && pos.col < BOARD_COLS;
}

export function getTile(board: Board, pos: Position): Tile | undefined {
  return board[pos.row]?.[pos.col];
}

export function setTile(board: Board, pos: Position, tile: Tile): Board {
  return board.map((row, r) =>
    r === pos.row ? row.map((t, c) => (c === pos.col ? tile : t)) : row,
  );
}

export function createBoard(): Board {
  const rows: Tile[][] = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    const row: Tile[] = [];
    for (let c = 0; c < BOARD_COLS; c++) {
      if (c === 0) {
        row.push({ owner: 0, pawnCount: 1, cardInstanceId: null });
      } else if (c === BOARD_COLS - 1) {
        row.push({ owner: 1, pawnCount: 1, cardInstanceId: null });
      } else {
        row.push({ owner: null, pawnCount: 0, cardInstanceId: null });
      }
    }
    rows.push(row);
  }
  return rows;
}
