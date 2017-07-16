import {
  StateMixin,
  PropsMixin
} from './TransisReactMixin' // sometimes two instance of transis occurs

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


describe('combining state and props tests', () => {
  // model setup 
  const InjectedModel = TransisObjectFactory('name')
  const inject1 = new InjectedModel({ name: 'injected 1' })
  const inject2 = new InjectedModel({ name: 'injected 2' })
  const appState = new (TransisObjectFactory('injected'))({ injected: inject1 })


  describe('parent renders halts child re-renders', () => {
    // component setup 
    let PropsMixinedComponentRenderCount = 0
    let NoReRenderComponentRenderCount = 0

    const PropsMixinedComponent = React.createClass({
      mixins: [
        PropsMixin({ model: ['foo', 'bar'] })
      ],
      render() {
        const { model } = this.props
        PropsMixinedComponentRenderCount++
          return <div className="foo">{model.foo}</div>
      }
    })

    const NoReRenderComponent = React.createClass({
      mixins: [
        StateMixin( appState, { injected: ['name'] })
      ],
      render() {
        NoReRenderComponentRenderCount++
        const { injected } = this.state
        const { model } = this.props
        return <div>
          <div className="injected">{injected.name}</div>
          <PropsMixinedComponent model={model} />
        </div>
      }
    })

    beforeEach(() => {
      PropsMixinedComponentRenderCount = 0
      NoReRenderComponentRenderCount = 0
      model.reset()
      component = mount(<NoReRenderComponent model={model}/>)
    })

    afterEach(() => component.unmount())

    it('initially each renders once', () => {
      expect(PropsMixinedComponentRenderCount).toBe(1)
      expect(NoReRenderComponentRenderCount).toBe(1)
    })

    // TODO: investigate why each render is causing it to render twice
    it('first queue child will re-render child twice', () => {
      expect(PropsMixinedComponentRenderCount).toBe(1) // initially
      model.foo = 'foo 2' 
      Transis.Object.flush()
      expect(PropsMixinedComponentRenderCount).toBe(2)
      expect(NoReRenderComponentRenderCount).toBe(1)

      appState.injected.name = 'injected 2'
      Transis.Object.flush()
      expect(PropsMixinedComponentRenderCount).toBe(3)
      expect(NoReRenderComponentRenderCount).toBe(2)
    })

    // TODO: get rid of these have to be differenet name stuff by using
    // undochanges
    it('first queue parent will only re-render child once', () => {
      model.foo = 'foo 3' 
      expect(PropsMixinedComponentRenderCount).toBe(1)
      expect(NoReRenderComponentRenderCount).toBe(1)

      appState.injected.name = 'injected 3'
      Transis.Object.flush()
      expect(PropsMixinedComponentRenderCount).toBe(2)
      expect(NoReRenderComponentRenderCount).toBe(2)
    })
  })
})
