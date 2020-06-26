/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
export const stepDefs = (cucumber) => {
  cucumber.defineRule('the page contains {string}', async (_, content) => {
    await expect(page).toHaveText(content);
  });

  cucumber.defineRule(
    'the page does not contain {string}',
    async (_, content) => {
      await expect(page).not.toHaveText(content);
    }
  );
};
