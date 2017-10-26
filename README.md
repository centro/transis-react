# Transis on React - [![Build Status](https://travis-ci.org/congwenma/transis-react.svg?branch=master)](https://travis-ci.org/congwenma/transis-react)

> Use Transis and React in ES6


## Example Usage Patterns

#### setup
```js
const Person = Transis.Object.extend(function() {
  this.prop('name')
})

const Car = Transis.Object.extend(function() {
  this.prop('name')
})

window.appState = new GlobalTransisObject({
  person: new Person({ name: 'john' })
})
```

### Classic Mixins
```js
import createClass from 'create-react-class'
import { StateMixin, PropsMixin } from 'transis-react'

const Classic = createClass({
  mixins: [
    StateMixin(appState, {
      person: ['name']
    }),
    PropsMixin({
      car: ['name']
    })
  ],
  render() {
    return <div>
      name: {this.state.person.name}
      drives: {this.props.car.name}
    </div>
  } // outputs "name: john, drives: Accord"
})

mount(<Classic car={new Car({ name: 'Accord' })}>)
```
### Higher Order Component factory
#### Basic
```js
import transisReact from 'transis-react'

// stateless!
const MyComponent = ({ person, car }) =>
  <div>
    name: {person.name}
    drives: {car.name}
  </div>

// or it can be ES6, where React lifecycle callbacks are available
class MyComponent extends Component {
  render = () =>
    <div>
      name: {this.props.person.name}
      drives: {this.props.car.name}
    </div>
}

export default transisReact({
  global: appState,
  state: {
    person: ['name']
  },
  props: {
    car: ['name']
  }
}, MyComponent)
```

### State/Prop name conflicts
Occasionally you might have a prop that have the same name that conflicts with the glboal state name, in this case you can use `remap` config:
```js
const MyComponent = ({ person, car }) =>
  <div>
    name: {person.name}
    drives: {car.name}
  </div>

export default transisReact({
  global: appState.person,
  state: {
    name: []
  },
  remap: {
    name: 'personName'
  }
}, ({ name, personName }) =>
  <div>
    name: {personName}
    drives: {name}
  </div>
)
```

### Tests
The wrapper `HigherOrderComponent` can access the actual component with a `#core` ref
```js
const component = mount(<MyComponent />)
component.node.state // { person: <TransisObject>{ name: 'john' } }
component.node.state.person === component.node.core.props.person // same
```


# Things to note about migration
1. Global Mixined `state` variables are now bound to `props` on the CoreComponent. They are kept bound to `state` on the wrapper for change detection purposes.
2. `componentWillReceiveProps` is triggered whenever Global Mixined state are updated in any way.
3. lifecycle events that used to listen to `state` variable that was mixined through `global appState` will now need to listen for `props, such as

```js
shouldComponentUpdate({nextProps}, {nextState})
componentWillUpdate({nextProps}, {nextState})
componentDidUpdate({preivousProps}, {previousState})
```
