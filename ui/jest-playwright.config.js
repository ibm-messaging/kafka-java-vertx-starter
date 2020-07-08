/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
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
  browsers: ['firefox', 'chromium'],
};
