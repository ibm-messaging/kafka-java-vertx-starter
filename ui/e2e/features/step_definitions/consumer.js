import { getSelector } from './utils.js';

const stepDefs = (cucumber) => {
  cucumber.defineRule('I see no messages have been consumed', async () => {
    await page.waitForSelector(`${getSelector('messages_empty')}`);
  });

  cucumber.defineRule('I start the consumer', async () => {
    await page.waitForSelector(
      `${getSelector('consumer_button')} >> text="Start consuming"`
    );
    await page.click(getSelector('consumer_button'));
  });

  cucumber.defineRule('I stop the consumer', async () => {
    await page.waitForSelector(
      `${getSelector('consumer_button')} >> text="Stop consuming"`
    );
    await page.click(getSelector('consumer_button'));
  });

  cucumber.defineRule('a message appears in the consumer list', async () => {
    await page.waitForSelector(getSelector('consumer_consumed_message'));
  });

  cucumber.defineRule(
    'a message appears in the consumer list with payload {string}',
    async (world, content) => {
      world.consumedMessage = await page.waitForSelector(
        `${getSelector('consumer_consumed_message')} >> text="${content}"`
      );
    }
  );
  cucumber.defineRule('I hover over the consumed message', async (world) => {
    const { consumedMessage } = world;
    await consumedMessage.hover();
  });
};

export { stepDefs };
