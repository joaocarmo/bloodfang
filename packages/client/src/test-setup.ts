import '@testing-library/jest-dom/vitest';
import { i18n } from '@lingui/core';
import { messages } from './locales/en-GB/messages';

// Activate Lingui locale so t`` macros resolve to English strings
i18n.load('en-GB', messages);
i18n.activate('en-GB');

// Mock window.matchMedia for Motion's useReducedMotion()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
