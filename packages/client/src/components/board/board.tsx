import { useState, useCallback, type KeyboardEvent } from 'react';
import { BOARD_ROWS, BOARD_COLS } from '@bloodfang/engine';
import { Tile } from './tile.tsx';
import { LaneScores } from './lane-scores.tsx';

export function Board() {
  const [focusedRow, setFocusedRow] = useState(0);
  const [focusedCol, setFocusedCol] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let nextRow = focusedRow;
      let nextCol = focusedCol;

      switch (e.key) {
        case 'ArrowUp':
          nextRow = Math.max(0, focusedRow - 1);
          break;
        case 'ArrowDown':
          nextRow = Math.min(BOARD_ROWS - 1, focusedRow + 1);
          break;
        case 'ArrowLeft':
          nextCol = Math.max(0, focusedCol - 1);
          break;
        case 'ArrowRight':
          nextCol = Math.min(BOARD_COLS - 1, focusedCol + 1);
          break;
        default:
          return;
      }

      e.preventDefault();
      setFocusedRow(nextRow);
      setFocusedCol(nextCol);

      // Focus the target cell
      const cell = document.querySelector(
        `[data-tile="${nextRow}-${nextCol}"]`,
      ) as HTMLElement | null;
      cell?.focus();
    },
    [focusedRow, focusedCol],
  );

  return (
    <div className="flex items-stretch gap-2">
      <LaneScores player={0} side="left" />

      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus is managed via roving tabindex on child cells */}
      <div
        role="grid"
        aria-label="Game board"
        onKeyDown={handleKeyDown}
        className="grid grid-cols-5 grid-rows-3 gap-1 flex-1"
      >
        {Array.from({ length: BOARD_ROWS }, (_, row) => (
          <div key={row} role="row" className="contents">
            {Array.from({ length: BOARD_COLS }, (_, col) => (
              <div key={col} data-tile={`${row}-${col}`}>
                <Tile
                  row={row}
                  col={col}
                  isFocused={focusedRow === row && focusedCol === col}
                  onFocus={() => {
                    setFocusedRow(row);
                    setFocusedCol(col);
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <LaneScores player={1} side="right" />
    </div>
  );
}
