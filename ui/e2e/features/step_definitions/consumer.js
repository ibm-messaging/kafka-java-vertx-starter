const stepDefs = (cucumber) => {
  cucumber.defineRule('I start the consumer', async () => {
    await page.click('css=[aria-label="Start consuming messages"]');
  });

  cucumber.defineRule('I stop the consumer', async () => {
    await page.click('css=[aria-label="Stop consuming messages"]');
  });

  cucumber.defineRule('a message appears in the consumer list', async () => {
    await page.waitForSelector('css=[aria-label="Consumed message"]');
  });

  cucumber.defineRule(
    'a message appears in the consumer list with payload {string}',
    async (world, content) => {
      world.consumedMessage = await page.waitForSelector(
        `css=[aria-label="Consumed message"] >> text="${content}"`
      );
    }
  );
  cucumber.defineRule('I hover over the consumed message', async (world) => {
    const { consumedMessage } = world;
    await consumedMessage.hover();
  });
};

export { stepDefs };
