import esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';
// const babel = require('esbuild-plugin-babel');
import { run } from 'esbuild-plugin-run';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';

try {
  esbuild.build({
    entryPoints: ['src/app.ts'],
    platform: 'node',
    format: 'cjs',
    bundle: true,
    // minify: true,
    plugins: [
      alias({
        '@': 'src',
      }),
      esbuildPluginNodeExternals({
        packagePaths: 'package.json',
      }),
      // run(),
    ],
    target: 'es6',
    outfile: 'build/app.js',
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
