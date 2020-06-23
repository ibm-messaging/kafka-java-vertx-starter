# React Contexts

React contexts allow for mutable data to be stored and read by any component
without needing to worry about prop-drilling. Any data that needs to be
accessed globally (such as a higher level config) should be turning into a
context.

## Test approach

Contexts should be designed and tested as a developer would use them. Ergo, tests
should be written with the end user in mind, covering the cases/behaviours they 
would use it in.

## File structure

For a new custom context `MyContext`, the expected file structure is:

```
src/
    Contexts/
        index.js
        MyContext/
            README.md
            MyContext.spec.js
            MyContext.context.js
```

where;
- `index.js` is the top level module where all contexts are exported.
When implemented, `MyContext` would be added to that index.js for use
across the UI.
- `README.md` is the documentation/design doc for this context
- `*.spec.js` are the tests for this context
- `*.context.js` is the context implementation itself

## List of custom contexts implemented

- [ConfigContext](./ConfigContext/README.md)