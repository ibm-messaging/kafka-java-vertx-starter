import React from 'react';
import { useTranslate } from '../index.js';
import { idAttributeGenerator } from 'Utils';
import {
  render,
  renderHook,
  act,
  containsTextContentGenerator,
} from 'TestUtils';
import commonTranslations from './common.i18n.json';

const defaultLocale = 'en';
const mockLocale = 'test';
const mockBundle = {
  [mockLocale]: {
    string: 'test one',
    stringWithInsert: 'test ${myinsert}',
    stringWithJsx: 'pre text ${jsx} post text',
  },
};
describe('useTranslate hook', () => {
  it('when provided with no bundle or locale, sensible defaults are applied and we fallback to the default locale', () => {
    const { getResultFromHook } = renderHook(() => useTranslate());
    const translate = getResultFromHook();
    const key = 'YES';
    const expectedString = commonTranslations[defaultLocale][key];
    act(() => {
      const { getByText } = render(translate(key));
      expect(getByText(expectedString)).toBeInTheDocument();
    });
  });
  it('when provided with a bundle, locale and translation key, but the key does not exist in the loaded bundles, a sensible message is returned', () => {
    const { getResultFromHook } = renderHook(() =>
      useTranslate(mockBundle, mockLocale)
    );
    const translate = getResultFromHook();
    const key = 'NOT_EXIST';
    const expectedString = `${key} provided, but none found for locale ${mockLocale}`;
    act(() => {
      const { getByText } = render(translate(key));
      expect(getByText(expectedString)).toBeInTheDocument();
    });
  });

  it('when provided with a bundle, a translation key, but that key is not found in the specified locale, the default locale translated string is returned if there is one', () => {
    const key = 'YES';
    const expectedString = commonTranslations[defaultLocale][key];
    const { getResultFromHook } = renderHook(() =>
      useTranslate(mockBundle, 'random')
    );
    const translate = getResultFromHook();
    act(() => {
      const { getByText } = render(translate(key));
      expect(getByText(expectedString)).toBeInTheDocument();
    });
  });

  it('when provided with a bundle, a translation key, but the key does not exist in any of loaded bundles, a sensible message is returnede', () => {
    const key = 'NOT_EXIST';
    const testLocale = 'random';
    const expectedString = `${key} provided, but none found for locale ${testLocale}`;
    const { getResultFromHook } = renderHook(() =>
      useTranslate(mockBundle, testLocale)
    );
    const translate = getResultFromHook();
    act(() => {
      const { getByText } = render(translate(key));
      expect(getByText(expectedString)).toBeInTheDocument();
    });
  });

  it('when provided with a bundle, locale and translation key, the expected translated string is returned', () => {
    const key = 'string';
    const expectedString = mockBundle[mockLocale][key];
    const { getResultFromHook } = renderHook(() =>
      useTranslate(mockBundle, mockLocale)
    );
    const translate = getResultFromHook();
    act(() => {
      const { getByText } = render(translate(key));
      expect(getByText(expectedString)).toBeInTheDocument();
    });
  });

  it('when provided with a bundle, locale, translation key and insert, the expected translated string is returned', () => {
    const key = 'stringWithInsert';
    const insert = {
      myinsert: key,
    };
    const expectedString = `test ${key}`;
    const { getResultFromHook } = renderHook(() =>
      useTranslate(mockBundle, mockLocale)
    );
    const translate = getResultFromHook();
    act(() => {
      const { getByText } = render(translate(key, insert));
      expect(getByText(expectedString)).toBeInTheDocument();
    });
  });

  it('when provided with a bundle, locale, translation key and insert which is JSX, the expected content is returned', () => {
    const key = 'stringWithJsx';
    const insert = {
      jsx: (
        <strong {...idAttributeGenerator('jsx')} key={'requiredAsNested'}>
          {'important insert'}
        </strong>
      ),
    };
    const expectedString = `pre text important insert post text`;
    const { getResultFromHook } = renderHook(() =>
      useTranslate(mockBundle, mockLocale)
    );
    const translate = getResultFromHook();
    act(() => {
      const { getByText, getByTestId } = render(translate(key, insert));
      const containsTextContent = containsTextContentGenerator(getByText);
      expect(containsTextContent(expectedString)).toBeInTheDocument();
      expect(getByTestId('jsx')).toBeInTheDocument();
    });
  });

  it('when provided with a bundle, locale, translation key and returnAsString = true, the expected content is returned', () => {
    const key = 'string';
    const expectedString = mockBundle[mockLocale][key];
    const { getResultFromHook } = renderHook(() =>
      useTranslate(mockBundle, mockLocale)
    );
    const translate = getResultFromHook();
    // note the true in the translate on the strong element
    act(() => {
      const { getByLabelText } = render(
        translate('stringWithJsx', {
          jsx: (
            <strong
              {...idAttributeGenerator('jsx')}
              key={'requiredAsNested'}
              aria-label={translate(key, {}, true)}
            >
              {'important insert'}
            </strong>
          ),
        })
      );
      expect(getByLabelText(expectedString)).toBeInTheDocument();
    });
  });
});
