/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const babelPresets = require('./babelPresets.js');

module.exports = (api) => {
  const isTest = api.env('test');
  let config = {};
  if (isTest) {
    config = {
      presets: babelPresets,
    };
  }

  return config;
};
