const build = require('esbuild').build;
const run = require('esbuild-plugin-run').run;
const config = require('../esbuild.config').default;

try {
  build({
    ...config,
    watch: true,
    plugins: [run()],
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
