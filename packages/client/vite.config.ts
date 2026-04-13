import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import pkg from './package.json' with { type: 'json' };

const serverUrl = process.env.VITE_SERVER_URL || 'http://localhost:3001';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    // Aligns with packages/client/tsconfig.json `lib: ES2024`. Drops Safari ≤17.3,
    // Chrome ≤117, Firefox ≤119, Edge ≤117 — explicit baseline.
    target: 'es2024',
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    proxy: {
      '/api': {
        target: serverUrl,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    tailwindcss(),
    lingui(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
