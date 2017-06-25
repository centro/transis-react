Q: Do we want to be backwards compiable with mixins?

Q: syntax of usage?

Q: seems like peerDependencies rn't installed when you run install transis-react, do you do that manually? or is there an easier way?

# prefereed usage pattern

```js
import transisReact, { StateMixin, PropsMixin } from 'transis-react'

class MyComponent extends Componenet {
  render() {
    return <div>{this.props.thing}</div>
  }
}

export default transisReact({
  global,
  state,
  props
}, MyComponent)
```

