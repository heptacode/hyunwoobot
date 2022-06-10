const alias = require('esbuild-plugin-alias');

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
};
