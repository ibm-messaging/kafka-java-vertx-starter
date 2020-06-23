# Message

This component represents a Kafka message, either produced to the broker or
consumed from the broker. Produced and consumed messages are styled and
structured differently and both can be supplied with interaction functions.

## Properties

Assuming use of the `Message` component directly, the named properties which are
expected are as follows:

- `className` - optional - add any specific styling classes to this component.
This will be appended after the class which sets the type style, allowing
modification of the styling if needed.
- `usage` - required - the style and structure applied to this component depending
  on the type of message. Must be either:
  - `consumer` - for messages that are consumed from Kafka
  - `producer` - for messages that are produced to Kafka
- `isFirst` - optional - enables additional styling to indicate the first message.
- `message` - optional - a shape containing the Kafka topic, partition,
  offset, value and timestamp
- `error` - optional - a shape containing the error details. Overrides `message`
  if both exist.
- `onInteraction` - optional - a function invoked on hover, tab, click, etc. The
  interaction event, `usage` value and `message` value are passed to the
  function in that order.

_Note_: All `usage` values are exported alongside the component for ease of use.

Any property which is not matched will be passed onto the parent element
rendered as a part of this component. Do also note if using one of the named
styled components, the `usage` property is provided for you.

## Example usage

Example usage of the `Message` component, passing both a `usage` and custom
`className` property. This would result in a consumed message being
rendered, as well as the styling defined in the `myclass` css class.

```
<Message usage={'consumer'} className={'myclass'} message={aConsumedMessage}/>
```

Note that the `Message` component itself is not exposed. Instead, `ConsumerMessage`
and `ProducerMessage` named/higher order components are exposed for use. These
in effect abstract the `usage` property away.

For example:

```
<ProducerMessage isFirst={true} message={aProducedMessage} />
```

The full set of exposed components and constants are as follows:

- `ProducerMessage` - Message component with producer styling/structure
- `ConsumerMessage` - Message component with consumer styling/structure
- `PRODUCER` - producer usage constant
- `CONSUMER` - consumer usage constant
