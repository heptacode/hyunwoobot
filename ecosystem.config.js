module.exports = {
  apps: [
    {
      name: 'hyunwoobot',
      script: './dist/app.js',
      autorestart: true,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
