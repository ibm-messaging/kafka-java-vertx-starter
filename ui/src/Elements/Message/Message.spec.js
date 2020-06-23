import React from 'react';
import { ProducerMessage, ConsumerMessage } from './index.js';
import { render, fireEvent } from 'TestUtils';

describe('Message Element component', () => {
  const testClassName = 'testCssClass';
  const testTimestamp = new Date();
  const testTimestampLocaleStringRegex = new RegExp(
    `.*${testTimestamp.toLocaleString()}`
  );
  const testValue = 'Test value data';
  const testValueSizeRegex = new RegExp(`.*\\s${testValue.length}\\s`);
  const testMessage = {
    topic: 'demo',
    partition: 2,
    offset: 1000,
    timestamp: testTimestamp.getTime(),
    value: testValue,
  };
  const testError = {
    message: 'Test error',
  };

  const confirmHasClassNames = (...classNamesExpected) => (content, node) =>
    classNamesExpected.every((className) => node.classList.contains(className)); // has all the expected classnames

  describe('ConsumerMessage component', () => {
    it('renders the expected component', () => {
      const { getByText } = render(<ConsumerMessage message={testMessage} />);
      expect(
        getByText(confirmHasClassNames('Message', 'Message--consumer'))
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
      expect(getByText(testTimestampLocaleStringRegex)).toBeInTheDocument();
      expect(getByText(testMessage.value)).toBeInTheDocument();
      expect(getByText(testValueSizeRegex)).toBeInTheDocument();
    });

    it('renders the expected component with a custom class name', () => {
      const { getByText } = render(
        <ConsumerMessage message={testMessage} className={testClassName} />
      );
      expect(
        getByText(
          confirmHasClassNames('Message', 'Message--consumer', testClassName)
        )
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
      expect(getByText(testTimestampLocaleStringRegex)).toBeInTheDocument();
      expect(getByText(testMessage.value)).toBeInTheDocument();
      expect(getByText(testValueSizeRegex)).toBeInTheDocument();
    });

    it('renders the expected component with an empty message value', () => {
      const { getByText } = render(
        <ConsumerMessage
          message={{ ...testMessage, value: '' }}
          className={testClassName}
        />
      );
      expect(
        getByText(
          confirmHasClassNames('Message', 'Message--consumer', testClassName)
        )
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
      expect(getByText(testTimestampLocaleStringRegex)).toBeInTheDocument();
      expect(getByText(/.*\s0\s/)).toBeInTheDocument(); // Payload size is 0
    });

    it('renders the expected component with the isFirst flag', () => {
      const { getByText } = render(
        <ConsumerMessage message={testMessage} isFirst />
      );
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-first'
          )
        )
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
      expect(
        getByText(confirmHasClassNames('Message__tag-consumer-first'))
      ).toBeInTheDocument();
    });

    it('renders the expected component with the isSelected flag', () => {
      const { getByText } = render(
        <ConsumerMessage message={testMessage} isSelected />
      );
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-selected'
          )
        )
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
    });

    it('renders the expected component with an interaction handler function', () => {
      const testOnInteraction = jest.fn();
      const { getByText } = render(
        <ConsumerMessage
          message={testMessage}
          onInteraction={testOnInteraction}
        />
      );

      expect(testOnInteraction).toHaveBeenCalledTimes(0);
      fireEvent.click(
        getByText(confirmHasClassNames('Message__tile--consumer'))
      );
      expect(testOnInteraction).toHaveBeenCalledTimes(1);
      expect(testOnInteraction).toHaveBeenCalledWith(
        expect.anything(),
        'consumer',
        testMessage
      );
    });

    it('renders the expected component with an error message', () => {
      const { getByText, queryByText } = render(
        <ConsumerMessage error={testError} />
      );
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-error'
          )
        )
      ).toBeInTheDocument();
      expect(getByText(testError.message)).toBeInTheDocument();
      expect(
        queryByText(testTimestampLocaleStringRegex)
      ).not.toBeInTheDocument();
      expect(
        queryByText(testMessage.offset.toString())
      ).not.toBeInTheDocument();
      expect(
        queryByText(testTimestampLocaleStringRegex)
      ).not.toBeInTheDocument();
      expect(queryByText(testMessage.value)).not.toBeInTheDocument();
      expect(queryByText(testValueSizeRegex)).not.toBeInTheDocument();
    });

    it('renders the expected component with a custom class name and an error message', () => {
      const { getByText } = render(
        <ConsumerMessage error={testError} className={testClassName} />
      );
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-error',
            testClassName
          )
        )
      ).toBeInTheDocument();
    });
  });

  describe('ProducerMessage component', () => {
    it('renders the expected component', () => {
      const { getByText } = render(<ProducerMessage message={testMessage} />);
      expect(
        getByText(confirmHasClassNames('Message', 'Message--producer'))
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
    });

    it('renders the expected component with a custom class name', () => {
      const { getByText } = render(
        <ProducerMessage message={testMessage} className={testClassName} />
      );
      expect(
        getByText(
          confirmHasClassNames('Message', 'Message--producer', testClassName)
        )
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
    });

    it('renders the expected component with the isFirst flag', () => {
      const { getByText } = render(
        <ProducerMessage message={testMessage} isFirst />
      );
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--producer',
            'Message--producer-first'
          )
        )
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
      expect(
        getByText(confirmHasClassNames('Message__tag-producer-first'))
      ).toBeInTheDocument();
    });

    it('renders the expected component with the isSelected flag', () => {
      const { getByText } = render(
        <ProducerMessage message={testMessage} isSelected />
      );
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--producer',
            'Message--producer-selected'
          )
        )
      ).toBeInTheDocument();
      expect(getByText(testMessage.partition.toString())).toBeInTheDocument();
      expect(getByText(testMessage.offset.toString())).toBeInTheDocument();
    });

    it('renders the expected component with an interaction handler function', () => {
      const testOnInteraction = jest.fn();
      const { getByText } = render(
        <ProducerMessage
          message={testMessage}
          onInteraction={testOnInteraction}
        />
      );

      expect(testOnInteraction).toHaveBeenCalledTimes(0);
      fireEvent.click(
        getByText(confirmHasClassNames('Message__tile--producer'))
      );
      expect(testOnInteraction).toHaveBeenCalledTimes(1);
      expect(testOnInteraction).toHaveBeenCalledWith(
        expect.anything(),
        'producer',
        testMessage
      );
    });

    it('renders the expected component with an error message', () => {
      const { getByText, queryByText } = render(
        <ProducerMessage error={testError} />
      );
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--producer',
            'Message--producer-error'
          )
        )
      ).toBeInTheDocument();
      expect(getByText(testError.message)).toBeInTheDocument();
      expect(
        queryByText(testMessage.offset.toString())
      ).not.toBeInTheDocument();
      expect(
        queryByText(testMessage.partition.toString())
      ).not.toBeInTheDocument();
    });
  });
});
