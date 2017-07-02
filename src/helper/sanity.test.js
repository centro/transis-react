import { Model, CoreComponent } from './testUtil'

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