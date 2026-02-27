import type { CardRank } from '@bloodfang/engine';

interface RankIconProps {
  rank: CardRank;
}

export function RankIcon({ rank }: RankIconProps) {
  if (rank === 'replacement') {
    return (
      <span className="text-rank-replacement font-bold" aria-label="Replacement card">
        R
      </span>
    );
  }

  const stars = Array.from({ length: rank }, (_, i) => (
    <span key={i} className="text-xs">
      {'\u2605'}
    </span>
  ));

  return (
    <span
      className={rank === 1 ? 'text-rank-1' : rank === 2 ? 'text-rank-2' : 'text-rank-3'}
      aria-label={`Rank ${rank}`}
    >
      {stars}
    </span>
  );
}
