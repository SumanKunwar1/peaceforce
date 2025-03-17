module.exports = {
  apps: [
    {
      name: "peaceforce-app", // Application name
      script: "./src/server.ts", // Entry file (make sure it's correct)
      interpreter: "ts-node", // Use ts-node as the interpreter
      watch: true, // Optional: watch for file changes
      autorestart: true, // Automatically restart the app if it crashes
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
