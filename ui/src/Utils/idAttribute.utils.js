/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const attributeName = 'data-testid';

export const idAttributeGenerator = (id) => ({ [attributeName]: id });
export const idAttributeSelector = (id) => `[${attributeName}="${id}"]`;
