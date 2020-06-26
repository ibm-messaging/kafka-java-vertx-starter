# Dev utils

The DevUtils directory contains helper code and capabilities to enable day 
to day development. The content of this directory should not be used or
referenced by the built/shipped product code. If any module or function is,
it instead should be moved to the `Utils` or `ReactCustomHooks` directories (as
appropriate).

The expected content in this directory will be items such as the mock vertx
server for example.

## Files in this directory

Given the variable nature of the items in this directory, an explicit expected
file structure for all possible files cannot be defined. However, utilities 
should be kept seperate in their own named folders, as shown below.

```
src/
    DevUtils/
        MyUtil/
            file one...
            tile two...
```