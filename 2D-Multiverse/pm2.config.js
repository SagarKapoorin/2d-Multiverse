module.exports = {
    apps: [
      {
        name: "Http",
        script: "./apps/Http/dist/index.js", 
        env: {
          PORT: 3000, 
        },
      },
      {
        name: "WebSockets",
        script: "./apps/webSockets/dist/index.js",
        env: {
          PORT: 5000,
        },
      },
      {
        name: 'frontend', // Name of your application
        script: 'serve -s dist -l 5173', // Command to run the serve command
        env: {
          PORT: 5173,
        },
      },
    ],
  };
  