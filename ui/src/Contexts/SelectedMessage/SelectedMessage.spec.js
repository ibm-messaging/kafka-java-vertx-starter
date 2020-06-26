/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { render, act, fireEvent } from '../../TestUtils/index.js';
import { SelectedMessageConsumer } from '../index.js';

describe('SelectedMessageContext tests', () => {
  it('expected values are provided to consumers', () => {
    render(
      <SelectedMessageConsumer>
        {({
          currentSelectedMessage,
          updateSelectedMessage,
          isSameAsSelected,
        }) => {
          expect(currentSelectedMessage).toBe(null);
          expect(updateSelectedMessage).toEqual(expect.any(Function));
          expect(isSameAsSelected).toEqual(expect.any(Function));
        }}
      </SelectedMessageConsumer>
    );
  });

  it('consumers can invoke the update function provided, with the value provided being returned next pass as currentSelectedMessage', () => {
    const nextValue = { topic: 'foo', partition: 24, offset: 389 };
    const nextValueAsId = `t:{${nextValue.topic}}-p:{${nextValue.partition}}-o:{${nextValue.offset}}`;
    const { getByText, getByRole } = render(
      <SelectedMessageConsumer>
        {({ currentSelectedMessage, updateSelectedMessage }) => {
          return (
            <button onClick={() => updateSelectedMessage(nextValue)}>
              {`${currentSelectedMessage}`}
            </button>
          );
        }}
      </SelectedMessageConsumer>
    );
    expect(getByText('null')).toBeInTheDocument();
    act(() => {
      fireEvent.click(getByRole('button'));
      expect(getByText(nextValueAsId)).toBeInTheDocument();
    });
  });

  it('consumers can invoke the isSameAsSelected function to check if they have the same message as is in state', () => {
    const nextValue = { topic: 'foo', partition: 24, offset: 389 };
    const { getByText, getByRole } = render(
      <SelectedMessageConsumer>
        {({ updateSelectedMessage, isSameAsSelected }) => {
          return (
            <button onClick={() => updateSelectedMessage(nextValue)}>
              {`${isSameAsSelected(nextValue)}`}
            </button>
          );
        }}
      </SelectedMessageConsumer>
    );
    expect(getByText('false')).toBeInTheDocument();
    act(() => {
      fireEvent.click(getByRole('button'));
      expect(getByText('true')).toBeInTheDocument();
    });
  });
});
