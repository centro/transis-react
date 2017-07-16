import transisAware from 'transisAware' // sometimes two instance of transis occurs

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
  const PropMixinComponent = transisAware({
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
  const StateMixinComponent = transisAware({ // with state mixin
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
    const SmartMixinComponent = transisAware({
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
  const PropsMixinComponent = transisAware({
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
  const AwareComponent = transisAware({
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
      shouldComponentUpdate, componentWillUpdate, componentDidUpdate, // states
    } = magicSpy 

    afterEach(jest.resetAllMocks)
    afterAll(jest.clearAllMocks)

    it('mount as expected', () => {
      expect(componentWillMount).not.toHaveBeenCalled()
      expect(componentDidMount).not.toHaveBeenCalled()
      expect(componentWillUnmount).not.toHaveBeenCalled()

      component = mount(<AwareComponent model={model}/>)
      expect(componentWillMount).toHaveBeenCalled()
      expect(componentDidMount).toHaveBeenCalled()
      expect(component.find('.injected').text()).toBe('injected 1') // rendered
      component.unmount()
      expect(componentWillUnmount).toHaveBeenCalled()
    })

    it('state mixin update as expected', () => {
      component = mount(<AwareComponent model={model}/>)
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
      component.unmount()
    })
    // TODO: next three
    it('swapping out state')
    it('props mixin update as expected')
    it('swapping out props')
  })

  describe('parent renders halts child re-renders', () => {
    // component setup 
    let PropsMixinedComponentRenderCount = 0
    let NoReRenderComponentRenderCount = 0

    const PropsMixinedComponent = transisAware({
      props: { model: ['foo', 'bar']},
    }, ({ model }) => {
      PropsMixinedComponentRenderCount++
      return <div className="foo">{model.foo}</div>
    })

    const NoReRenderComponent = transisAware({
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
      component = mount(<NoReRenderComponent model={model}/>)
      // expect(component.find('.injected').text()).toBe('john')
      // expect(component.find('.foo').text()).toBe('foo 1')
    })
     
    it('initially each renders once', () => {
      expect(PropsMixinedComponentRenderCount).toBe(1)
      expect(NoReRenderComponentRenderCount).toBe(1)
    })
    
    // TODO: investigate why each render is causing it to render twice
    it('first queue child will re-render child twice', () => {
      expect(PropsMixinedComponentRenderCount).toBe(1) // initially
      model.foo = 'foo 2' 
      Transis.Object.flush()
      expect(PropsMixinedComponentRenderCount).toBe(3)
      expect(NoReRenderComponentRenderCount).toBe(1)

      appState.injected.name = 'injected 1'
      Transis.Object.flush()
      expect(PropsMixinedComponentRenderCount).toBe(5)
      expect(NoReRenderComponentRenderCount).toBe(3)
    })
    
    // TODO: get rid of these have to be differenet name stuff by using
    // undochanges
    it('first queue parent will only re-render child once', () => {
      model.foo = 'foo 3' 
      expect(PropsMixinedComponentRenderCount).toBe(1)
      expect(NoReRenderComponentRenderCount).toBe(1)

      appState.injected.name = 'injected 2'
      Transis.Object.flush()
      expect(PropsMixinedComponentRenderCount).toBe(3)
      expect(NoReRenderComponentRenderCount).toBe(3)
    })
  })
})

