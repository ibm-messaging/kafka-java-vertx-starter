# kafka-java-vertx-starter UI

The content of this and sub folders make up the UI for the 
`kafka-java-vertx-starter` application. Details on how the UI works, is built, 
tested and can be further developed can be found in the linked documentation.

## Content
- [Getting started](#getting-started)
- [Developer environment setup](./docs/DevEnv.md)
- [UI Contribution guide](./docs/Contribution.md)
- [Code style guidelines](./docs/CodeStyle.md)
- [Test](./docs/Test.md)
- [Build](./docs/Build.md)
- [Architecture](./docs/Architecture.md)
- [Codebase goals](#codebase-goals)

### Getting started

The UI will require the prerequisites listed [here](../README.md#build-prerequisites)

By default, whenever you build the [repo](../README.md#running-the-app), the UI 
will be built as a part of the `mvn install`. 

You may also wish to review our [suggested developer environment setup](./docs/DevEnv.md), to make
developing the UI as easy as possible.

To develop and change the UI, the first step is to download all required 
dependancies, by running the following in this directory:

```
npm install
```

Once complete, a number of commands can then be run to develop the UI. These 
are detailed below.

Finally, `README.md` files will exist in the various directories in the UI code
base, to introduce and document how sections of the UI have been developed and
work. They will serve as a good reference to introduce how the particular 
aspects of the UI works, and how to get started working in any given area.

#### Run UI tests

All tests for the UI can be run by running the following:

```
npm run test
```

A particular test or test suite can be run by specifying the name as follows:

```
npm run test -- <NAME>
```
where `<NAME>` is the test/test suite name.

Details on the testing approach taken in this codebase can be found [here](./docs/Test.md)

#### Storybook

[Storybook](https://storybook.js.org/) is used to develop and document all 
React components used in this project. Each component and Storybook entry 
will document usage with their own Readme and allow for live interaction
for exploration. Storybook can be run locally by using the following
command:

```
npm run storybook
```

As per the [ui contribution guide](./docs/Contribution.md), development should happen in storybook 
first, to not bake in assumptions about component design and usage. Storybooks
will be generated on PR, and it will be these which are referenced in a review.

Finally, Storybook is rebuilt on PR merge and publicly available [here](https://matthew-chirgwin.github.io/kafka-java-vertx-starter/)


##### Mock UI

A full UI, running in a development mode (with mock backend) can be started by 
running the following command:

```
npm run start
```

This should be used to validate changes, and will be used by our end to end 
tests to validate user stories.


## Codebase goals

In setting up this UI codebase, we have aimed to satsify the following goals.
We intend to stick to them, and so should you! :)

- `master` is production - once it is merged, it's built and live
- Automate everything - less time doing toil, more time focusing on the end
product
- Focus on the user, and run and develop time - keep the user in mind, whoever
they may be. Make their life easy, everybody wins.
- Lower the barrier to entry through consistant and well documented approach -
UI is hard. Make the code as approachable as possible by following using the
same patterns, with easy to follow documentation and materials to make the
codebase easy to learn and maintain.
