import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  root: './src/ui',
  build: {
    target: 'esnext',
    outDir: '../../dist',
    assetsDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      input: './src/ui/index.html',
      output: {
        entryFileNames: 'ui.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.html') {
            return 'ui.html';
          }
          return assetInfo.name;
        },
      },
    },
  },
  plugins: [react(), viteSingleFile(), svgr()],
});
