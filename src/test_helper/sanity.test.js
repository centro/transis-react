import { Model, CoreComponent } from './testUtil'
import React from 'react'

it('HelloWorld renders `Hello World`', () => {
  const HelloWorld = () => <h1>Hello World</h1>
  expect(shallow(<HelloWorld/>).find('h1').text()).toEqual('Hello World')
})

import transisAware from 'transisAware' // sometimes

it('expect same instance of transis', () =>
  expect(Transis).toEqual(transisAware.Transis)
)

it('W/O PropMixin WILL NOT update', () => {
  const model = new Model
  const noMixin = mount(<CoreComponent model={model}/>)
  model.foo = 'foo 2'
  Transis.Object.flush()
  expect(noMixin.find('.foo').text()).toBe('')
})

describe('regular Component', () => {
  let component
  let renderParent = 0, renderChild = 0
  const ChildComp = ({ name, model }) => {
    renderChild++
    return <p>{name}, {model.name}</p>
  }
  class RegComp extends React.Component {
    constructor() { 
      super()
      this.state = { name: 'comp 1' }
    }
    render() {
      renderParent++
      return <div>
        {this.state.name}
        <ChildComp name={this.state.name} model={{ name }}/>
      </div>
    }
  }
  beforeEach(() => {
    component = mount(<RegComp />)
  })

  it('should only render children once', () => {
    expect(renderParent).toBe(1) 
    expect(renderChild).toBe(1)
    component.node.setState({ name: 'comp 2' })
    expect(renderParent).toBe(2) 
    expect(renderChild).toBe(2)
  })
})
