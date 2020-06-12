# Code style

<To be added when liniting in pace>

- BEM
- SCSS imports of only what is used
- Functional components
- TDD/BDD
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
