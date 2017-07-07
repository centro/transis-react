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
// rerender times, use jasmine if necessary

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
