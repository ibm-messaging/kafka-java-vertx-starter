# Utils

This directory will contain any common functions used in the UI which are not
React component based (ie meaning a Hook would not suitable). These utilities
are expected to be small helper functions, with comments accompanying them
to descirbe usage. All naming should be clear and perscriptive.

## File structure

For a new utility function or module, eg `MyUtilModule`, the expected structure 
is as follows:

```
src/
    Utils/
        index.js
        MyUtilModule.util.js
        MyUtilModule.spec.js
```

where;
    - `index.js` is the top level module where all utils are exported.
    When implemented, `MyUtilModule` would be added to that index.js for use
    across the UI.
    - `*.util.js` is the utility module/function
    - `*.spec.js` are the tests for this utility

## Currently provided utils

- `idAttributeGenerator` - utility for generating a `data-testid` attribute  - 
mainly used in testing, but useful for identifying elements.
- `idAttributeSelector` - utility to get a `data-testid` attribute - 
mainly used in testing, but useful for identifying elements.