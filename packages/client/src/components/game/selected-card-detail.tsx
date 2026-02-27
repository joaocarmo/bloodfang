import { t } from '@lingui/core/macro';
import { useGameStore } from '../../store/game-store.ts';
import { Card } from '../card/card.tsx';
import { Button } from '../ui/button.tsx';

export function SelectedCardDetail() {
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const definitions = useGameStore((s) => s.definitions);
  const selectCard = useGameStore((s) => s.selectCard);

  if (!selectedCardId) return null;

  const definition = definitions[selectedCardId];
  if (!definition) return null;

  return (
    <section aria-label={t`Selected card details`} className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">{t`Selected`}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => selectCard(null)}
          aria-label={t`Deselect card`}
        >
          ×
        </Button>
      </div>
      <Card definition={definition} selected />
    </section>
  );
}
