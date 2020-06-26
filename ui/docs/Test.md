# Test

Tests serve many different purposes. They can:

- Validate the requirements/expectations of stakeholders are met
- That an end user can achieve their goal
- Act as documenatation/reference material
- Confirm integration works as expected between areas of function
- Validate we do not regress functionality or behaviour we care about

We want to enable and achieve all of these goals in the UI testing done in this
repo. To this end, we require, depending on the functionality being added or
changed, different types of tests. The types of test expected, and the 
rationale for these are detailed below.

## Style of test

We have two styles of test - `Behavioural` and `Functional`. 

`Behavioural` tests focus on exactly that - behaviour. They do not target 
individual functons, but instead test an end to end behaviour (and all the 
functions which contribute to it), and validate that for a given set of actions
or inputs, that the expected output/end goal is met. These behaviours should 
focus on the user of the component. Depending on the type of code being 
developed, the user may be another developer (using the component for example)
or the end user of the UI.

`Functional` tests conversely target individual functions in a more traditional
unit test style - validating that for a given input, the expected output is 
returned.

Depending on the code being covered, the tools used to enable these test styles
may be different, as detailed below.

### Functional test style

Code in the following directories are expected to be tested by `functional` 
test methods, using _Jest_ as a test runner, using standard Jest test assets,
such as `describe`, `it` and `expect`:

- `ui/src/Utils`
- `ui/src/ReactCustomHooks`
- `ui/src/Contexts`

### Behavioural test style

Code in the following directories are expected to be tested by `behavioural` 
test methods, using _Jest_ as a test runner, using standard Jest test assets,
such as `describe`, `it` and `expect`, and _RTL_ to mount and interact with
React component code:

- `ui/src/Elements`
- `ui/src/Groups`
- `ui/src/Panels`

#### End to End testing

End to End tests should exercise a user scenario - focus on the behaviour a user will take to interact with the application to achieve an end goal.

They should be fairly coarse grained, exercising multiple pages/panels as necessary.

For example - "I can produce a message and observe it being consumed", or "I can stop producing and no more messages are consumed".

These tests are using _Jest_ as a test runner, using standard Jest test assets,
such as `describe`, `it` and `expect`, and _Playwright_ to instrument the browser - which also provides additional expect matchers via _expect-playwright_.

To avoid the temptation to correlate scenarios with particular panels, these tests are located in the `e2e/features` directory.

The e2e tests are written using [Gerkin](https://cucumber.io/docs/gherkin/reference) syntax. Your `.feature` file should live inside `e2e/features`. The steps are written inside `e2e/features/step_definitions`. Definition files are written using [stucumber](https://github.com/sjmeverett/stucumber) syntax - each file corresponds to a set of related steps exported with a `bootstrap` function to register rule definitions with stucumber, and `index.js` handles bootstrapping each set of definitions. Note - while you can define a rule multiple times, it is only the first occurance that is executed (based off bootstrapping order).

On failure - the `failure_output/screenshots` and `failure_output/videos` directories will contain a capture of the page at failure time, and a recordings of the test until failure.

## Writing a test

In all styles of test, we will look for the following factors. These are to
confirm the test is clean and will be reliable:

- Date and time should be mocked/set to a known value
- Tests should cause no side effects - they should create and delete any 
resources they need in the scope of that test/test suite
- Tests (regardless of style) should be structured in the following way:
  1) Perform any required setup
  2) Perform an action (or actions)
  3) Assert the result
  4) Perform any required tidyup

## Test tooling used

The current set of tooling used to implement tests can be found below. In 
addition to this set, a library of [test utilities exist](../src/TestUtils/README.md) to help enable the fast
and reliable creation and maintaince of tests going forwards.

The testing tooling used for UI code is as follows:

- Jest - as a test runner. Used to run functional and behavioural tests
- RTL (react-test-library) - used to emulate a browser DOM and mimic
user interaction with React components
- Playwright - starts headless browsers and instruments interactions to mimic real user activity

## Testing contexts

As mentioned above, contexts should be tested in a functional style. Some 
additional setup may be required with a context depending on how high-level
it is. If the context provider is provided in `index.js`, then the provider
should be added into `TestUtils/rtl.testutil.js` along with the other providers.
As this extends the RTL render method, it allows us to create simple consumer 
tests with no additional setup. For example:

```
render(
      <ContextConsumer>
        {(contextValue) => {
          // test context behaviour here
        }}
      </ContextConsumer>
);
```
