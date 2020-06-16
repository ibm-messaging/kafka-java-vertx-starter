# Panels

`Panels` are top level components in the UI. Normally there would be one 
`Panel` component per page in the UI. The role of the `Panel` is to act as the
datafetcher/state reducer for the page. It would be responsible for
performing actions such as fetching data on request from a child
component, or on load of the page, or rendering different `Group`/`Element`
components depending on the state of the page/wider UI.

`Panels` can be comprised of one or more `Groups` components, as well as 
one or more `Element` components, if they can be driven by properties from 
the `Panels` model.

`Panels` must have Storybook entries, ideally with Knobs/actions to allow for
easy exploration/to help understand usage.

## Test approach

Due to the nature of what the `Panels` components do/provide, local testing my 
not be possible/useful. Instead, these components should be primarily be tested
via e2e testing, using an actual browser. This allows testing of not only the
`Panels` component, but also any `Groups` and `Elements` used in it, as an
end user would expect to use them.

## File structure

For a given `Panels` component, `MyComponent`, the expected structure is as
follows:

```
src/
    Panels/
        MyComponent/
            index.js
            README.md
            MyComponent.e2e.js
            MyComponent.assets.js
            MyComponent.stories.js
            MyComponent.model.js
            MyComponent.view.js
            MyComponent.scss
            MyComponent.i18n.json
```

where;
    - `index.js` for exposing any 'public' exported asset - ie the component,
    constants used, etc
    - `README.md` is the documentation/design doc for this component
    - `*.e2e.js` are the end to end tests for this page (and child components)
    - `*.assets.js` are reuasble assets used in storybook stories,
    or constants used by the component
    - `*.stories.js` contains the Storybook entries for this component
    - `*.model.js` contains any business logic for the component
    - `*.view.js` is the component rendering code
    - `*.scss` is the styling for this component
    - `*.i18n.json` are the translations for this component

All of these files should follow the style guide for this codebase, which 
can be found [here](../../docs/CodeStyle.md).

### List of currently implemented Panels