import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@logic': path.resolve(__dirname, 'src/logic'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
  server: {
    open: true,
  },
});
