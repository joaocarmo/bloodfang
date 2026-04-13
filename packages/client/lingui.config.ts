import type { LinguiConfig } from '@lingui/conf';
import { DEFAULT_LOCALE, Locale } from './src/i18n';

const config: LinguiConfig = {
  locales: Object.values(Locale),
  sourceLocale: DEFAULT_LOCALE,
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
};

export default config;
