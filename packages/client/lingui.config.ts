import type { LinguiConfig } from '@lingui/conf';

const config: LinguiConfig = {
  locales: ['en-GB'],
  sourceLocale: 'en-GB',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
};

export default config;
