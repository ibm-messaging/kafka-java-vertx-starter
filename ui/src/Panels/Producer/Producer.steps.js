/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import {
  render,
  waitFor,
  fireEvent,
  useFakeTimers,
  within,
  confirmHasClassNames,
} from 'TestUtils';
import { act } from 'react-dom/test-utils';
import { Producer } from './index.js';
import { producerMockWebsocketForTest } from './Producer.assets.js';

const topicName = 'test';

export const stepDefs = (cucumber) => {
  cucumber.defineRule('I have a Producer panel', async (world) => {
    world.mockSocketOnStart = jest.fn();
    world.mockSocket = producerMockWebsocketForTest(world.mockSocketOnStart);
    world.component = render(
      <Producer
        getProducerWebsocket={world.mockSocket.getSocket}
        topic={topicName}
      />
    );
    await act(async () => {
      // open the websocket
      world.mockSocket.triggerOpen();
      const { getByTestId } = world.component;
      // wait for the websocket to be come live
      await waitFor(() => {
        expect(getByTestId('producer_button')).toBeInTheDocument();
        expect(getByTestId('producer_button')).not.toBeDisabled();
      });
    });
  });

  cucumber.defineRule('Error responses are returned', (world) => {
    act(() => {
      // emulate an error coming back
      world.mockSocket.sendErrorPayload();
    });
  });

  cucumber.defineRule('responses are returned', (world) => {
    act(() => {
      // emulate an response
      world.mockSocket.sendPayload();
    });
  });

  cucumber.defineRule(
    'I have produced {string} messages already',
    (world, count) => {
      act(() => {
        // emulate the count number of messages
        for (let i = 0; i < Number(count); i++) {
          world.mockSocket.sendPayload();
        }
      });
    }
  );

  cucumber.defineRule('the producer is running', (world) => {
    const { getByText } = world.component;
    expect(getByText('Stop producing')).toBeInTheDocument();
  });

  cucumber.defineRule('the producer is not running', (world) => {
    const { getByText } = world.component;
    expect(getByText('Start producing')).toBeInTheDocument();
  });

  cucumber.defineRule('I start the producer', async (world) => {
    await act(async () => {
      const { getByTestId, getByText } = world.component;
      expect(getByTestId('producer_button')).toBeInTheDocument();
      expect(getByText('Start producing')).toBeInTheDocument();
      fireEvent.click(getByTestId('producer_button'));
      // wait for the websocket to start
      await waitFor(() => {
        expect(getByText('Stop producing')).toBeInTheDocument();
      });
    });
  });

  cucumber.defineRule('I stop the producer', async (world) => {
    await act(async () => {
      const { getByTestId, getByText } = world.component;
      expect(getByTestId('producer_button')).toBeInTheDocument();
      expect(getByText('Stop producing')).toBeInTheDocument();
      fireEvent.click(getByTestId('producer_button'));
      // wait for the websocket to stop
      await waitFor(() => {
        expect(getByText('Start producing')).toBeInTheDocument();
      });
    });
  });

  cucumber.defineRule(
    'I set the message value to {string}',
    async (world, customMessageValue) => {
      await act(async () => {
        world.fakeTime = useFakeTimers();
        const { getByPlaceholderText } = world.component;
        const valueInput = getByPlaceholderText(
          'Enter your message value here'
        );
        expect(valueInput).toBeInTheDocument();
        fireEvent.change(valueInput, { target: { value: customMessageValue } });
        // use the fake timer to ensure the debounced setter from the useState hook is called.
        world.fakeTime.tick(101);
        world.fakeTime.restore();
      });
    }
  );

  cucumber.defineRule(
    'it should display statistics about what has been produced',
    async (world) => {
      await act(async () => {
        const { getByTestId, getByText, getAllByTestId } = world.component;
        expect(getByTestId('producer_stats')).toBeInTheDocument();
        expect(getByText('Messages produced')).toBeInTheDocument();
        expect(getByText(`to topic: ${topicName}`)).toBeInTheDocument();
        // wait for the count string to update/that we have that many messages
        await waitFor(() => {
          expect(getAllByTestId('producer_produced_message').length).toBe(1);
          expect(getByText('01')).toBeInTheDocument();
        });
      });
    }
  );

  cucumber.defineRule(
    'I should be shown error messages for those production failures',
    async (world) => {
      await act(async () => {
        const { getByText, getAllByTestId } = world.component;
        // wait for the number of messages to increase, but the count (of successful production remains the same)
        await waitFor(() => {
          expect(getAllByTestId('producer_produced_message').length).toBe(1);
          expect(getByText('00')).toBeInTheDocument();
        });
      });
    }
  );

  cucumber.defineRule(
    'I should be able to see the last {string} messages that have been produced',
    async (world, expectedNumberOfMessages) => {
      await act(async () => {
        const { getByText, getAllByTestId } = world.component;
        const count = Number(expectedNumberOfMessages);
        await waitFor(() => {
          expect(getAllByTestId('producer_produced_message').length).toBe(
            count
          );
          // confirm that with count + 1 we have an accurate count, but only count messages rendered
          expect(getByText(`0${count + 1}`)).toBeInTheDocument();
        });
      });
    }
  );

  cucumber.defineRule('the message value input is disabled', async (world) => {
    await act(async () => {
      const { getByPlaceholderText } = world.component;
      expect(
        getByPlaceholderText('Enter your message value here')
      ).toBeDisabled();
    });
  });

  cucumber.defineRule(
    'the producer has been started with {string} as the message value',
    async (world, expectedMessageValue) => {
      await act(async () => {
        // confirm that a messages with the value were produced to the socket
        await waitFor(() => {
          expect(world.mockSocketOnStart).toHaveBeenCalledWith(
            JSON.stringify({
              custom: expectedMessageValue,
              action: 'start',
            })
          );
        });
      });
    }
  );

  cucumber.defineRule(
    'I hover on produced message {string}',
    async (world, count) => {
      await act(async () => {
        const { getAllByTestId } = world.component;
        const messageWanted = Number(count);
        let messageToInteractWith;
        // wait for it to appear
        await waitFor(() => {
          expect(
            getAllByTestId('producer_produced_message').length
          ).toBeGreaterThan(messageWanted);
          const message = getAllByTestId('producer_produced_message')[
            messageWanted - 1
          ];

          messageToInteractWith = within(message).getByTestId(
            'produced_message_tile'
          );
          expect(messageToInteractWith).toBeInTheDocument();
        });
        // hover on it
        fireEvent.mouseOver(messageToInteractWith);
      });
    }
  );

  cucumber.defineRule(
    'I click on produced message {string}',
    async (world, count) => {
      await act(async () => {
        const { getAllByTestId } = world.component;
        const messageWanted = Number(count);
        let messageToInteractWith;
        // wait for it to appear
        await waitFor(() => {
          expect(
            getAllByTestId('producer_produced_message').length
          ).toBeGreaterThan(messageWanted);
          const message = getAllByTestId('producer_produced_message')[
            messageWanted - 1
          ];

          messageToInteractWith = within(message).getByTestId(
            'produced_message_tile'
          );
          expect(messageToInteractWith).toBeInTheDocument();
        });
        // click it
        fireEvent.click(messageToInteractWith);
      });
    }
  );

  cucumber.defineRule(
    'produced message {string} is shown as selected',
    async (world, count) => {
      await act(async () => {
        const { getAllByTestId } = world.component;
        const messageWanted = Number(count);
        // wait for it to appear
        await waitFor(() => {
          expect(
            getAllByTestId('producer_produced_message').length
          ).toBeGreaterThan(messageWanted);
        });
        const message = getAllByTestId('producer_produced_message')[
          messageWanted - 1
        ];
        expect(message).toBeInTheDocument();
        // confirm it has the classname expected
        expect(
          within(message).getByText(
            confirmHasClassNames(
              'Message',
              'Message--producer',
              'Message--producer-selected'
            )
          )
        ).toBeInTheDocument();
      });
    }
  );
};
