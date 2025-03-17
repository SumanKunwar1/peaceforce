module.exports = {
  apps: [
    {
      name: "peaceforce",
      script: "build/server.js",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
