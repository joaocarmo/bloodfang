import { i18n } from '@lingui/core';
import { messages } from './locales/en-GB/messages';

export enum Locale {
  EnGb = 'en-GB',
}

export const DEFAULT_LOCALE = Locale.EnGb;

i18n.load(DEFAULT_LOCALE, messages);
i18n.activate(DEFAULT_LOCALE);

export { i18n };
