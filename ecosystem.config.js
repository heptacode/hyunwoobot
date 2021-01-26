module.exports = {
  apps: [
    {
      name: "hyunwoobot",
      script: "./dist/app.js",
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
    },
  ],
};
