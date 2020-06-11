# Build

The UI is transpiled using Babel, and built with Webpack.

## Treeshaking

We are taking advantage of Webpack's treeshaking to reduce our bundle size.

### Dependencies

If you are adding a new dependency, please try to use one that is in the `ES2015` format where possible - `commonjs` modules cannot benefit from treeshaking to remove unused exports before transpiling. For example, lodash has an `ES2015` alternative module - `lodash-es`. 

When adding an `ES2015` module also update `ui/jest.config.js` to add the module name to the negative regex in `transformIgnorePatterns` option - this ensures Jest knows it will need to transpile the module into `commonjs` for the tests to run.

### First party code

Although we do not currently expect to release this application as a node module, we still want to follow best practices for module development. We have set the `sideEffects` property to `false` in our `package.json` to flag support for whole modules being pruned by Webpack. This occurs when the consuming application does not use all the exports from a dependency.

For example, if the public entrypoint of `mymodule` was 
```
import myfunc from './func1.js';
import mything from './mything.js';
export {myfunc, mything};
```
 
If the only usage of a module in an application is - `import {myfunc} from 'mymodule'` - when `sideEffects = false`, webpack will not include `mything` when it bundles `mymodule` into the application. This means that `mything` is never imported - and as such, any side effects of the import will never occur.

For example: 

```
global.property = 'hello world';
const makeSomething = (value) => {
    doSomethingWithSideEffect(value);
    return {key: value};
};
const thing = makeSomething("myValue");
export {
    thing
}
```

Neither `global.property` will be set or `doSomethingWithSideEffect` is invoked - as the file will never even be imported. If a file has a legitimate need for side effects, the `sideEffects` property in `package.json` can be changed to an array containing the file path to exclude it - e.g `sideEffects: ['path/to/file.js']`.

## Module aliases

We are using Webpack module aliases to remove long paths from our import statements. The alias roots are defined in `ui/moduleAliases.js` - pointing at the top level folders in `src`.

This means - for example you can reference the alias as `import {thing} from 'Panels/MyPanel/index.js'` wherever you are in the project - instead of `import {thing} from '../../../../Panels/MyPanel/index.js'`.

If you add a new folder to `src` it will be automatically aliased. However, if you are using Visual Studio Code - update `ui/jsconfig.json` to include the path so intellisense can resolve the module correctly.