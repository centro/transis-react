import helper, { 
  queueUpdate, updateQueue,
  logUpdate, updateLog,
} from './helper'


describe('#getId', () => {
  test('increments each time called', () => {
    expect(helper.getId).toBe(1)
    expect(helper.getId).toBe(2)
    expect(helper.getId).toBe(3)
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
