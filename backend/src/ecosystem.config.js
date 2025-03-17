module.exports = {
  apps: [
    {
      name: "peaceforce",
      script: "./src/server.ts",
      interpreter: "ts-node",
      interpreter_args: "-r tsconfig-paths/register", // This will ensure path aliases are respected
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
