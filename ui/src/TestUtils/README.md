# Test utils

The TestUtils directory contains helper code and functions to help enable
testing. Do note that _none of the code in this directory should be used
or referenced in the built/shipped UI code._ It should be used in the tests
for the built/shipped UI code however.

Details regarding the approaches and terminology around test can be found
[here](../../docs/Test.md). This readme details code used to enable
testing for this UI.

## Files in this directory

As mentioned, files found in this directory are helper functions and utilities
to make writing and maintating tests as easy as possible. If the barriers to
entry for writing and working with tests are lowered, implementation can be
achieved faster, at higher quality, and be more focused on what the user
experience is expected.

For a new test helper or utility function, eg `TestHelper`, the expected
structure is as follows:

```
src/
    TestUtils/
        index.js
        TestHelper.testutil.js
```

where; - `index.js` is the top level module where all utils are exported.
When implemented, `TestHelper` would be added to that index.js for use
across the UI. - `*.testutil.js` is the utility module/function

## Available helpers

- rtl - react test library is provided to you via TestUtils - no need to import
it per test file. It also adds helpful capabilities on top of the core RTL
implementation. Includes core RTL, `expect()` extensions, the hooks package,
and a helper function, `mountHook` which will mount and return a hook ready for
testing.
- server - functions which can be called which return the various shapes
  returned by the backend. See comments in the file for more details.
- MockWebSocket - a class that can be used in place of a real WebSocket.
- `sinon` is imported fully from this set of helpers - useful for items such
as controlling time.
