/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Counter } from './index.js';
import { render } from 'TestUtils';

describe('Counter Group component', () => {
  const title = 'Test title here';
  const subtitle = 'Test subtitle here';
  const count = 123;
  const testClassName = 'testCssClass';

  const confirmHasClassName = (classNameExpected) => (content, node) =>
    node.classList.contains('Counter') && // has correct Block class
    node.classList.contains(classNameExpected); // has the expected classname

  it('renders the expected component', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={count} />
    );
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(subtitle)).toBeInTheDocument();
    expect(getByText(count.toString())).toBeInTheDocument();
  });

  it('renders the expected component with a custom class name', () => {
    const { getByText } = render(
      <Counter
        title={title}
        subtitle={subtitle}
        count={count}
        className={testClassName}
      />
    );
    expect(getByText(confirmHasClassName(testClassName))).toBeInTheDocument();
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(subtitle)).toBeInTheDocument();
    expect(getByText(count.toString())).toBeInTheDocument();
  });

  it('renders the expected component with a zero-padded count', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={5} />
    );
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(subtitle)).toBeInTheDocument();
    expect(getByText('05')).toBeInTheDocument();
  });

  it('renders the expected component with a count greater than countLimit', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={101} countLimit={100} />
    );
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(subtitle)).toBeInTheDocument();
    expect(getByText('100+')).toBeInTheDocument();
  });

  it('renders the expected component with a negative count', () => {
    const { getByText } = render(
      <Counter title={title} subtitle={subtitle} count={-5} />
    );
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(subtitle)).toBeInTheDocument();
    expect(getByText('00')).toBeInTheDocument();
  });
});
