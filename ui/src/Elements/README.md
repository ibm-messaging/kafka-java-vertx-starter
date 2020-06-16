# Elements

`Elements` are presentational react components. They take one or more properties,
and render that content. They should not perform any business logic, such as
making requests for data - they are purley presentational.

`Elements` must have Storybook entries, ideally with Knobs/actions to allow for
easy exploration/to help understand usage.

## Test approach

Elements should be developed and tested thinking of both the end user and 
developer using the component in mind. To this end, behaviours (rather 
than specific internal functions) should be tested locally, validating for a 
given set of properties, the expected rendering is then produced.

## File structure

For a given `Elements` component, `MyComponent`, the expected structure is as
follows:

```
src/
    Elements/
        MyComponent/
            index.js
            README.md
            MyComponent.spec.js
            MyComponent.assets.js
            MyComponent.stories.js
            MyComponent.view.js
            MyComponent.scss
            MyComponent.i18n.json
```

where;
    - `index.js` for exposing any 'public' exported asset - ie the component,
    constants used, etc
    - `README.md` is the documentation/design doc for this component
    - `*.spec.js` are the behavioual tests for this component 
    - `*.assets.js` are reuasble assets used in the test, storybook stories,
    or constants used by the component
    - `*.stories.js` contains the Storybook entries for this component
    - `*.view.js` is the component rendering logic itself
    - `*.scss` is the styling for this component
    - `*.i18n.json` are the translations for this component

All of these files should follow the style guide for this codebase, which 
can be found [here](../../docs/CodeStyle.md).

### List of currently implemented Elements