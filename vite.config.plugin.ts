import path from 'node:path';
import { defineConfig } from 'vite';
import generateFile from 'vite-plugin-generate-file';
import { viteSingleFile } from 'vite-plugin-singlefile';
import figmaManifest from './figma.manifest';

export default defineConfig(({ mode }) => ({
  root: './src/plugin', // plugin 소스 루트 디렉토리 지정
  plugins: [
    viteSingleFile(),
    generateFile({
      type: 'json',
      output: './manifest.json', // manifest 출력 경로 수정
      data: figmaManifest,
    }),
  ],
  build: {
    minify: mode === 'production',
    sourcemap: mode !== 'production' ? 'inline' : false,
    target: 'es2017',
    emptyOutDir: false,
    outDir: path.resolve('dist'),
    rollupOptions: {
      input: path.resolve(__dirname, 'src/plugin/index.ts'),
      output: {
        entryFileNames: 'plugin.js',
      },
    },
  },
}));
