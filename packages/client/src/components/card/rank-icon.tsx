import type { CardRank } from '@bloodfang/engine';
import { t } from '@lingui/core/macro';

interface RankIconProps {
  rank: CardRank;
}

export function RankIcon({ rank }: RankIconProps) {
  if (rank === 'replacement') {
    return (
      <span className="text-rank-replacement font-bold" role="img" aria-label={t`Replacement card`}>
        R
      </span>
    );
  }

  const stars = Array.from({ length: rank }, (_, i) => (
    <span key={`star-${String(i)}`} className="text-xs">
      {'\u2605'}
    </span>
  ));

  return (
    <span
      className={rank === 1 ? 'text-rank-1' : rank === 2 ? 'text-rank-2' : 'text-rank-3'}
      role="img"
      aria-label={t`Rank ${String(rank)}`}
    >
      {stars}
    </span>
  );
}
