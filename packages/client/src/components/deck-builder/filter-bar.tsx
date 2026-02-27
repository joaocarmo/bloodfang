import type { CardRank } from '@bloodfang/engine';
import { useDeckStore } from '../../store/deck-store.ts';
import { ToggleButton } from '../ui/toggle-button.tsx';

export function FilterBar() {
  const searchQuery = useDeckStore((s) => s.searchQuery);
  const setSearchQuery = useDeckStore((s) => s.setSearchQuery);
  const rankFilter = useDeckStore((s) => s.rankFilter);
  const setRankFilter = useDeckStore((s) => s.setRankFilter);

  const ranks: { value: CardRank | null; label: string }[] = [
    { value: null, label: 'All' },
    { value: 1, label: 'Rank 1' },
    { value: 2, label: 'Rank 2' },
    { value: 3, label: 'Rank 3' },
    { value: 'replacement', label: 'Replace' },
  ];

  return (
    <div className="flex gap-3 items-end flex-wrap">
      <div className="flex flex-col gap-1">
        <label htmlFor="card-search" className="text-xs text-text-secondary">
          Search
        </label>
        <input
          id="card-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Card name..."
          className="px-3 py-1.5 bg-surface-raised border border-border rounded-lg text-sm
            text-text-primary placeholder:text-text-muted
            focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
            min-h-[36px]"
        />
      </div>
      <div className="flex gap-1" role="group" aria-label="Filter by rank">
        {ranks.map(({ value, label }) => (
          <ToggleButton
            key={String(value)}
            onClick={() => setRankFilter(value)}
            pressed={rankFilter === value}
          >
            {label}
          </ToggleButton>
        ))}
      </div>
    </div>
  );
}
