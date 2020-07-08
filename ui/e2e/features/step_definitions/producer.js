/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { getSelector } from './utils.js';

const stepDefs = (cucumber) => {
  cucumber.defineRule('I start the producer', async () => {
    await page.waitForSelector(
      `${getSelector('producer_button')} >> text="Start producing"`
    );
    await page.click(getSelector('producer_button'));
  });

  cucumber.defineRule('I stop the producer', async () => {
    await page.waitForSelector(
      `${getSelector('producer_button')} >> text="Stop producing"`
    );
    await page.click(getSelector('producer_button'));
  });

  cucumber.defineRule(
    'a message appears in the producer list',
    async (world) => {
      world.producedMessage = await page.waitForSelector(
        getSelector('producer_produced_message')
      );
    }
  );

  cucumber.defineRule(
    'I set the payload to {string}',
    async (world, payload) => {
      await page.fill(getSelector('producer_value_input'), payload);
      await page.waitForSelector(getSelector('producer_value_input'));
    }
  );

  cucumber.defineRule('I hover over the produced message', async (world) => {
    const { producedMessage } = world;
    await producedMessage.hover();
  });

  cucumber.defineRule('the consumed message is highlighted', async (world) => {
    const { producedMessage } = world;
    const offset = await (
      await producedMessage.$(getSelector('offset'))
    ).textContent();
    const partition = await (
      await producedMessage.$(getSelector('partition'))
    ).textContent();

    const consumedMessage = (
      await page.$$(getSelector('consumer_consumed_message'))
    ).find(async (messageElement) => {
      let cOffset, cPartition;
      try {
        cOffset = await (
          await messageElement.$(getSelector('offset'))
        ).textContent();
        cPartition = await (
          await messageElement.$(getSelector('partition'))
        ).textContent();
      } catch (error) {
        // the message element may get removed while async calls
        // are running if there are more messages than are displayed or
        // a test completes, hence this try/catch block.
      }

      return offset === cOffset && partition === cPartition;
    });

    expect(consumedMessage).not.toBeUndefined();
    expect(
      (await consumedMessage.getAttribute('class')).includes(
        'Message--consumer-selected'
      )
    ).toBe(true);
  });
};

export { stepDefs };
