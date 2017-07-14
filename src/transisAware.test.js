import transisAware from 'transisAware' // sometimes two instance of transis occurs

import {
  Model, CoreComponent, TransisObjectFactory,
  // expectations
  initial_state_expectation, state_change_sequence_expectation,
} from './test_helper/testUtil'

// TODOS:
// lifecycle
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

  // describe('changed model')
  // describe('rerender times')
})

describe('StateMixin', () => {
  const appState = new (TransisObjectFactory('model'))({ model })
  // with state mixin
  const StateMixinComponent = transisAware({
    global: appState,
    state: { model: ['baz'] }
  }, CoreComponent)

  beforeEach(() => {
    appState.model.reset()
    component = mount(<StateMixinComponent />)
  })
  afterEach(() => component.unmount())

  it('initially', () => initial_state_expectation({ component }) )
  // it('test REMOVE', () => {
  //   const appState1 = appState
  //   debugger;
  //   expect(1).toBe(2)
  // })

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

  // describe('lifecycle events')
  // describe('changed model')
  // describe('rerender times')
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

describe('Lifecycle Events', () => {
  class AwareComponentCore extends React.Component {
    // stubbed for mocking purpose, cannot be prebound
    componentWillMount () {}
    componentDidMount () {}
    componentDidUpdate () {}
    componentWillUnmount () {}
    shouldComponentUpdate () {}
    componentWillUpdate () {}
    componentDidUpdate () {}
    render() {
      return <div>
        <span className="injected">{ this.props.injected.name }</span>
        <CoreComponent {...this.props} />
      </div>
    }
  }

  const inject1 = new (TransisObjectFactory('name'))({ name: 'injected 1' })
  const inject2 = new (TransisObjectFactory('name'))({ name: 'injected 2' })
  const appState = new (TransisObjectFactory('injected'))({ injected: inject1 })
  const AwareComponent = transisAware({
    props: { model: ['foo', 'bar']},
    global: appState,
    state: { injected: ['name'] }
  }, AwareComponentCore)

  // Spies
  const componentWillMount = jest.spyOn(AwareComponentCore.prototype, 'componentWillMount')
  const componentDidMount = jest.spyOn(AwareComponentCore.prototype, 'componentDidMount')
  const componentWillUnmount = jest.spyOn(AwareComponentCore.prototype, 'componentWillUnmount')

  const shouldComponentUpdate = jest.spyOn(AwareComponentCore.prototype, 'shouldComponentUpdate')
  const componentWillUpdate = jest.spyOn(AwareComponentCore.prototype, 'componentWillUpdate')
  const componentDidUpdate = jest.spyOn(AwareComponentCore.prototype, 'componentDidUpdate')

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('mount', () => {
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

  it('update', () => {
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
})