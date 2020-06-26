/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const ROOT = 'http://localhost:8080';

export const stepDefs = (cucumber) => {
  cucumber.defineRule('I am on the homepage', async () => {
    await page.goto(ROOT);
  });
};
