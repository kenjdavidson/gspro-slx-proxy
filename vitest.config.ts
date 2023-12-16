import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: 'src/common',
    include: ['**/*.{test,spec}.ts'],
    setupFiles: ['./__tests__/setupTests.ts'],
  },
});
