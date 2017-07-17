import transisReact, { StateMixin, PropsMixin } from './index'

test('export is working', () => {
  expect(typeof transisReact).toBe('function')
  expect(transisReact.name).toBe('transisReact')

  expect(typeof StateMixin).toBe('function')
  expect(StateMixin.name).toBe('StateMixin') // fails when ran with coverage, probably due to istanbul code compile

  expect(typeof PropsMixin).toBe('function')
  expect(PropsMixin.name).toBe('PropsMixin')
})
