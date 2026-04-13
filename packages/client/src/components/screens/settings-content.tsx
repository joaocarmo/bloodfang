import { t } from '@lingui/core/macro';
import { type ReactNode, useState } from 'react';
import { GameMode } from '../../game-mode.ts';
import { Locale } from '../../i18n.ts';
import { useSettingsStore } from '../../store/settings-store.ts';
import { Theme } from '../../theme.ts';
import { Button } from '../ui/button.tsx';
import { ConfirmDialog } from '../ui/confirm-dialog.tsx';

export function ActionLogSetting() {
  const showActionLog = useSettingsStore((s) => s.showActionLog);
  const setShowActionLog = useSettingsStore((s) => s.setShowActionLog);
  const id = 'action-log-toggle';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-text-secondary font-medium">
          {t`Show Action Log`}
        </label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={showActionLog}
          onClick={() => {
            setShowActionLog(!showActionLog);
          }}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full
          border-2 border-transparent transition-colors focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
            showActionLog ? 'bg-p0' : 'bg-border'
          }`}
        >
          <span className="sr-only">{t`Show Action Log`}</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-text-primary shadow
            transition-transform ${showActionLog ? 'translate-x-5' : 'translate-x-0.5'}`}
          />
        </button>
      </div>
      <p className="text-text-muted text-sm">{t`Display a log of game actions during play.`}</p>
    </div>
  );
}

export function LanguageSetting() {
  const locale = useSettingsStore((s) => s.locale);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="language-select" className="text-text-secondary font-medium">
        {t`Language`}
      </label>
      <select
        id="language-select"
        disabled
        value={locale}
        onChange={() => {
          /* noop */
        }}
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
  const theme = useSettingsStore((s) => s.theme);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="theme-select" className="text-text-secondary font-medium">
        {t`Theme`}
      </label>
      <select
        id="theme-select"
        disabled
        value={theme}
        onChange={() => {
          /* noop */
        }}
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
  const gameMode = useSettingsStore((s) => s.gameMode);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="game-mode-select" className="text-text-secondary font-medium">
        {t`Game Mode`}
      </label>
      <select
        id="game-mode-select"
        disabled
        value={gameMode}
        onChange={() => {
          /* noop */
        }}
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

export function ResetSettingsButton() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    localStorage.clear();
    useSettingsStore.persist.clearStorage();
    window.location.reload();
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          variant="danger"
          onClick={() => {
            setConfirmOpen(true);
          }}
        >
          {t`Reset to Defaults`}
        </Button>
        <p className="text-text-muted text-sm">
          {t`Clears all saved settings and local data, restoring everything to its default state.`}
        </p>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={handleReset}
        title={t`Reset to Defaults?`}
        description={t`This will clear all saved settings and local data. The page will reload.`}
        confirmLabel={t`Reset`}
      />
    </>
  );
}

interface SettingsContentProps {
  children?: ReactNode;
}

export function SettingsContent({ children }: SettingsContentProps) {
  return <div className="flex flex-col gap-6">{children}</div>;
}
