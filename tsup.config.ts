import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  clean: true,
  globalName: 'ZiweiGT',
  minify: true,
  sourcemap: true,
});
