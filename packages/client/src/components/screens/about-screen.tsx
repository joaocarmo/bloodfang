import { t } from '@lingui/core/macro';
import { APP_VERSION } from '../../version.ts';
import { BackButton } from '../ui/back-button.tsx';

export function AboutScreen() {
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
        {t`About`}
      </h1>

      <dl className="flex flex-col gap-4 text-text-secondary">
        <div>
          <dt className="font-medium text-text-primary">{t`Author`}</dt>
          <dd>@joaocarmo</dd>
        </div>
        <div>
          <dt className="font-medium text-text-primary">{t`Version`}</dt>
          <dd>{APP_VERSION}</dd>
        </div>
        <div>
          <dt className="font-medium text-text-primary">{t`Licence`}</dt>
          <dd>{t`MIT — Copyright (c) 2026 Blood Fang Contributors`}</dd>
        </div>
      </dl>
    </main>
  );
}
