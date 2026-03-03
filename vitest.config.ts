import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
  },
});
