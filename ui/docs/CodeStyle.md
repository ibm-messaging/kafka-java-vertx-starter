# Code style

To ensure common style, we have implemented linting of both code and commit
messages to enforce our chose style. In addition, we expect that all UI code
contributed to this codebase will use/expect and follow the below guidance and 
approaches:

- [BEM](http://getbem.com/) for styling
- SCSS imports of only what is used/needed
- Functional React components
- TDD/BDD - done before/as a part of design of code changes
- Storybook entries for all components
- README for all components, shown in storybook
- All components to have prop types w/documentation visible in storybook
- All components to have default props

## State by Context

Any higher-level state should be stored using React Context, see our 
[Context readme](../src/Contexts/README.md). For example, configurations or
meta-data that should be available everywhere can be provided with a 
`ContextProvider` in the base `index.js` file. For elements that need shared
knowledge between them, a Context can be provided by the parent panel (See
[UI Structure](./Architecture.md#UI_Structure)). Contexts should not be used 
to control elements or for state that will change often as this can cause
unnecesary re-rendering.
