module.exports = {
  server: [
    {
      command: 'npm run start',
      port: 8080,
      launchTimeout: 30000,
    },
  ],
  launchBrowserApp: {
    headless: true,
  },
  browsers: ['chromium', 'firefox', 'webkit'],
};
