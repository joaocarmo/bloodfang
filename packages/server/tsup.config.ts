import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/protocol.ts', 'src/testing.ts'],
  format: ['esm'],
  dts: true,
  // Don't bundle — server runs in Node.js with node_modules available
  noExternal: [],
  external: [/^[^./]/],
});
