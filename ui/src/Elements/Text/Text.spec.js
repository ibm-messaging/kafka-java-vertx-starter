/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import {
  Text,
  Heading,
  Subheading,
  Body,
  Code,
  Label,
  HEADING,
  SUBHEADING,
  BODY,
  CODE,
  LABEL,
} from './index.js';
import { render } from 'TestUtils';

describe('Text Element component', () => {
  const expectedClassNamesForType = {
    HEADING: 'Text--heading',
    SUBHEADING: 'Text--subheading',
    BODY: 'Text--body',
    CODE: 'Text--code',
    LABEL: 'Text--label',
  };
  const text = 'test text here';
  const testClassName = 'testCssClass';

  const confirmHasTextAndClassName = (contentExpected, classNameExpected) => (
    content,
    node
  ) =>
    content === contentExpected && // has the expected content
    node.classList.contains('Text') && // has correct Block class
    node.classList.contains(classNameExpected); // has the expected classname

  it('renders the expected default type if none provided', () => {
    const { getByText } = render(<Text>{text}</Text>);
    expect(
      getByText(
        confirmHasTextAndClassName(text, expectedClassNamesForType[BODY])
      )
    ).toBeInTheDocument();
  });

  it('renders the expected default type if an unrecognised type is provided', () => {
    const { getByText } = render(<Text type={'random'}>{text}</Text>);
    expect(
      getByText(
        confirmHasTextAndClassName(text, expectedClassNamesForType[BODY])
      )
    ).toBeInTheDocument();
  });

  it('with Heading HOC wrapper provides the expected styling', () => {
    const { getByText } = render(<Heading>{text}</Heading>);
    expect(
      getByText(
        confirmHasTextAndClassName(text, expectedClassNamesForType[HEADING])
      )
    ).toBeInTheDocument();
  });

  it('with Subheading HOC wrapper provides the expected styling', () => {
    const { getByText } = render(<Subheading>{text}</Subheading>);
    expect(
      getByText(
        confirmHasTextAndClassName(text, expectedClassNamesForType[SUBHEADING])
      )
    ).toBeInTheDocument();
  });

  it('with Body HOC wrapper provides the expected styling', () => {
    const { getByText } = render(<Body>{text}</Body>);
    expect(
      getByText(
        confirmHasTextAndClassName(text, expectedClassNamesForType[BODY])
      )
    ).toBeInTheDocument();
  });

  it('with Code HOC wrapper provides the expected styling', () => {
    const { getByText } = render(<Code>{text}</Code>);
    expect(
      getByText(
        confirmHasTextAndClassName(text, expectedClassNamesForType[CODE])
      )
    ).toBeInTheDocument();
  });

  it('with Label HOC wrapper provides the expected styling', () => {
    // false posiitive - confusing label with component called Label
    // eslint-disable-next-line jsx-a11y/label-has-for
    const { getByText } = render(<Label>{text}</Label>);
    expect(
      getByText(
        confirmHasTextAndClassName(text, expectedClassNamesForType[LABEL])
      )
    ).toBeInTheDocument();
  });

  [HEADING, SUBHEADING, BODY, CODE, LABEL].forEach((typeToTest) =>
    describe(`renders the expected content when passed the '${typeToTest}' type property with`, () => {
      it('child content', () => {
        const { getByText } = render(<Text type={typeToTest}>{text}</Text>);
        expect(
          getByText(
            confirmHasTextAndClassName(
              text,
              expectedClassNamesForType[typeToTest]
            )
          )
        ).toBeInTheDocument();
      });
      it('child content and a custom class name', () => {
        const { getByText } = render(
          <Text type={typeToTest} className={testClassName}>
            {text}
          </Text>
        );
        expect(
          getByText(
            confirmHasTextAndClassName(
              text,
              expectedClassNamesForType[typeToTest]
            )
          )
        ).toBeInTheDocument();
        expect(
          getByText(confirmHasTextAndClassName(text, testClassName))
        ).toBeInTheDocument();
      });
    })
  );
});
