const ROOT = 'http://localhost:8080';

export const bootstrap = (cucumber) => {
  cucumber.defineRule('I am on the homepage', async () => {
    await page.goto(ROOT);
  });
};
