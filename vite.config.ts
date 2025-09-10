import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'index.html'),        // React app
        background: resolve(__dirname, 'src/background/auth_service.js'), // Background
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'background.js'; // output for Chrome
          return 'assets/[name].js';
        },
      },
    },
  },
  base: './',
});
