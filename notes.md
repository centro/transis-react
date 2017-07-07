## Answered

Q: Do we want to be backwards compiable with mixins? Yes.

Q: syntax of usage?

#### prefereed usage pattern
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

## Abandoned
Q: seems like peerDependencies rn't installed when you run install transis-react, do you do that manually? or is there an easier way?
N/A



## Needed
Q: @Corey, what would you expect if prop mixins are set, but no props in the mixin were given?

Q: @Corey, whats would you expect when PropMixin and StateMixin conflict (containing the same keys)? What sort of priority takes place?


# TODOS:
-[ ] tests
-[ ] splitting out into modules
-[ ] proptypes

-[ ] ProviderComponent, need to test all lifecycle behaviors on this

```js
  <Parent
    global={appState}
    mixState={{
      campaign: ['name']
    }}
    mixProps={{
      info: ["hidden"]
    }}
    info={new TransisClass({ hidden: true })}
  >
    <div>
      { this.state.campaign.name} is { this.props.info.hidden ? 'hidden' : 'revealing' }
    </div>
  </Parent>
```

# blockers
-[?] two transis instance issue
-[x] jest debugger