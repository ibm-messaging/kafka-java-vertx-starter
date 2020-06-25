import { controlledWebsocket } from 'DevUtils/MockWebsocket';
import { CONSTANTS } from 'Utils';
import { mockAppConfig } from './rtl.testutil.js';

const parseTableValue = (value) => {
  if (/^[\d]+$/.test(value)) {
    return parseFloat(value);
  }
  if (/^(true)|(false)$/.test(value)) {
    return value === 'true';
  }
  return value;
};

const specialPropValues = {
  // a mock websocket factory, which returns the right mock socket depending on path
  MOCK_SOCKET_FACTORY: (world) => {
    return (path) => {
      const mockSocket = controlledWebsocket(
        path === mockAppConfig.producerPath
          ? CONSTANTS.PRODUCER
          : CONSTANTS.CONSUMER
      );
      // interact with this in tests to open/close/push messages
      world.mockedSocket = mockSocket;
      return () => mockSocket.getSocket();
    };
  },
};

const stepDefs = (cucumber) => {
  cucumber.defineRule('the following properties', (world, table) => {
    world.props = table.asObjects().reduce((props, { Name, Value }) => {
      const parsedValue = parseTableValue(Value);
      let prop = parsedValue;
      if (specialPropValues[parsedValue]) {
        // we have a special prop value to process. Invoke the function to get the value
        prop = specialPropValues[parsedValue](world);
      }
      return {
        ...props,
        [Name]: prop,
      };
    }, {});
  });

  cucumber.defineRule('the page contains {string}', (world, content) => {
    const { getByText } = world.rendered;
    expect(getByText(content, { exact: true })).toBeInTheDocument();
  });

  cucumber.defineRule(
    'the page does not contain {string}',
    (world, content) => {
      const { queryByText } = world.rendered;
      expect(queryByText(content, { exact: true })).toBeNull();
    }
  );

  cucumber.defineRule(
    'the page contains the image {string}',
    (world, label) => {
      const { getByAltText } = world.rendered;
      expect(getByAltText(label)).toBeInTheDocument();
    }
  );
};

export { stepDefs };
