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
nothing

Q: @Corey, whats would you expect when PropMixin and StateMixin conflict (containing the same keys)? What sort of priority takes place?
after discussion with alex, sounds like we want to throw an error


# TODOS:
-[x] initial tests
-[x] splitting out into modules

-[x] ProviderComponent, need to test all lifecycle behaviors on this

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
-[x] tag current version with all 4(transisAware, mixin, provider, stateInjection) working.
-[x] remove stateInjection and Provider pattern, focus on transisAware.
-[x] renaming the variables, transisAware -> transisReact, transisAwareLegacy -> TransisReactMixin
-[x] conflict state vs props.
-[ ] separate advanced specs into topics
  * mix usage
  * lifecycle events
-[ ] improve `README.md`
-[x] align the way we detect `isMounted` with main.


# blockers
-[?] two transis instance issue
-[x] jest debugger

# Things to note about migration
1. Global Mixined `state` variables are now bound to `props` on the CoreComponent. They are kept bound to `state` on the wrapper for change detection purposes.
2. `componentWillReceiveProps` is triggered whenever Global Mixined state are updated in any way.
3. lifecycle events that used to listen to `state` variable that was mixined through `global appState` will now need to listen for `props, such as

```js
shouldComponentUpdate({nextProps}, {nextState})
componentWillUpdate({nextProps}, {nextState})
componentDidUpdate({preivousProps}, {previousState})
```
