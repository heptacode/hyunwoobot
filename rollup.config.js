import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import run from '@rollup/plugin-run';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
  input: 'src/app.ts',
  output: {
    file: 'src/app.js',
    format: 'esm',
  },
  plugins: [
    alias({
      entries: [{ find: '@', replacement: 'src' }],
    }),
    commonjs(),
    process.env.ROLLUP_WATCH === 'true' && run(),
    typescript(),
  ],
});
