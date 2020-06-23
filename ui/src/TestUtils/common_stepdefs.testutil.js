const parseTableValue = (value) => {
  if (/^[\d]+$/.test(value)) {
    return parseFloat(value);
  }
  if (/^(true)|(false)$/.test(value)) {
    return value === 'true';
  }
  return value;
};

const stepDefs = (cucumber) => {
  cucumber.defineRule('the following properties', (world, table) => {
    world.props = table.asObjects().reduce(
      (props, { Name, Value }) => ({
        ...props,
        [Name]: parseTableValue(Value),
      }),
      {}
    );
  });

  cucumber.defineRule('the page contains {string}', (world, content) => {
    const { getByText } = world.rendered;
    expect(getByText(content, { exact: false })).toBeInTheDocument();
  });

  cucumber.defineRule(
    'the page does not contain {string}',
    (world, content) => {
      const { queryByText } = world.rendered;
      expect(queryByText(content, { exact: false })).toBeNull();
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
