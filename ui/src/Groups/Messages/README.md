# Messages

This group displays a list of [ConsumerMessage or ProducerMessage](../../Elements/Message)
elements, or an empty state if there are no messages to display. It acts as a
layout component. Depending on the `usage` property, children are rendered either
in a row or a column.

## Properties

Assuming use of the `Messages` component directly, the named properties which are
expected are as follows:

- `className` - optional - add any specific styling classes to this component.
This will be appended after the class which sets the type style, allowing
modification of the styling if needed.
- `usage` - required - the style and structure applied to this group depending
  on the type of messages. Must be either:
  - `consumer` - for messages that are consumed from Kafka
  - `producer` - for messages that are produced to Kafka
- `children` - child content to render. If this is provided, the expectation is
that it will contain either ProducedMessage or ConsumedMessage components. If 
none provided, empty state will render.

Any property which is not matched will be passed onto the parent element
rendered as a part of this component.

## Example usage

Example usage of the `Messages` component, passing the `usage` and child 
content, plus a custom `className` property.

```
<Messages usage={'consumer'} className={'myclass'} >
  <ConsumerMessage />
</Messages>
```

Note that the `Messages` component itself is not exposed. Instead, `ConsumerMessages`
and `ProducerMessages` named/higher order components are exposed for use. These
in effect abstract the `usage` property away.

For example:

```
<ConsumerMessages className={'myclass'}>
  <ConsumerMessage />
</ConsumerMessages>
```

The full set of exposed components and constants are as follows:

- `ProducerMessages` - Message component with producer styling/structure
- `ConsumerMessages` - Message component with consumer styling/structure
