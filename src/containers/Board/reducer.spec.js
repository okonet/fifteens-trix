import expect from 'expect'
import reducer from './reducer'

describe('Board reducer', () => {
  it('should handle NEW_GAME action', () => {
    const initialState = {
      tiles: [],
      cols: 3,
      rows: 6
    }
    const state = reducer(initialState, {
      type: 'NEW_GAME',
      positions: [11, 9, 12, 14, 10, 16, 13, 17, 15]
    })
    expect(state).toEqual({
      tiles: [
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
      ],
      cols: 3,
      rows: 6
    })
  })

  it('should not handle PLAY_TILE action for non-playable tiles', () => {
    const initialState = {
      tiles: [
        { type: 1, position: 0, isPlayable: true },
        { type: 1, position: 1, isPlayable: false },
        { type: 2, position: 2, isPlayable: false },
        { type: 2, position: 3, isPlayable: true },
        { type: 3, position: 4, isPlayable: false },
        { type: 1, position: 5, isPlayable: false },
        { type: -1, position: 6, isPlayable: false },
        { type: 2, position: 7, isPlayable: true },
        { type: 2, position: 8, isPlayable: true }
      ],
      cols: 3,
      rows: 3
    }
    const state = reducer(initialState, {
      type: 'PLAY_TILE',
      position: 2
    })
    expect(state).toEqual(initialState)
  })

  it('should handle PLAY_TILE action', () => {
    const initialState = {
      tiles: [
        { type: 1, position: 0, isPlayable: true },
        { type: 1, position: 1, isPlayable: false },
        { type: 2, position: 2, isPlayable: false },
        { type: 2, position: 3, isPlayable: true },
        { type: 3, position: 4, isPlayable: false },
        { type: 1, position: 5, isPlayable: false },
        { type: -1, position: 6, isPlayable: false },
        { type: 2, position: 7, isPlayable: true },
        { type: 2, position: 8, isPlayable: true }
      ],
      cols: 3,
      rows: 3
    }
    const state = reducer(initialState, {
      type: 'PLAY_TILE',
      position: 0
    })
    expect(state).toEqual({
      tiles: [
        { type: 1, position: 3, isPlayable: true },
        { type: 1, position: 1, isPlayable: true },
        { type: 2, position: 2, isPlayable: true },
        { type: 2, position: 6, isPlayable: true },
        { type: 3, position: 4, isPlayable: false },
        { type: 1, position: 5, isPlayable: false },
        { type: -1, position: 0, isPlayable: false },
        { type: 2, position: 7, isPlayable: false },
        { type: 2, position: 8, isPlayable: false }
      ],
      cols: 3,
      rows: 3
    })
  })

  it('should handle CHECK_BOARD action', () => {
    const initialState = {
      tiles: [
        { type: 1, position: 0, isPlayable: true },
        { type: 1, position: 1, isPlayable: false },
        { type: 1, position: 2, isPlayable: false },
        { type: 2, position: 3, isPlayable: true },
        { type: 3, position: 4, isPlayable: false },
        { type: 1, position: 5, isPlayable: false },
        { type: -1, position: 6, isPlayable: false },
        { type: 2, position: 7, isPlayable: true },
        { type: 2, position: 8, isPlayable: true }
      ],
      cols: 3,
      rows: 3
    }
    const state = reducer(initialState, {
      type: 'CHECK_BOARD'
    })
    expect(state).toEqual({
      tiles: [
        { type: 0, position: 0, isPlayable: false },
        { type: 0, position: 1, isPlayable: false },
        { type: 0, position: 2, isPlayable: false },
        { type: 2, position: 3, isPlayable: true },
        { type: 3, position: 4, isPlayable: false },
        { type: 1, position: 5, isPlayable: false },
        { type: -1, position: 6, isPlayable: false },
        { type: 2, position: 7, isPlayable: true },
        { type: 2, position: 8, isPlayable: true }
      ],
      cols: 3,
      rows: 3
    })
  })
})
