import { TransisProvider } from 'transisAware' // sometimes two instance of transis occurs

import {
  Model, CoreComponent, TransisObjectFactory,
  initial_state_expectation, state_change_sequence_expectation,
} from './helper/testUtil'

let component;
const model = new Model()

describe('PropProvider', function() {
  const PropProvider = () =>
    <TransisProvider model={model} mixProps={{ model: ['foo', 'bar'] }}>
      <CoreComponent />
    </TransisProvider>

  beforeEach(() => {
    model.reset()
    component = mount(<PropProvider />)
  })
  afterEach(() => component.unmount())

  it('initially', () => expect(component.find('.foo').text()).toBe('foo 1'))

  it('Changes w/ props mixins', () => {
    model.foo = 'foo 2'
    Transis.Object.flush() // needed for running this single it
    expect(component.find('.foo').text()).toBe('foo 2')
  })
})

describe('StateProvider', () => {
  const appState = new (TransisObjectFactory('model'))({ model })

  const StateProviderComponent = () =>
    <TransisProvider
      global={appState}
      mixState={{ model: ['baz'] }}
    >
      <CoreComponent />
    </TransisProvider>

  beforeEach(() => {
    appState.model.reset()
    component = mount(<StateProviderComponent />)
  })
  afterEach(() => component.unmount())

  it('initially', () => initial_state_expectation({ component }) )

  it('Changes w/ state mixins', () => {
    state_change_sequence_expectation({
      model: appState.model,
      component
    })
  })

  describe('smart stateProvider parameters', () => {
    const DumbCore = props => <CoreComponent model={props} /> 
    const SmartProviderComponent = () =>
      <TransisProvider
        global={appState.model}
        mixState={['foo', 'bar', 'baz']}
      >
        <DumbCore/>
      </TransisProvider>

    it('understand argument (globalVar, "a", "b") as (globalVar, { a: [], b: []}) ', () => {
      initial_state_expectation({
        component: mount(<SmartProviderComponent />)
      })
    })
  })
})
