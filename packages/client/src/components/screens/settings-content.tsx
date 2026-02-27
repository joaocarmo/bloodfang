import type { ReactNode } from 'react';
import { t } from '@lingui/core/macro';
import { Locale } from '../../i18n.ts';
import { Theme } from '../../theme.ts';
import { GameMode } from '../../game-mode.ts';

export function LanguageSetting() {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="language-select" className="text-text-secondary font-medium">
        {t`Language`}
      </label>
      <select
        id="language-select"
        disabled
        defaultValue={Locale.EnGb}
        className="bg-surface-raised border border-border rounded-lg px-4 py-2 text-text-primary
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value={Locale.EnGb}>English (GB)</option>
      </select>
      <p className="text-text-muted text-sm">{t`More languages coming soon.`}</p>
    </div>
  );
}

export function ThemeSetting() {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="theme-select" className="text-text-secondary font-medium">
        {t`Theme`}
      </label>
      <select
        id="theme-select"
        disabled
        defaultValue={Theme.Dark}
        className="bg-surface-raised border border-border rounded-lg px-4 py-2 text-text-primary
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value={Theme.Dark}>{t`Dark`}</option>
      </select>
      <p className="text-text-muted text-sm">{t`More themes coming soon.`}</p>
    </div>
  );
}

export function GameModeSetting() {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="game-mode-select" className="text-text-secondary font-medium">
        {t`Game Mode`}
      </label>
      <select
        id="game-mode-select"
        disabled
        defaultValue={GameMode.PvpLocal}
        className="bg-surface-raised border border-border rounded-lg px-4 py-2 text-text-primary
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value={GameMode.PvpLocal}>{t`PvP — Same Device`}</option>
        <option value={GameMode.PvpOnline}>{t`PvP — Online`}</option>
        <option value={GameMode.PvAi}>{t`Player vs AI`}</option>
      </select>
      <p className="text-text-muted text-sm">{t`Additional game modes coming soon.`}</p>
    </div>
  );
}

interface SettingsContentProps {
  children?: ReactNode;
}

export function SettingsContent({ children }: SettingsContentProps) {
  return <div className="flex flex-col gap-6">{children}</div>;
}
