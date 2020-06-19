# Groups

`Groups` are one or more `Element` components, combined/composed to implement
a large piece of UI. `Groups` are intended to act as a glue layer between
`Panels` and `Elements` - abstracting out state/data fetching logic from
the `Panel` this group sits in, and it's child `Elements`.  `Groups` can 
contain both business and rendering logic. Any business logic should be
done in the component's model, to keep rendering and business logic
seperate. The model should take the form of a React (custom) hook, 
returning a set of variables which can then be used to enable it's
rendering behaviour, and allow the simple passing of properties to it's 
child `Element` components.

`Groups` must have Storybook entries, ideally with Knobs/actions to allow for
easy exploration/to help understand usage.

## Test approach

`Groups` should be tested and developed thinking of their intended use in
the wider UI. To this end, local behavioural tests should be written, 
validating that for a given 'UI state' (ie for properties/state provided), 
that the expected output is rendered. Tests should validate that child 
`Element` components appear as expected, but not validate that those 
components render/behave as expected.

## File structure

For a given `Groups` component, `MyComponent`, the expected structure is as
follows:

```
src/
    Groups/
        MyComponent/
            index.js
            README.md
            MyComponent.spec.js
            MyComponent.assets.js
            MyComponent.stories.js
            MyComponent.model.js
            MyComponent.view.js
            MyComponent.scss
            MyComponent.i18n.json
```

where:
 - `index.js` for exposing any 'public' exported asset - ie the component,
    constants used, etc
 - `README.md` is the documentation/design doc for this component
 - `*.spec.js` are the behavioual tests for this component 
 - `*.assets.js` are reuasble assets used in the test, storybook stories,
    or constants used by the component
 - `*.stories.js` contains the Storybook entries for this component
 - `*.model.js` contains any business logic for the component
 - `*.view.js` is the component rendering code
 - `*.scss` is the styling for this component
 - `*.i18n.json` are the translations for this component

All of these files should follow the style guide for this codebase, which 
can be found [here](../../docs/CodeStyle.md).

### List of currently implemented Groups
 - [Status](./Status/README.md)