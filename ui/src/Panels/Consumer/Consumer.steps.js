import React from 'react';
import {
  render,
  waitFor,
  fireEvent,
  confirmHasClassNames,
  within,
} from 'TestUtils';
import { act } from 'react-dom/test-utils';
import { Consumer } from './index.js';
import { consumerMockWebsocketForTest } from './Consumer.assets.js';

const topicName = 'test';

export const stepDefs = (cucumber) => {
  cucumber.defineRule('I have a Consumer panel', async (world) => {
    world.mockSocket = consumerMockWebsocketForTest();
    world.component = render(
      <Consumer
        getConsumerWebsocket={world.mockSocket.getSocket}
        topic={topicName}
      />
    );
    await act(async () => {
      // open the websocket
      world.mockSocket.triggerOpen();
      const { getByTestId } = world.component;
      // wait for the websocket to be come live
      await waitFor(() => {
        expect(getByTestId('consumer_button')).toBeInTheDocument();
        expect(getByTestId('consumer_button')).not.toBeDisabled();
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
    'I have received {string} messages already',
    (world, count) => {
      act(() => {
        // emulate the count number of messages
        for (let i = 0; i < Number(count); i++) {
          world.mockSocket.sendPayload();
        }
      });
    }
  );

  cucumber.defineRule('the consumer is running', (world) => {
    const { getByText } = world.component;
    expect(getByText('Stop consuming')).toBeInTheDocument();
  });

  cucumber.defineRule('the consumer is not running', (world) => {
    const { getByText } = world.component;
    expect(getByText('Start consuming')).toBeInTheDocument();
  });

  cucumber.defineRule('I start the consumer', async (world) => {
    await act(async () => {
      const { getByTestId, getByText } = world.component;
      expect(getByTestId('consumer_button')).toBeInTheDocument();
      expect(getByText('Start consuming')).toBeInTheDocument();
      fireEvent.click(getByTestId('consumer_button'));
      // wait for the websocket to start
      await waitFor(() => {
        expect(getByText('Stop consuming')).toBeInTheDocument();
      });
    });
  });

  cucumber.defineRule('I stop the consumer', async (world) => {
    await act(async () => {
      const { getByTestId, getByText } = world.component;
      expect(getByTestId('consumer_button')).toBeInTheDocument();
      expect(getByText('Stop consuming')).toBeInTheDocument();
      fireEvent.click(getByTestId('consumer_button'));
      // wait for the websocket to stop
      await waitFor(() => {
        expect(getByText('Start consuming')).toBeInTheDocument();
      });
    });
  });

  cucumber.defineRule(
    'it should display statistics about what has been consumed',
    async (world) => {
      await act(async () => {
        const { getByTestId, getByText, getAllByTestId } = world.component;
        expect(getByTestId('consumer_stats')).toBeInTheDocument();
        expect(getByText('Messages consumed')).toBeInTheDocument();
        expect(getByText(`from topic: ${topicName}`)).toBeInTheDocument();
        // wait for the count string to update/that we have that many messages
        await waitFor(() => {
          expect(getAllByTestId('consumer_consumed_message').length).toBe(1);
          expect(getByText('01')).toBeInTheDocument();
        });
      });
    }
  );

  cucumber.defineRule(
    'I should be shown error messages for those consumption failures',
    async (world) => {
      await act(async () => {
        const { getByText, getAllByTestId } = world.component;
        // wait for the number of messages to increase, but the count (of successful consumption remains the same)
        await waitFor(() => {
          expect(getAllByTestId('consumer_consumed_message').length).toBe(1);
          expect(getByText('00')).toBeInTheDocument();
        });
      });
    }
  );

  cucumber.defineRule(
    'I should be able to see the last {string} messages that have been consumed',
    async (world, expectedNumberOfMessages) => {
      await act(async () => {
        const { getByText, getAllByTestId } = world.component;
        const count = Number(expectedNumberOfMessages);
        // confirm that with count + 1 we have an accurate count, but only count messages rendered
        await waitFor(() => {
          expect(getAllByTestId('consumer_consumed_message').length).toBe(
            count
          );
          expect(getByText(`${count + 1}`)).toBeInTheDocument();
        });
      });
    }
  );

  cucumber.defineRule(
    'I click on consumed message {string}',
    async (world, count) => {
      await act(async () => {
        const { getAllByTestId } = world.component;
        const messageWanted = Number(count);
        let messageToInteractWith;
        // wait for it to appear
        await waitFor(() => {
          expect(
            getAllByTestId('consumer_consumed_message').length
          ).toBeGreaterThan(messageWanted);
          const message = getAllByTestId('consumer_consumed_message')[
            messageWanted - 1
          ];
          messageToInteractWith = within(message).getByRole('button');
        });
        // click it
        fireEvent.click(messageToInteractWith);
      });
    }
  );

  cucumber.defineRule(
    'I hover on consumed message {string}',
    async (world, count) => {
      await act(async () => {
        const { getAllByTestId } = world.component;
        const messageWanted = Number(count);
        let messageToInteractWith;
        // wait for it to appear
        await waitFor(() => {
          expect(
            getAllByTestId('consumer_consumed_message').length
          ).toBeGreaterThan(messageWanted);
          const message = getAllByTestId('consumer_consumed_message')[
            messageWanted - 1
          ];
          messageToInteractWith = within(message).getByRole('button');
        });
        // hover on it
        fireEvent.mouseOver(messageToInteractWith);
      });
    }
  );

  cucumber.defineRule(
    'consumed message {string} is shown as selected',
    async (world, count) => {
      await act(async () => {
        const { getAllByTestId } = world.component;
        const messageWanted = Number(count);
        // wait for it to appear
        await waitFor(() => {
          expect(
            getAllByTestId('consumer_consumed_message').length
          ).toBeGreaterThan(messageWanted);
        });
        const message = getAllByTestId('consumer_consumed_message')[
          messageWanted - 1
        ];
        expect(message).toBeInTheDocument();
        // confirm it has the classname expected
        expect(
          within(message).getByText(
            confirmHasClassNames(
              'Message',
              'Message--consumer',
              'Message--consumer-selected'
            )
          )
        ).toBeInTheDocument();
      });
    }
  );
};
