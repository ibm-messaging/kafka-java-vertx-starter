/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react/display-name */
import React, { useMemo, Fragment } from 'react';
import { merge } from 'lodash-es';
import commonTranslations from './common.i18n.json';

const DEFAULT_LOCALE = 'en';

const STRIP_INSERT_REGEX = /\${|}/;

export const useTranslate = (
  bundle = {},
  currentLocale = navigator.language
) => {
  return useMemo(() => {
    // calculate the new locale, and get the bundle for it
    const allTranslationBundles = merge({}, commonTranslations, bundle);

    const locale = currentLocale.split(/_|-/)[0];

    const translationsForLocale = allTranslationBundles[locale]
      ? allTranslationBundles[locale]
      : allTranslationBundles[DEFAULT_LOCALE];

    return (key, insertsToProcess = {}, returnAsString = false) => {
      const valueForKey = translationsForLocale[key]
        ? translationsForLocale[key]
        : `${key} provided, but none found for locale ${locale}`;

      // look at the string, and split it on the insert delimiters
      // for a string 'foo ${insert} bar', output will be ['foo ', 'insert', ' bar']
      // check each entry if it matches an insert key. If so, use the insert value,
      // else, use the value from the split
      const parsedValue = valueForKey
        .split(STRIP_INSERT_REGEX)
        .reduce(
          (acc, part) =>
            insertsToProcess[part]
              ? acc.concat([insertsToProcess[part]])
              : acc.concat([part]),
          []
        );
      // if returning a string, iterate through the parsed parts, and stitch it back together.
      // else, return JSX
      return returnAsString ? (
        parsedValue.reduce((acc, nextString) => `${acc}${nextString}`, '')
      ) : (
        <Fragment>{parsedValue}</Fragment>
      );
    };
  }, [bundle, currentLocale]);
};
