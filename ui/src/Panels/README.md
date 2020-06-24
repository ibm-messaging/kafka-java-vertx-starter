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

Due to the nature of what the `Panels` components do/provide, unit testing would risk duplicating
test effort of the child components. Instead, `Panels` should be tested as behavioural integration tests,
where _RTL_ is used to interact with the `Panel` as a whole. To encourage behavioural testing, all `Panel` tests should be written
using BDD Gherkin syntax.

This allows testing of not only the `Panels` component, but also any `Groups` and `Elements` used in it, driving it as a user would (clicking/typing in elements etc.)

The tests are written using [Gerkin](https://cucumber.io/docs/gherkin/reference) syntax. Test steps are written using [stucumber](https://github.com/sjmeverett/stucumber) syntax - each file corresponds to a set of related steps exported with a `stepDefs` function to register rule definitions with stucumber, and `stucumber.setup.js` handles bootstrapping each set of definitions. Note - while you can define a rule multiple times, it is only the first occurance that is executed (based off bootstrapping order) - so common steps can located in their own file if needed.

### Test files
```
src/
    Panels/
        MyComponent/
            MyComponent.feature
            MyComponent.steps.js
```

- `*.feature` uses Gherkin syntax to describe the behaviour of the integration tests
    ```
    Feature: MyComponent

    Scenario: I can add a new item
        Given I have an empty MyComponent
        When I add an item
        Then the item is displayed
    ``` 
- `*.steps.js` implements the steps - exporting via a `stepDefs` function used to register with stucumber
   ```
    import {MyComponent} from './MyComponent.view.js';
    import { render } from 'TestUtils';
    export const stepDefs = cucumber => {
       cucumber.defineRule('I have an empty MyComponent', (world) => {
           world.rendered = render(MyComponent);
       });
       ...additional rules
    }
    
   ```

## File structure

For a given `Panels` component, `MyComponent`, the expected structure is as
follows:

```
src/
    Panels/
        MyComponent/
            index.js
            README.md
            MyComponent.assets.js
            MyComponent.stories.js
            MyComponent.model.js
            MyComponent.view.js
            MyComponent.scss
            MyComponent.i18n.json
            MyComponent.feature
```

where:
- `index.js` for exposing any 'public' exported asset - ie the component,
    constants used, etc
- `README.md` is the documentation/design doc for this component
- `*.feature` is the integration test, written in Gherkin syntax
- `*.steps.js` exports the implementations of the steps used in the `feature`, using _RTL_
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
- [`Consumer`](./Consumer/README.md)