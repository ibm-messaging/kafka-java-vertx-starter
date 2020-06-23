# useToggle

`useToggle` is a simple hook to encapsulate a boolean piece of state. The hook
will expose two items - the current value, and a function that will change
that value. The function will not expect any parameters, and when called will
toggle the boolean value to its opposite state.

## Usage

`useToggle` can be used as follows:

```
const [toggleState, toggle] = useToggle();
```

The returned `toggleState` is the current toggled state, and `toggle` when
invoked will update that state. If no parameters are provided, `useToggle` will
return a starting `toggleState` of `false`. If required, a value can be
provided to the hook to set a different state if needed:

```
const [toggleState, toggle] = useToggle(true);
```

In this case, `toggleState` will start as `true`. As mentioned above, the state
of the toggle is updated by simply calling the returned `toggle` function:

`toggle()`

