/**
 * Test helpers — re-exports internals that integration tests in other packages need.
 * Not part of the production bundle; consumed only by vitest.
 */

export type { AppInstance, AppOptions } from './app.js';
export { createApp } from './app.js';
export { Route } from './routes.js';
