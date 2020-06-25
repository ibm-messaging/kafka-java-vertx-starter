/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { cucumber } from 'gherkin-jest';
import { stepDefs as navigation } from './navigation.js';
import { stepDefs as content } from './content.js';
import { stepDefs as producer } from './producer.js';
import { stepDefs as consumer } from './consumer.js';

// Increase the Jest timeout. First test to run will
// need time for everything to build
jest.setTimeout(60000); // 60 seconds

cucumber.defineCreateWorld(() => ({}));
navigation(cucumber);
content(cucumber);
producer(cucumber);
consumer(cucumber);
