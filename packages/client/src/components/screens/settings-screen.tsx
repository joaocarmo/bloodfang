import { t } from '@lingui/core/macro';
import { Locale } from '../../i18n.ts';
import { BackButton } from '../ui/back-button.tsx';

export function SettingsScreen() {
  return (
    <main
      tabIndex={-1}
      className="flex flex-col gap-8 p-4 sm:p-6 md:p-8 max-w-2xl mx-auto outline-none"
    >
      <BackButton />

      <h1
        tabIndex={-1}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary outline-none"
      >
        {t`Settings`}
      </h1>

      <div className="flex flex-col gap-6">
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

        <div className="flex flex-col gap-2">
          <label htmlFor="theme-select" className="text-text-secondary font-medium">
            {t`Theme`}
          </label>
          <select
            id="theme-select"
            disabled
            defaultValue="dark"
            className="bg-surface-raised border border-border rounded-lg px-4 py-2 text-text-primary
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="dark">{t`Dark`}</option>
          </select>
          <p className="text-text-muted text-sm">{t`More themes coming soon.`}</p>
        </div>
      </div>
    </main>
  );
}
