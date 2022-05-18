import esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';
import { esbuildPluginNodeExternals } from 'esbuild-plugin-node-externals';
import { run } from 'esbuild-plugin-run';

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
      run(),
    ],
    target: 'es6',
    outfile: 'dist/app.js',
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
