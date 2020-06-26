# SelectedMessage

This context is used to store the currently selected/interacted with message by
the user. This can then be checked and updated at render time by using the
provided functions from the consumer.

## Provided render function values

When using the SelectedMessageConsumer, the following value/functions are
available to you:

- `currentSelectedMessage` - the currently selected message, in a unique format
- `updateSelectedMessage` - function to update the selected message. Is 
expected to be an object containing the topic, partition and offset of the 
given message
- `isSameAsSelected` - function which returns either true or false when invoked 
with a message object which does/does not match the currently selected message

