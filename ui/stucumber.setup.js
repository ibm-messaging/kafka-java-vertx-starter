import { cucumber } from 'gherkin-jest';
import { HookType } from 'stucumber'; //Brought in via 'gherkin-jest'
import { stepDefs as exampleStepDefs } from 'Panels/Example/Example.steps.js';
import { stepDefs as appStepDefs } from 'Bootstrap/App/App.steps.js';
import { stepDefs as commonStepDefs } from 'TestUtils/common_stepdefs.testutil.js';

cucumber.defineCreateWorld(() => ({}));
cucumber.addHook(HookType.AfterScenarios, (world) => {
  const { rendered } = world;
  rendered && rendered.unmount;
});
commonStepDefs(cucumber);
exampleStepDefs(cucumber);
appStepDefs(cucumber);
