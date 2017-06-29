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

describe('PropMixin', function() {
  const Model = Transis.Object.extend(function() {
    this.prop('foo')
    this.prop('bar')
    this.prop('baz')
  })

  class PropMixinCore extends Component {
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

  // mixins
  const PropMixinComponent = transisAware({
    props: {
      model: ['foo', 'bar']
    }
  }, PropMixinCore)

  const model = new Model({ foo: 'foo 1' })
  let component;

  beforeEach(() => {
    component = mount(<PropMixinComponent model={model}/>)
  })
  afterEach(() => component.unmount())

  test(
    'expect same instance of transis',
    () => expect(Transis).toEqual(transisAware.Transis)
  )

  test('initially', () => {
    expect(component.find('.foo').text()).toBe('foo 1')
  })

  test('W/O props mixin no update', () => {
    const noMixin = mount(<PropMixinCore model={model}/>)
    model.foo = 'foo 2'
    Transis.Object.flush() // needed for running this single test
    expect(noMixin.find('.foo').text()).toBe('foo 1')
  })

  test('props mixins', () => {
    model.foo = 'foo 2'
    Transis.Object.flush() // needed for running this single test
    expect(component.find('.foo').text()).toBe('foo 2')
  })
})
