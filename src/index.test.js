import transisAware, { StateMixin, PropsMixin, TransisProvider } from './index'

test('export is working', () => {
  expect(typeof transisAware).toBe('function')
  expect(transisAware.name).toBe('transisAware')

  expect(typeof TransisProvider).toBe('function')
  expect(TransisProvider.name).toBe('TransisProvider')

  expect(typeof StateMixin).toBe('function')
  expect(StateMixin.name).toBe('StateMixinLegacy')

  expect(typeof PropsMixin).toBe('function')
  expect(PropsMixin.name).toBe('PropsMixinLegacy')
})
