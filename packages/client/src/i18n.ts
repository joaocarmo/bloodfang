import { i18n } from '@lingui/core';
import { messages } from './locales/en-GB/messages';

i18n.load('en-GB', messages);
i18n.activate('en-GB');

export { i18n };
