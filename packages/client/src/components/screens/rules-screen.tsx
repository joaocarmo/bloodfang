import { t } from '@lingui/core/macro';
import { BackButton } from '../ui/back-button.tsx';
import { RulesContent, BasicRules, KeyboardShortcuts } from './rules-content.tsx';

export function RulesScreen() {
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
        {t`Rules`}
      </h1>

      <RulesContent>
        <BasicRules />
        <KeyboardShortcuts />
      </RulesContent>
    </main>
  );
}
