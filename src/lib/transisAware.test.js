import transisAware from './transisAware' // sometimes two instance of transis occurs

import { shallow, mount, render } from 'enzyme'
import React, { Component } from 'react'
import Transis from 'transis'
import { JSDOM } from 'jsdom'

// setup for enzyme to mount
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = { userAgent: 'node.js' };
copyProps(window, global);
// end of setup for enzyme to mount

// TODO: delet this
test('HelloWorld renders `Hello World`', () => {
  const HelloWorld = () => <h1>Hello World</h1>
  expect(shallow(<HelloWorld/>).find('h1').text()).toEqual('Hello World')
})
// END OF delete

test(
  'expect same instance of transis',
  () => expect(Transis).toEqual(transisAware.Transis)
)

const Model = Transis.Object.extend(function() {
  this.prop('foo')
  this.prop('bar')
  this.prop('baz')
  this.prototype.reset = function() {
    this.foo = 'foo 1';
    this.bar = 'bar 1';
    this.baz = 'baz 1';
  }
})
const model = new Model()

class CoreComponent extends Component {
  componentWillMount () {
    // console.warn('Props Mixin Test have been mounted', this.props)
  }
  render() {
    if (!this.props.model) return false
    const { foo, bar, baz } = this.props.model
    return <div>
      <div className="foo">{foo}</div>
      <div className="bar">{bar}</div>
      <div className="baz">{baz}</div>
    </div>
  }
}

test('Without props mixin will NOT update', () => {
  model.reset()
  const noMixin = mount(<CoreComponent model={model}/>)
  model.foo = 'foo 2'
  Transis.Object.flush() // needed for running this single test
  expect(noMixin.find('.foo').text()).toBe('foo 1')
  noMixin.unmount()
})

describe('PropMixin', function() {
  // with prop mixin
  const PropMixinComponent = transisAware({
    props: {
      model: ['foo', 'bar']
    }
  }, CoreComponent)
  let component;

  beforeEach(() => {
    model.reset()
    component = mount(<PropMixinComponent model={model}/>)
  })
  afterEach(() => component.unmount())

  test('initially', () => {
    expect(component.find('.foo').text()).toBe('foo 1')
  })

  test('Changes w/ props mixins', () => {
    model.foo = 'foo 2'
    Transis.Object.flush() // needed for running this single test
    expect(component.find('.foo').text()).toBe('foo 2')
  })
})

describe('StateMixin', () => {
  const AppState = Transis.Object.extend(function() {
    this.prop('model')
  })
  window.appState = new AppState({ model: new Model })
  // with state mixin
  const StateMixinComponent = transisAware({
    global: window.appState,
    state: {
      model: ['baz']
    }
  }, CoreComponent)
  let component;

  beforeEach(() => {
    window.appState.model.reset()
    component = mount(<StateMixinComponent />)
  })
  afterEach(() => component.unmount())

  test('initially', () => {
    expect(component.find('.foo').text()).toBe('foo 1')
    expect(component.find('.bar').text()).toBe('bar 1')
    expect(component.find('.baz').text()).toBe('baz 1')
  })

  test('Changes w/ state mixins', () => {
    model.foo = 'foo 2'
    model.bar = 'bar 2'
    model.baz = 'baz 2'
    Transis.Object.flush() // needed for running this single test
    expect(component.find('.foo').text()).toBe('foo 1')
    expect(component.find('.bar').text()).toBe('bar 1')
    expect(component.find('.baz').text()).toBe('baz 2')
  })
})