import { cucumber } from 'gherkin-jest';
import { bootstrap as Example } from './Example/Example.steps.js';

cucumber.defineCreateWorld(() => ({}));
Example(cucumber);
