describe('initial runs', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8080');
  });

  it('should display something', async () => {
    await expect(page).toHaveText('soon');
  });
});
