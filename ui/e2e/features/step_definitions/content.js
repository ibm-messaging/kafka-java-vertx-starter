export const bootstrap = (cucumber) => {
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
