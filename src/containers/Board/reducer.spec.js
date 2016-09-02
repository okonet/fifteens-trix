import expect from 'expect'
import reducer from './reducer'

describe('board reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual([])
  })
})
