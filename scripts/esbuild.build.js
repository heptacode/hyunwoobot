const build = require('esbuild').build;
const config = require('../esbuild.config').default;

try {
  build({
    ...config,
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
