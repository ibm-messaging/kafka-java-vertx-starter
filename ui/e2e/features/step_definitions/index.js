import { cucumber } from 'gherkin-jest';
import { stepDefs as navgigation } from './navigation.js';
import { stepDefs as content } from './content.js';
import { stepDefs as producer } from './producer.js';
import { stepDefs as consumer } from './consumer.js';

cucumber.defineCreateWorld(() => ({}));
navgigation(cucumber);
content(cucumber);
producer(cucumber);
consumer(cucumber);
