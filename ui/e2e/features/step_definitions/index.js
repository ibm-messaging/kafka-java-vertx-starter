import { cucumber } from 'gherkin-jest';
import { bootstrap as navgigation } from './navigation.js';
import { bootstrap as content } from './content.js';

navgigation(cucumber);
content(cucumber);
