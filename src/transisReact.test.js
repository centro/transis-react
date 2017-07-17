import transisReact from './transisReact' // sometimes two instance of transis occurs

import {
  Model, CoreComponent, TransisObjectFactory,
  // expectations
  initial_state_expectation, state_change_sequence_expectation,
} from './test_helper/testUtil'

// TODOS:
// lifecycle [x]
// transisId ( need to share with Legacy )
// state and prop mixin conflict
// rerender times, use jasmine if necessary, check on rerender of child component and parent who both applied mixin

let component;
const model = new Model
describe('PropMixin', function() {
  const PropMixinComponent = transisReact({
    props: { model: ['foo', 'bar'] }
  }, CoreComponent)

  beforeEach(() => {
    model.reset()
    component = mount(<PropMixinComponent model={model}/>)
  })
  afterEach(() => component.unmount())

  it('initially', () => expect(component.find('.foo').text()).toBe('foo 1'))

  it('Changes w/ props mixins', () => {
    model.foo = 'foo 2'
    Transis.Object.flush()
    expect(component.find('.foo').text()).toBe('foo 2')
  })
})

describe('StateMixin', () => {
  const appState = new (TransisObjectFactory('model'))({ model }) // gloal state
  const StateMixinComponent = transisReact({ // with state mixin
    global: appState,
    state: { model: ['baz'] }
  }, CoreComponent)

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
    const SmartMixinComponent = transisReact({
      global: appState.model,
      state: ['foo', 'bar', 'baz']
    }, props => <CoreComponent model={props}/>)

    it('understand argument (globalVar, "a", "b") as (globalVar, { a: [], b: []}) ', () => {
      initial_state_expectation({
        component: mount(<SmartMixinComponent />)
      })
    })
  })
})

describe('Conflict State/Props Mixin', () => {
  const child = new (TransisObjectFactory('name'))({ name: 'Congwen' })
  const appState = new (TransisObjectFactory('name', 'child'))({ child }) //state
  const PropsMixinComponent = transisReact({
    global: appState,
    state: ['child']
  }, ({ child }) => {
    return <div className="name">{child.name}</div>
  })

  it('conflicts with each other', () => {
    expect(mount(
      <PropsMixinComponent child={{ name: 'Jeter' }} />
    ).text()).toBe('Congwen') // or Jeter, or Throw Error?
  })
})

describe('combining state and props tests', () => {
  // component setup
  class AwareComponentCore extends React.Component {
    // stubbed for mocking purpose, cannot be prebound
    componentWillMount () {} componentDidMount () {} componentDidUpdate () {} componentWillUnmount () {}
    componentWillReceiveProps() {}
    shouldComponentUpdate () {} componentWillUpdate () {} componentDidUpdate () {}
    render() {
      return <div>
        <span className="injected">{ this.props.injected.name }</span>
        <CoreComponent {...this.props} />
      </div>
    }
  }
  const InjectedModel = TransisObjectFactory('name')
  const inject1 = new InjectedModel({ name: 'injected 1' })
  const inject2 = new InjectedModel({ name: 'injected 2' })
  const appState = new (TransisObjectFactory('injected'))({ injected: inject1 })
  const AwareComponent = transisReact({
    props: { model: ['foo', 'bar']},
    global: appState,
    state: { injected: ['name'] }
  }, AwareComponentCore)
  // end of lifcycle test component setup

  const magicSpy = new Proxy(AwareComponentCore.prototype, { get: jest.spyOn })

  // TODO: missing lifecycle methods, such as willReceiveProps etc.
  describe('Lifecycle Events', () => {
    const { // Spies
      componentWillMount, componentDidMount, componentWillUnmount, // props
      componentWillReceiveProps,
      shouldComponentUpdate, componentWillUpdate, componentDidUpdate, // states
    } = magicSpy

    afterEach(jest.resetAllMocks)
    afterEach(() => component && component.unmount())
    afterAll(jest.clearAllMocks)

    it('mounting events', () => {
      expect(componentWillMount).not.toHaveBeenCalled()
      expect(componentDidMount).not.toHaveBeenCalled()
      expect(componentWillUnmount).not.toHaveBeenCalled()

      component = mount(<AwareComponent model={model}/>)
      expect(componentWillMount).toHaveBeenCalled()
      expect(componentDidMount).toHaveBeenCalled()
      expect(component.find('.injected').text()).toBe('injected 1') // rendered
      component.unmount()
      expect(componentWillUnmount).toHaveBeenCalled()
      expect(componentWillReceiveProps).not.toHaveBeenCalled() // no prop changes
    })

    // state update and swaps
    it('state mixin update as expected', () => {
      component = mount(<AwareComponent />)
      expect(component.find('.injected').text()).toBe('injected 1') // rendered

      expect(shouldComponentUpdate).not.toHaveBeenCalled()
      expect(componentWillUpdate).not.toHaveBeenCalled()
      expect(componentDidUpdate).not.toHaveBeenCalled()

      appState.injected.name = 'john'
      shouldComponentUpdate.mockReturnValue(true) // to speed things up

      Transis.Object.flush()
      expect(component.find('.injected').text()).toBe('john') // re-rendered
      expect(shouldComponentUpdate).toHaveBeenCalled()
      expect(componentWillUpdate).toHaveBeenCalled()
      expect(componentDidUpdate).toHaveBeenCalled()

      // NOTE: state changes to trigger componentWillReceiveProps
      expect(componentWillReceiveProps.mock.calls.length).toBe(1)
      expect(componentWillReceiveProps.mock.calls[0]).toEqual([
        { injected: inject1 }, {}
      ])
    })

    it('swapping out state', () => {
      component = mount(<AwareComponent />)
      expect(shouldComponentUpdate).not.toHaveBeenCalled()
      expect(componentWillUpdate).not.toHaveBeenCalled()
      expect(componentDidUpdate).not.toHaveBeenCalled()

      appState.injected = inject2
      shouldComponentUpdate.mockReturnValue(true) // to speed things up

      Transis.Object.flush()
      expect(shouldComponentUpdate).toHaveBeenCalled()
      expect(componentWillUpdate).toHaveBeenCalled()
      expect(componentDidUpdate).toHaveBeenCalled()
      expect(component.find('.injected').text()).toBe('injected 2')

      // NOTE: state changes trigger componentWillReceiveProps
      expect(componentWillReceiveProps.mock.calls.length).toBe(1)
      // empty is not from {...this.state} TODO: look into what this is
      expect(componentWillReceiveProps.mock.calls[0]).toEqual([
        { injected: inject2 }, {}
      ])

      // restore
      appState.injected = inject1
    })

    // props update and swaps
    it('props mixin update as expected', () => {
      component = mount(<AwareComponent model={model}/>)
      expect(component.find('.foo').text()).toBe('foo 1') // rendered

      expect(shouldComponentUpdate).not.toHaveBeenCalled()
      expect(componentWillUpdate).not.toHaveBeenCalled()
      expect(componentDidUpdate).not.toHaveBeenCalled()

      model.foo = 'foo 2'
      shouldComponentUpdate.mockReturnValue(true) // to speed things up

      Transis.Object.flush()
      expect(component.find('.foo').text()).toBe('foo 2') // re-rendered
      expect(shouldComponentUpdate).toHaveBeenCalled()

      expect(componentWillUpdate).toHaveBeenCalled()
      expect(componentDidUpdate).toHaveBeenCalled()

      expect(componentWillReceiveProps.mock.calls.length).toBe(1)
      // empty is not from {...this.state} TODO: look into what this is
      expect(componentWillReceiveProps.mock.calls[0]).toEqual([
        { injected: inject1, model }, {}
      ])
    })

    it('swapping out props', () => {
      class WrapperComponent extends React.Component {
        constructor() {super()
          this.state = { model }
        }
        render() {
          return <div> <AwareComponent model={model}/> </div>
        }
      }
      component = mount(<WrapperComponent/>)
      expect(shouldComponentUpdate).not.toHaveBeenCalled()
      expect(componentWillUpdate).not.toHaveBeenCalled()
      expect(componentDidUpdate).not.toHaveBeenCalled()

      shouldComponentUpdate.mockReturnValue(true) // to speed things up
      component.node.setState({
        model: new Model({ foo: 'foo 2' })
      })

      Transis.Object.flush() // not really needed, as we aren't making transis prop change
      expect(shouldComponentUpdate).toHaveBeenCalled()
      expect(componentWillUpdate).toHaveBeenCalled()
      expect(componentDidUpdate).toHaveBeenCalled()
      expect(component.find('.foo').text()).toBe('foo 2')

      expect(componentWillReceiveProps.mock.calls.length).toBe(1)
      // empty is not from {...this.state} TODO: look into what this is
      expect(componentWillReceiveProps.mock.calls[0]).toEqual([
        { injected: inject1, model }, {}
      ])
    })
  })

  describe('parent renders halts child re-renders', () => {
    // component setup
    let PropsMixinedComponentRenderCount = 0
    let NoReRenderComponentRenderCount = 0

    const PropsMixinedComponent = transisReact({
      props: { model: ['foo', 'bar']},
    }, ({ model }) => {
      PropsMixinedComponentRenderCount++
      return <div className="foo">{model.foo}</div>
    })

    const NoReRenderComponent = transisReact({
      global: appState,
      state: { injected: ['name'] }
    }, class NoReRenderComponentCore extends React.Component {
      render() {
        NoReRenderComponentRenderCount++
        const { model, injected } = this.props
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

