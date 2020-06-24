import React from 'react';
import { ProducerMessages, ConsumerMessages } from './index.js';
import { testMessages, STATUS_ERROR } from './Messages.assets.js';
import { render } from 'TestUtils';
import { ConsumerMessage, ProducerMessage } from 'Elements';

describe('Messages Element component', () => {
  const testClassName = 'testCssClass';

  const confirmHasClassNames = (...classNamesExpected) => (content, node) =>
    classNamesExpected.every((className) => node.classList.contains(className)); // has all the expected classnames

  describe('ConsumerMessages component', () => {
    it('renders the expected component when provided child content', () => {
      const { getAllByText, getByText } = render(
        <ConsumerMessages>
          {testMessages.map((msg, index) => (
            <ConsumerMessage
              key={`m-${index}`}
              isFirst={index === 0}
              error={
                msg.status === STATUS_ERROR ? { message: 'Error!' } : undefined
              }
              message={msg.status !== STATUS_ERROR ? msg : undefined}
            />
          ))}
        </ConsumerMessages>
      );
      expect(
        getByText(confirmHasClassNames('Messages', 'Messages--consumer'))
      ).toBeInTheDocument();
      expect(
        getAllByText(confirmHasClassNames('Message', 'Message--consumer'))
          .length
      ).toBe(4);
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-first'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--consumer',
            'Message--consumer-error'
          )
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with a custom class name', () => {
      const { getByText } = render(
        <ConsumerMessages className={testClassName} />
      );
      expect(
        getByText(
          confirmHasClassNames('Messages', 'Messages--consumer', testClassName)
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with an empty messages list', () => {
      const { getByText } = render(<ConsumerMessages />);
      expect(
        getByText(
          confirmHasClassNames(
            'Messages',
            'Messages--consumer',
            'Messages--consumer-empty'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames('Messages__empty', 'Messages__empty--consumer')
        )
      ).toBeInTheDocument();
    });
  });

  describe('ProducerMessages component', () => {
    it('renders the expected component', () => {
      const { getAllByText, getByText } = render(
        <ProducerMessages>
          {testMessages.map((msg, index) => (
            <ProducerMessage
              key={`m-${index}`}
              isFirst={index === 0}
              error={
                msg.status === STATUS_ERROR ? { message: 'Error!' } : undefined
              }
              message={msg.status !== STATUS_ERROR ? msg : undefined}
            />
          ))}
        </ProducerMessages>
      );
      expect(
        getByText(confirmHasClassNames('Messages', 'Messages--producer'))
      ).toBeInTheDocument();
      expect(
        getAllByText(confirmHasClassNames('Message', 'Message--producer'))
          .length
      ).toBe(4);
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--producer',
            'Message--producer-first'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames(
            'Message',
            'Message--producer',
            'Message--producer-error'
          )
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with a custom class name', () => {
      const { getByText } = render(
        <ProducerMessages className={testClassName} />
      );
      expect(
        getByText(
          confirmHasClassNames('Messages', 'Messages--producer', testClassName)
        )
      ).toBeInTheDocument();
    });

    it('renders the expected component with an empty messages list', () => {
      const { getByText } = render(<ProducerMessages />);
      expect(
        getByText(
          confirmHasClassNames(
            'Messages',
            'Messages--producer',
            'Messages--producer-empty'
          )
        )
      ).toBeInTheDocument();
      expect(
        getByText(
          confirmHasClassNames('Messages__empty', 'Messages__empty--producer')
        )
      ).toBeInTheDocument();
    });
  });
});
