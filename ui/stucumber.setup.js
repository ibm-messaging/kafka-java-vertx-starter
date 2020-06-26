/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { cucumber } from 'gherkin-jest';
import { HookType } from 'stucumber'; //Brought in via 'gherkin-jest'
import { stepDefs as consumerStepDefs } from 'Panels/Consumer/Consumer.steps.js';
import { stepDefs as producerStepDefs } from 'Panels/Producer/Producer.steps.js';
import { stepDefs as appStepDefs } from 'Bootstrap/App/App.steps.js';
import { stepDefs as commonStepDefs } from 'TestUtils/common_stepdefs.testutil.js';

cucumber.defineCreateWorld(() => ({}));
cucumber.addHook(HookType.AfterScenarios, (world) => {
  const { rendered } = world;
  rendered && rendered.unmount;
});
commonStepDefs(cucumber);
consumerStepDefs(cucumber);
producerStepDefs(cucumber);
appStepDefs(cucumber);
