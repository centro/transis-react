// import transisAware from './transisAware'
import transisAware from '../../dist/transis-react'

import { shallow, mount, render } from 'enzyme'
import React, { Component } from 'react'
import Transis from 'transis'

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

  const PropMixinComponent = transisAware({
    props: {
      model: ['foo', 'bar']
    }
  }, class PropMixinTest extends Component {
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
  })

  const model = new Model({
    foo: 'init foo'
  })
  const component = render(<PropMixinComponent model={model}/>)

  beforeEach(() => {
    // console.warn('ran')
    model.foo = 'foo value'
    model.bar = 'bar value'
    model.baz = 'baz value'
  })

  test('expect same instance of transis', () => {
    expect(Transis).toEqual(transisAware.Transis)
  })

  test('initially', () => {
    expect(component.find('.foo').text()).toBe('init foo')
  })

  test.only('props mixins', () => {
    // var spy = jest.spyOn(component.constructor.prototype, 'forceUpdate')
    // component.forceUpdate()
    model.foo = 'foo value'
    Transis.Object.flush()
    // expect(spy).toHaveBeenCalled()
    // console.warn('DEBUGGING')
    // console.warn(model)
    // console.warn(component)
    // expect(component.find('.foo').text()).toBe('foo value')
  })
})
