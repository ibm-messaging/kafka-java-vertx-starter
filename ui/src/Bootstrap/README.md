# Bootstrap

The Bootstrap directory contains code which bootstraps the UI. This will include
the application entry point from a build perspective ([build documentation](../../docs/Build.md)), 
as well as the entry point for SCSS building, `index.scss`. It also will 
contain the `App` component, which represents the whole UI. The purpose of
the `App` component is to set up application level items, such as intial state,
user information, and own navigation around the various [`Panel` components](../Panels/README.md).

Code in this directory should be designed and developed as if it were a `Panel`
component, with the addition of user story end to end tests, which drive the
whole UI to achieve the stated user goals.