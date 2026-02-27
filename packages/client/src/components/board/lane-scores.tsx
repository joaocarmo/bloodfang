import { t } from '@lingui/core/macro';
import type { PlayerId } from '@bloodfang/engine';
import { BOARD_ROWS } from '@bloodfang/engine';
import { useLaneScores } from '../../hooks/use-lane-scores.ts';

interface LaneScoresProps {
  player: PlayerId;
  side: 'left' | 'right';
}

export function LaneScores({ player, side }: LaneScoresProps) {
  const laneScores = useLaneScores();
  const colorClass = player === 0 ? 'text-p0' : 'text-p1';
  const totalScore = laneScores.reduce((sum, lane) => {
    const score = lane?.[player];
    return sum + (score ?? 0);
  }, 0);

  return (
    <div
      className={`flex flex-col gap-1 items-center justify-between ${side === 'left' ? 'pr-1 sm:pr-2' : 'pl-1 sm:pl-2'}`}
      role="status"
      aria-label={t`Player ${player + 1} scores`}
    >
      <div className={`text-xs text-text-secondary font-medium`}>P{player + 1}</div>
      {Array.from({ length: BOARD_ROWS }, (_, row) => {
        const score = laneScores[row]?.[player] ?? 0;
        return (
          <div
            key={row}
            className={`${colorClass} font-bold text-sm sm:text-base md:text-lg tabular-nums flex items-center justify-center h-full`}
          >
            {score}
          </div>
        );
      })}
      <div
        className={`${colorClass} font-bold text-base sm:text-lg md:text-xl border-t border-border pt-1 tabular-nums`}
      >
        {totalScore}
      </div>
    </div>
  );
}
