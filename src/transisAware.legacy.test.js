import {
  StateMixinLegacy as StateMixin,
  PropsMixinLegacy as PropsMixin
} from 'transisAware.legacy' // sometimes two instance of transis occurs

import {
  Model, CoreComponent, TransisObjectFactory,
  initial_state_expectation, state_change_sequence_expectation,
} from './test_helper/testUtil'

const CoreRender = ({ foo, bar, baz }) =>
  <div>
    <div className="foo">{foo}</div>
    <div className="bar">{bar}</div>
    <div className="baz">{baz}</div>
  </div>

let component;
const model = new Model()

describe('PropMixin', function() {
  const PropMixinComponent = React.createClass({
    mixins: [
      PropsMixin({ model: ['foo', 'bar'] })
    ],
    render() {
      const { foo, bar, baz } = this.props.model
      return <CoreRender {...{foo, bar, baz}} />
    }
  })

  beforeEach(() => {
    model.reset()
    component = mount(<PropMixinComponent model={model}/>)
  })
  afterEach(() => component.unmount())

  it('initially', () => {
    expect(component.find('.foo').text()).toBe('foo 1')
  })

  it('Changes w/ props mixins', () => {
    model.foo = 'foo 2'
    Transis.Object.flush() // needed for running this single it
    expect(component.find('.foo').text()).toBe('foo 2')
  })
})

describe('StateMixin', () => {
  const appState = new (TransisObjectFactory('model'))({ model })
  const StateMixinComponent = React.createClass({
    mixins: [
      StateMixin(appState, { model: ['baz'] })
    ],
    render() {
      const { foo, bar, baz } = this.state.model
      return <CoreRender {...{foo, bar, baz}} />
    }
  })

  beforeEach(() => {
    appState.model.reset()
    component = mount(<StateMixinComponent />)
  })
  afterEach(() => component.unmount())

  it('initially', () => initial_state_expectation({ component }) )

  it('Changes w/ state mixins', () => {
    state_change_sequence_expectation({
      model: appState.model,
      component
    })
  })

  describe('smart stateMixin parameters', () => {
    const SmartMixinComponent = React.createClass({
      mixins: [ StateMixin(appState.model, 'foo', 'bar', 'baz') ],
      render() { return <CoreComponent model={this.state}/> }
    })

    it('understand argument (globalVar, "a", "b") as (globalVar, { a: [], b: []}) ', () => {
      initial_state_expectation({
        component: mount(<SmartMixinComponent />)
      })
    })
  })
})
