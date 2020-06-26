/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const { mkdir } = require('fs').promises;
const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment')
  .default;
const { saveVideo } = require('playwright-video');

class CustomEnvironment extends PlaywrightEnvironment {
  constructor(props) {
    super(props);
    this.capture;
  }
  async setup() {
    await super.setup();
    const failureOutput = `${__dirname}/failure_output`;
    this.videoPath = `${failureOutput}/videos`;
    await mkdir(this.videoPath, { recursive: true });

    this.browserName = this.global.browserName;
    this.screenshotPath = `${failureOutput}/screenshots/${this.browserName}`;
    await mkdir(this.screenshotPath, { recursive: true });
    this.global.page.setDefaultTimeout(5000);
    this.global.page.setDefaultNavigationTimeout(30000);
  }
  async handleTestEvent(event, state) {
    await super.handleTestEvent(event, state);
    const page = this.global.page;
    let parentName;
    let specName;
    if (event.test) {
      parentName = event.test.parent.name.replace(/\W/g, '-');
      specName = event.test.name.replace(/\W/g, '-');
    }
    switch (event.name) {
      case 'test_start': {
        if (this.browserName === 'chromium') {
          const path = `${this.videoPath}/${parentName}_${specName}.mp4`;
          this.capture = await saveVideo(this.global.page, path);
        }
        break;
      }
      case 'test_done': {
        if (event.test.errors.length > 0) {
          await page.screenshot({
            path: `${this.screenshotPath}/${parentName}_${specName}.png`,
          });
        }
        if (this.browserName === 'chromium') {
          await this.capture.stop();
        }
        break;
      }
      default:
    }
  }
}

module.exports = CustomEnvironment;
