import transisAware from './transisAware'
import { shallow } from 'enzyme'
import React, { Component } from 'react'

describe('HelloWorld', () => {
  const HelloWorld = () => <h1>Hello World</h1>

  it('renders `Hello World`', () =>
    expect(shallow(<HelloWorld/>).find('h1').text()).toEqual('Hello World')
  )
})

