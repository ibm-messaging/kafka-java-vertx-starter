const stepDefs = (cucumber) => {
  cucumber.defineRule('I start the producer', async () => {
    await page.click('css=[aria-label="Start producing messages"]');
  });

  cucumber.defineRule('I stop the producer', async () => {
    await page.click('css=[aria-label="Stop producing messages"]');
  });

  cucumber.defineRule('a message appears in the producer list', async () => {
    await page.waitForSelector('css=[aria-label="Produced message"]');
  });

  cucumber.defineRule(
    'I set the payload to {string}',
    async (world, payload) => {
      await page.fill('*label >> text="Message payload"', payload);
    }
  );

  cucumber.defineRule(
    'a message appears in the producer list with payload {string}',
    async (world, content) => {
      world.producedMessage = await page.waitForSelector(
        `css=[aria-label="Produced message"] >> text="${content}"`
      );
    }
  );

  cucumber.defineRule('I hover over that message', async (world) => {
    const { producedMessage } = world;
    producedMessage.hover();
  });

  cucumber.defineRule('the produced message is highlighted', async (world) => {
    const { consumedMessage } = world;
    const offset = await consumedMessage.textContent('data-test-id=offset');
    const partition = await consumedMessage.textContent(
      'data-test-id=partition'
    );
    const producedMessage = await page.$eval(
      'css=[aria-label="Produced message"]',
      async (messages, { offset: cOffset, partition: cPartition }) => {
        return messages.find(async (messageEl) => {
          const offset = await messageEl.textContent('data-test-id=offset');
          const partition = await consumedMessage.textContent(
            'data-test-id=partition'
          );
          return offset === cOffset && partition === cPartition;
        });
      },
      { offset, partition }
    );
    expect(
      (await producedMessage.getAttribute('class')).contains('highlighted')
    ).toBe(true);
  });
};

export { stepDefs };
