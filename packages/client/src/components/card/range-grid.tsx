import { t } from '@lingui/core/macro';
import type { RangeCell } from '@bloodfang/engine';

function describeRange(rangePattern: readonly RangeCell[]): string {
  let pawnCells = 0;
  let abilityCells = 0;
  for (const cell of rangePattern) {
    if (cell.type === 'pawn' || cell.type === 'both') pawnCells++;
    if (cell.type === 'ability' || cell.type === 'both') abilityCells++;
  }
  if (pawnCells > 0 && abilityCells > 0) {
    return t`Range: ${pawnCells} pawn tiles, ${abilityCells} ability tiles`;
  }
  if (pawnCells > 0) {
    return t`Range: ${pawnCells} pawn tiles`;
  }
  if (abilityCells > 0) {
    return t`Range: ${abilityCells} ability tiles`;
  }
  return t`Range: no tiles`;
}

interface RangeGridProps {
  rangePattern: readonly RangeCell[];
  size?: 'sm' | 'md';
}

export function RangeGrid({ rangePattern, size = 'sm' }: RangeGridProps) {
  const cellSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';
  const gap = size === 'sm' ? 'gap-px' : 'gap-0.5';

  // Build 5x5 grid centered at (0,0) → indices [0..4] map to offsets [-2..2]
  const grid: (string | null)[][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => null),
  );

  for (const cell of rangePattern) {
    const gridRow = cell.row + 2;
    const gridCol = cell.col + 2;
    if (gridRow >= 0 && gridRow < 5 && gridCol >= 0 && gridCol < 5) {
      grid[gridRow]![gridCol] = cell.type;
    }
  }

  // Center cell
  grid[2]![2] = 'center';

  return (
    <div
      className={`inline-grid grid-cols-5 grid-rows-5 ${gap}`}
      role="img"
      aria-label={describeRange(rangePattern)}
    >
      {grid.flat().map((cell, i) => (
        <div key={i} className={`${cellSize} rounded-sm ${getCellColor(cell)}`} />
      ))}
    </div>
  );
}

function getCellColor(cell: string | null): string {
  switch (cell) {
    case 'pawn':
      return 'bg-orange-400';
    case 'ability':
      return 'bg-red-400';
    case 'both':
      return 'bg-orange-400 ring-1 ring-red-400';
    case 'center':
      return 'bg-white';
    default:
      return 'bg-white/10';
  }
}
