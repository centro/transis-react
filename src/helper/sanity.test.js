it('HelloWorld renders `Hello World`', () => {
  const HelloWorld = () => <h1>Hello World</h1>
  expect(shallow(<HelloWorld/>).find('h1').text()).toEqual('Hello World')
})

import transisAware from 'transisAware' // sometimes

it('expect same instance of transis', () =>
  expect(Transis).toEqual(transisAware.Transis)
)