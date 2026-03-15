import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/protocol.ts', 'src/testing.ts'],
  // Don't bundle — server runs in Node.js with node_modules available
  deps: {
    neverBundle: [/^[^./]/],
  },
});
