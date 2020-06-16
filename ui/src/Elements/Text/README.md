# Text

This component acts as a styling component - ie it applies one of 4 styles to
a given string of text. The component is exported directly with the below
properties, or as a named, pre styled component. For a full set of components
provided, see the [example usage](#example-usage) section.

## Properties

Assuming use of the `Text` component directly, the named properties which are
expected are as follows:

- `className` - optional - add any specific styling classes to this component.
This will be appended after the class which sets the type style, allowing
modification of the styling if needed.
- `type` - required - the typography style applied to this component. One of
the following values, defaulting to `body` if not provided:
    - `body` - for general body text
    - `heading` - for heading text
    - `subheading` - for sub headings
    - `code` - for code snippets

_Note_: All `type` values are exported alongside the component for ease of use.

Any property which is not matched will be passed onto the parent element
rendered as a part of this component. Do also note if using one of the named
styled components, the `type` property is provided for you.

## Example usage

Example usage of the `Text` component, passing both a `type` and custom 
`className` property. This would result in the string 'Hello world' being
rendered, using a body typography styling, as well as the styling defined in
the `myclass` css class.

```
<Text type={'body'} className={'myclass'}> Hello World </Text>
```

For ease, a number of named/higher order components are also exposed for use.
These in effect abstract the `type` property away. For example:

```
<Subheading>Foobar buzz</Subheading>
```

would render the string 'Foobar buzz' as a subheading.

The full set of exposed components and constants are as follows:

- `Text` - main Text component
- `Heading` - Text component with type heading
- `Subheading` - Text component with type subheading
- `Body` - Text component with type body
- `Code` - Text component with type code
- `HEADING` - heading type constant
- `SUBHEADING` - subheading type constant
- `BODY` - body type constant
- `CODE` - code type constant