import {
  assignTransisIdTo,
  componentComparison,
  queueUpdate, updateQueue,
  logUpdate, updateLog,
} from './helper'



describe('#assignTransisIdTo', () => {
  test('increments each time called', () => {
    const obj1 = {}, obj2 = {}, obj3 = {}
    assignTransisIdTo(obj1)
    expect(obj1._transisId).toBe(1)
    assignTransisIdTo(obj1) // does not influence
    assignTransisIdTo(obj2)
    expect(obj2._transisId).toBe(2)
    assignTransisIdTo(obj3)
    expect(obj3._transisId).toBe(3)
  })
})

const item1 = { _transisId: 255 }
describe('updateQueue<Hash> and #queueUpdate', () => {
  test('#queueUpdate adds `[transisId]: item` onto updateQueue{}', () => {
    expect(updateQueue).toEqual({})
    queueUpdate(item1)
    expect(updateQueue).toEqual({ 255: item1 })
  })
})

describe('logUpdate<Hash> and #updateLog', () => {
  test('#logUpdate adds `[transisId]: item` onto updateLog{}', () => {
    expect(updateLog).toEqual({})
    logUpdate(item1)
    expect(updateLog).toEqual({ 255: true })
  })
})

describe('PRIVATE#componentComparison', () => {
  test('should sort items with _transisId in ASC order', () => {
    const item1 = { _transisId: 1 }
    const item2 = { _transisId: 2 }
    const item3 = { _transisId: 3 }
    expect([item3, item1, item2].sort(componentComparison)).toEqual([item1, item2, item3])
  })
})