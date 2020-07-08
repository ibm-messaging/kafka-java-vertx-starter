/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
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

  cucumber.defineRule(
    'a message appears in the consumer list',
    async (world) => {
      world.consumedMessage = await page.waitForSelector(
        getSelector('consumer_consumed_message')
      );
    }
  );

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

  cucumber.defineRule('the produced message is highlighted', async (world) => {
    const { consumedMessage } = world;

    const offset = await (
      await consumedMessage.$(getSelector('offset'))
    ).textContent();
    const partition = await (
      await consumedMessage.$(getSelector('partition'))
    ).textContent();

    const producedMessage = (
      await page.$$(getSelector('producer_produced_message'))
    ).find(async (messageElement) => {
      let pOffset, pPartition;
      try {
        pOffset = await (
          await messageElement.$(getSelector('offset'))
        ).textContent();
        pPartition = await (
          await messageElement.$(getSelector('partition'))
        ).textContent();
      } catch (error) {
        // the message element may get removed while async calls
        // are running if there are more messages than are displayed or
        // a test completes, hence this try/catch block.
      }

      return offset === pOffset && partition === pPartition;
    });

    expect(producedMessage).not.toBeUndefined();
    expect(
      (await producedMessage.getAttribute('class')).includes(
        'Message--producer-selected'
      )
    ).toBe(true);
  });
};

export { stepDefs };
