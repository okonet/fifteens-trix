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
      seed: '1'
    })

    expect(state.tiles).toBeInstanceOf(Array)
    expect(state.tiles.length).toEqual(18)

    // First rows should be empty
    for (let i = 0; i < 9; i++) {
      expect(state.tiles[i]).toEqual({ type: 0, position: i })
    }

    // Should include all possible positions
    for (let i = 0; i < 18; i++) {
      const keys = Object.keys(state.tiles[i])
      expect(keys).toContain('type')
      expect(keys).toContain('position')
      expect(state.tiles.map(tile => tile.position)).toContain(i)
    }

    // Positions should be randomized
    expect(state.tiles.map(t => t.position))
      .not.toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])

    expect(state.cols).toEqual(3)
    expect(state.rows).toEqual(6)
  })

  it('should not handle PLAY_TILE action for non-playable tiles', () => {
    const initialState = {
      tiles: [
        { type: 1, position: 0 },
        { type: 1, position: 1 },
        { type: 2, position: 2 },
        { type: 2, position: 3 },
        { type: 3, position: 4 },
        { type: 1, position: 5 },
        { type: -1, position: 6 },
        { type: 2, position: 7 },
        { type: 2, position: 8 }
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
        { type: 1, position: 0 },
        { type: 1, position: 1 },
        { type: 2, position: 2 },
        { type: 2, position: 3 },
        { type: 3, position: 4 },
        { type: 1, position: 5 },
        { type: -1, position: 6 },
        { type: 2, position: 7 },
        { type: 2, position: 8 }
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
        { type: 1, position: 3 },
        { type: 1, position: 1 },
        { type: 2, position: 2 },
        { type: 2, position: 6 },
        { type: 3, position: 4 },
        { type: 1, position: 5 },
        { type: -1, position: 0 },
        { type: 2, position: 7 },
        { type: 2, position: 8 }
      ],
      cols: 3,
      rows: 3
    })
  })

  it.skip('should handle CHECK_BOARD action', () => {
    const initialState = {
      tiles: [
        { type: 1, position: 0 },
        { type: 1, position: 1 },
        { type: 1, position: 2 },
        { type: 2, position: 3 },
        { type: 3, position: 4 },
        { type: 1, position: 5 },
        { type: -1, position: 6 },
        { type: 2, position: 7 },
        { type: 2, position: 8 }
      ],
      cols: 3,
      rows: 3
    }
    const state = reducer(initialState, {
      type: 'CHECK_BOARD'
    })
    expect(state).toEqual({
      tiles: [
        { type: 0, position: 0 },
        { type: 0, position: 1 },
        { type: 0, position: 2 },
        { type: 2, position: 3 },
        { type: 3, position: 4 },
        { type: 1, position: 5 },
        { type: -1, position: 6 },
        { type: 2, position: 7 },
        { type: 2, position: 8 }
      ],
      cols: 3,
      rows: 3
    })
  })
})
