const alias = require('esbuild-plugin-alias');
const resolve = require('path').resolve;
const pkg = require(resolve(__dirname, 'package.json'));

exports.default = {
  entryPoints: ['src/app.ts'],
  outfile: 'dist/app.js',
  platform: 'node',
  format: 'cjs',
  target: 'esnext',
  bundle: true,
  minify: true,
  plugins: [
    alias({
      '@': 'src',
    }),
  ],
  external: Object.keys(pkg.dependencies),
};
