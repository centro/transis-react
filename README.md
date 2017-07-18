# React binding for Transis
> Use Transis and React in ES6

## Example Use Cases



# Things to note about migration
1. Global Mixined `state` variables are now bound to `props` on the CoreComponent. They are kept bound to `state` on the wrapper for change detection purposes.
2. `componentWillReceiveProps` is triggered whenever Global Mixined state are updated in any way.
3. lifecycle events that used to listen to `state` variable that was mixined through `global appState` will now need to listen for `props, such as

```js
shouldComponentUpdate({nextProps}, {nextState})
componentWillUpdate({nextProps}, {nextState})
componentDidUpdate({preivousProps}, {previousState})
```
