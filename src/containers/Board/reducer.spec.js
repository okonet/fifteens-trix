import expect from 'expect'
import reducer from './reducer'

describe('Board reducer', () => {
  it('should handle NEW_GAME action', () => {
    const initialState = []
    const state = reducer(initialState, {
      type: 'NEW_GAME',
      positions: [11, 9, 12, 14, 10, 16, 13, 17, 15]
    })
    expect(state).toEqual(
      [
        { type: 0, position: 0, isPlayable: false },
        { type: 0, position: 1, isPlayable: false },
        { type: 0, position: 2, isPlayable: false },
        { type: 0, position: 3, isPlayable: false },
        { type: 0, position: 4, isPlayable: false },
        { type: 0, position: 5, isPlayable: false },
        { type: 0, position: 6, isPlayable: false },
        { type: 0, position: 7, isPlayable: false },
        { type: 0, position: 8, isPlayable: false },
        { type: 1, position: 11, isPlayable: false },
        { type: 1, position: 9, isPlayable: true },
        { type: 1, position: 12, isPlayable: true },
        { type: 2, position: 14, isPlayable: false },
        { type: 2, position: 10, isPlayable: false },
        { type: 2, position: 16, isPlayable: true },
        { type: 3, position: 13, isPlayable: false },
        { type: 3, position: 17, isPlayable: true },
        { type: -1, position: 15, isPlayable: false }
      ]
    )
  })

  it('should handle PLAY_TILE action', () => {
    const initialState = [
      { type: 0, position: 0, isPlayable: false },
      { type: 0, position: 1, isPlayable: false },
      { type: 0, position: 2, isPlayable: false },
      { type: 0, position: 3, isPlayable: false },
      { type: 0, position: 4, isPlayable: false },
      { type: 0, position: 5, isPlayable: false },
      { type: 0, position: 6, isPlayable: false },
      { type: 0, position: 7, isPlayable: false },
      { type: 0, position: 8, isPlayable: false },
      { type: 1, position: 11, isPlayable: false },
      { type: 1, position: 9, isPlayable: true },
      { type: 1, position: 12, isPlayable: true },
      { type: 2, position: 14, isPlayable: false },
      { type: 2, position: 10, isPlayable: false },
      { type: 2, position: 16, isPlayable: true },
      { type: 3, position: 13, isPlayable: false },
      { type: 3, position: 17, isPlayable: true },
      { type: -1, position: 15, isPlayable: false }
    ]
    const state = reducer(initialState, {
      type: 'PLAY_TILE',
      position: 11
    })
    expect(state).toEqual(
      [
        { type: 0, position: 0, isPlayable: false },
        { type: 0, position: 1, isPlayable: false },
        { type: 0, position: 2, isPlayable: false },
        { type: 0, position: 3, isPlayable: false },
        { type: 0, position: 4, isPlayable: false },
        { type: 0, position: 5, isPlayable: false },
        { type: 0, position: 6, isPlayable: false },
        { type: 0, position: 7, isPlayable: false },
        { type: 0, position: 8, isPlayable: false },
        { type: 1, position: 11, isPlayable: false },
        { type: 1, position: 9, isPlayable: true },
        { type: 1, position: 12, isPlayable: true },
        { type: 2, position: 14, isPlayable: false },
        { type: 2, position: 10, isPlayable: false },
        { type: 2, position: 16, isPlayable: true },
        { type: 3, position: 13, isPlayable: false },
        { type: 3, position: 17, isPlayable: true },
        { type: -1, position: 15, isPlayable: false }
      ]
    )
  })
})
