import { t } from '@lingui/core/macro';
import { BackButton } from '../ui/back-button.tsx';
import {
  SettingsContent,
  LanguageSetting,
  ThemeSetting,
  GameModeSetting,
} from './settings-content.tsx';

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

      <SettingsContent>
        <LanguageSetting />
        <ThemeSetting />
        <GameModeSetting />
      </SettingsContent>
    </main>
  );
}
