import type { Position } from '@bloodfang/engine';

export function isValidTarget(row: number, col: number, validPositions: Position[]): boolean {
  return validPositions.some((p) => p.row === row && p.col === col);
}

export function isHovered(row: number, col: number, hoveredPosition: Position | null): boolean {
  return hoveredPosition?.row === row && hoveredPosition?.col === col;
}
