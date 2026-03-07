import { useState } from 'react';
import { t } from '@lingui/core/macro';
import { useReducedMotion } from 'motion/react';
import type { CardId } from '@bloodfang/engine';
import { getCardName, getCardInitials } from '../../lib/card-identity.ts';

interface CardArtProps {
  definitionId: CardId;
  rank: number | string;
  size: 'compact' | 'default' | 'large';
}

export function CardArt({ definitionId, rank, size }: CardArtProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const reduceMotion = useReducedMotion();
  const name = getCardName(definitionId);
  const initials = getCardInitials(definitionId);

  const rankGradient =
    rank === 1
      ? 'from-rank-1/30 to-rank-1/10'
      : rank === 2
        ? 'from-rank-2/30 to-rank-2/10'
        : rank === 3
          ? 'from-rank-3/30 to-rank-3/10'
          : 'from-rank-replacement/30 to-rank-replacement/10';

  const sizeClasses =
    size === 'compact'
      ? 'h-8 sm:h-10'
      : size === 'large'
        ? 'aspect-square'
        : 'h-10 sm:h-12 md:h-14';
  const textSize = size === 'compact' ? 'text-xs' : size === 'large' ? 'text-lg' : 'text-sm';

  return (
    <div className={`relative overflow-hidden rounded bg-surface/50 ${sizeClasses}`}>
      {/* Initials fallback — visible while loading or on error */}
      {status !== 'loaded' && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-b ${rankGradient}`}
          aria-hidden="true"
        >
          <span className={`font-bold ${textSize} text-text-secondary`}>{initials}</span>
        </div>
      )}

      {/* Artwork image */}
      {status !== 'error' && (
        <img
          src={`${import.meta.env.BASE_URL}art/${definitionId}.webp`}
          alt={t`Illustration of ${name}`}
          className={`absolute inset-0 h-full w-full object-cover ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${reduceMotion ? '' : 'transition-opacity duration-200'}`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  );
}
