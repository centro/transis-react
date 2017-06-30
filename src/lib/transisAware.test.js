import transisAware, { updateQueue } from './transisAware' // sometimes two instance of transis occurs

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
it('HelloWorld renders `Hello World`', () => {
  const HelloWorld = () => <h1>Hello World</h1>
  expect(shallow(<HelloWorld/>).find('h1').text()).toEqual('Hello World')
})
// END OF delete

it(
  'expect same instance of transis',
  () => expect(Transis).toEqual(transisAware.Transis)
)

const Model = Transis.Object.extend(function() {
  this.prop('id')
  this.prop('foo')
  this.prop('bar')
  this.prop('baz')
  this.prototype.reset = function() {
    this.foo = 'foo 1';
    this.bar = 'bar 1';
    this.baz = 'baz 1';
    Transis.Object.flush()
  }
})
const model = new Model({ id: 'prop mixin' })

class CoreComponent extends Component {
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

it('Without props mixin will NOT update', () => {
  model.reset()
  const noMixin = mount(<CoreComponent model={model}/>)
  model.foo = 'foo 2'
  Transis.Object.flush() // needed for running this single it
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
  const AppState = Transis.Object.extend(function() {
    this.prop('model')
  })
  const appState = new AppState({
    model: new Model({ id: 'state mixin' })
  })
  // with state mixin
  const StateMixinComponent = transisAware({
    global: appState,
    state: {
      model: ['baz']
    }
  }, class CoreComponent2 extends Component {
    render() {
      if (!this.props.model) return false
      const { foo, bar, baz } = this.props.model
      return <div>
        <div className="foo">{foo}</div>
        <div className="bar">{bar}</div>
        <div className="baz">{baz}</div>
      </div>
    }
  })
  let component;

  beforeEach(() => {
    appState.model.reset()
    component = mount(<StateMixinComponent />)
  })
  afterEach(() => component.unmount())

  it('initially', () => {
    expect(component.find('.foo').text()).toBe('foo 1')
    expect(component.find('.bar').text()).toBe('bar 1')
    expect(component.find('.baz').text()).toBe('baz 1')
  })

  it('Changes w/ state mixins', () => {
    appState.model.foo = 'foo 2'
    Transis.Object.flush()
    expect(component.find('.foo').text()).toBe('foo 1')

    appState.model.bar = 'bar 2'
    Transis.Object.flush()
    expect(component.find('.bar').text()).toBe('bar 1')

    appState.model.baz = 'baz 2'
    Transis.Object.flush()
    expect(component.find('.foo').text()).toBe('foo 2')
    expect(component.find('.bar').text()).toBe('bar 2')
    expect(component.find('.baz').text()).toBe('baz 2')
  })

  it('understand argument (globalVar, "a", "b") as (globalVar, { a: [], b: []}) ')
})