import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@logic': path.resolve(__dirname, 'src/logic'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
