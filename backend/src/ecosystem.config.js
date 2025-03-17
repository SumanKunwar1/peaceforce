module.exports = {
  apps: [
    {
      name: "peaceforce-app",
      script: "./src/server.ts",
      interpreter: "ts-node",
      interpreter_args: "-r tsconfig-paths/register", // Ensures tsconfig-paths is loaded
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
