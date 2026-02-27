import { t } from '@lingui/core/macro';
import type { PlayerId, LaneScores as LaneScoresType } from '@bloodfang/engine';
import { BOARD_ROWS } from '@bloodfang/engine';
import { useLaneScores } from '../../hooks/use-lane-scores.ts';
import { playerTextColor } from '../../lib/player-color.ts';

interface LaneScoresProps {
  player: PlayerId;
  side: 'left' | 'right';
  previewLaneScores?: LaneScoresType | null | undefined;
}

export function LaneScores({ player, side, previewLaneScores }: LaneScoresProps) {
  const laneScores = useLaneScores();
  const colorClass = playerTextColor(player);
  const totalScore = laneScores.reduce((sum, lane) => {
    const score = lane?.[player];
    return sum + (score ?? 0);
  }, 0);
  const previewTotal = previewLaneScores
    ? previewLaneScores.reduce((sum, lane) => {
        const score = lane?.[player];
        return sum + (score ?? 0);
      }, 0)
    : null;

  return (
    <div
      className={`flex flex-col items-center shrink-0 w-16 sm:w-20 md:w-24 ${side === 'left' ? 'pr-1 sm:pr-2' : 'pl-1 sm:pl-2'}`}
      role="status"
      aria-label={t`Player ${player + 1} scores`}
    >
      <div className="text-xs text-text-secondary font-medium mb-1">{t`P${player + 1}`}</div>

      <div className="grid grid-rows-3 gap-1 flex-1">
        {Array.from({ length: BOARD_ROWS }, (_, row) => {
          const score = laneScores[row]?.[player] ?? 0;
          const previewScore = previewLaneScores?.[row]?.[player];
          const hasPreviewDelta = previewScore != null && previewScore !== score;

          return (
            <div
              key={row}
              className={`${colorClass} font-bold text-sm sm:text-base md:text-lg tabular-nums flex items-center justify-center`}
            >
              {hasPreviewDelta ? (
                <>
                  {score}{' '}
                  <span className="text-power-buff text-[10px] sm:text-xs">
                    {'\u2192'} {previewScore}
                  </span>
                </>
              ) : (
                score
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`${colorClass} font-bold text-base sm:text-lg md:text-xl border-t border-border mt-1 pt-1 tabular-nums`}
      >
        {previewTotal != null && previewTotal !== totalScore ? (
          <>
            {totalScore}{' '}
            <span className="text-power-buff text-xs sm:text-sm">
              {'\u2192'} {previewTotal}
            </span>
          </>
        ) : (
          totalScore
        )}
      </div>
    </div>
  );
}
