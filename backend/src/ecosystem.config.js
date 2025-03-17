module.exports = {
  apps: [
    {
      name: "peaceforce",
      script: "./src/server.ts",
      interpreter: "ts-node",
      interpreter_args: "-r tsconfig-paths/register", // This loads tsconfig-paths
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
