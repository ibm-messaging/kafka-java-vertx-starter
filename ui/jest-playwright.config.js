module.exports = {
  serverOptions: [
    {
      command: 'npm run start',
      port: 8080,
      launchTimeout: 30000,
    },
  ],
  launchOptions: {
    headless: true,
  },
  browsers: ['firefox', 'webkit', 'chromium'],
};
