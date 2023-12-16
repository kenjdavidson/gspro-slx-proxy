import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: 'src/renderer',
    include: ['**/*.{test,spec}.ts?(x)'],
    setupFiles: ['./__tests__/setupTests.ts'],
    globals: true,
    environment: 'jsdom',
  },
});
