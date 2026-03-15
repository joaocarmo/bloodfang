/**
 * Test helpers — re-exports internals that integration tests in other packages need.
 * Not part of the production bundle; consumed only by vitest.
 */
export { createApp } from './app.js';
export type { AppOptions, AppInstance } from './app.js';
export { Route } from './routes.js';
