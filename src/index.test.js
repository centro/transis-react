import transisAware, { StateMixin, PropsMixin } from './index'

test('export is working', () => {
  expect(typeof transisAware).toBe('function')
  expect(transisAware.name).toBe('transisAware')

  expect(typeof StateMixin).toBe('function')
  expect(StateMixin.name).toBe('StateMixinLegacy')

  expect(typeof PropsMixin).toBe('function')
  expect(PropsMixin.name).toBe('PropsMixin')
})
