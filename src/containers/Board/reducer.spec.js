import expect from 'expect'
import reducer, {
  getEmptyTilePos,
  getPlayableTiles,
  swapPositions,
  getPositions,
  getCol,
  getRow,
  isSameCol,
  isSameRow
} from './reducer'

describe('board reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual([])
  })

  describe('getPositions', () => {
    it('should return an Array of numbers with positions', () => {
      const tiles = [
        { type: -1, position: 0 },
        { type: 1, position: 1 }
      ]
      expect(getPositions(tiles).length).toEqual(2)
      expect(getPositions(tiles)).toEqual([0, 1])
    })
  })

  describe('getCol', () => {
    it('should return a column at which tile is positioned as a number', () => {
      expect(getCol(0, 3)).toEqual(0)
      expect(getCol(1, 3)).toEqual(1)
      expect(getCol(2, 3)).toEqual(2)
      expect(getCol(3, 3)).toEqual(0)
      expect(getCol(7, 3)).toEqual(1)
    })
  })

  describe('getRow', () => {
    it('should return a row at which tile is positioned as a number', () => {
      expect(getRow(0, 3)).toEqual(0)
      expect(getRow(1, 3)).toEqual(0)
      expect(getRow(2, 3)).toEqual(0)
      expect(getRow(3, 3)).toEqual(1)
      expect(getRow(7, 3)).toEqual(2)
    })
  })

  describe('isSameCol', () => {
    it('should return true if positions are on in the same column', () => {
      expect(isSameCol(0, 0, 3)).toEqual(true)
      expect(isSameCol(0, 1, 3)).toEqual(false)
      expect(isSameCol(0, 2, 3)).toEqual(false)
      expect(isSameCol(0, 3, 3)).toEqual(true)
    })
  })

  describe('isSameRow', () => {
    it('should return true if positions are on in the same row', () => {
      expect(isSameRow(0, 0, 3)).toEqual(true)
      expect(isSameRow(0, 1, 3)).toEqual(true)
      expect(isSameRow(0, 2, 3)).toEqual(true)
      expect(isSameRow(0, 3, 3)).toEqual(false)
      expect(isSameRow(0, 8, 3)).toEqual(false)
    })
  })

  describe('swapPositions', () => {
    it('should swap positions for nearby tiles', () => {
      const res = swapPositions([
        { type: -1, position: 0 },
        { type: 1, position: 1 }
      ], 0, 1, 2)
      expect(getPositions(res)).toEqual([1, 0])
    })

    it('should swap positions when moving a row of tiles horizontally to the left', () => {
      const res = swapPositions([
        { type: -1, position: 0 },
        { type: 1, position: 1 },
        { type: 2, position: 2 },
        { type: 3, position: 3 },
        { type: 4, position: 4 },
        { type: 5, position: 5 }
      ], 2, 0, 3)

      expect(getPositions(res)).toEqual([2, 0, 1, 3, 4, 5])
    })

    it('should swap positions when moving a row of tiles horizontally to the right', () => {
      const res = swapPositions([
        { type: -1, position: 2 },
        { type: 1, position: 0 },
        { type: 2, position: 1 },
        { type: 3, position: 3 },
        { type: 4, position: 4 },
        { type: 5, position: 5 }
      ], 0, 2, 3)

      expect(getPositions(res)).toEqual([0, 1, 2, 3, 4, 5])
    })

    it('should swap positions when moving a column of tiles vertically down', () => {
      const res = swapPositions([
        { type: -1, position: 6 },
        { type: 1, position: 1 },
        { type: 2, position: 2 },
        { type: 3, position: 0 },
        { type: 4, position: 4 },
        { type: 5, position: 5 },
        { type: 6, position: 3 },
        { type: 7, position: 7 },
        { type: 8, position: 8 }
      ], 0, 6, 3)

      expect(getPositions(res)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
    })

    it('should swap positions when moving a column of tiles vertically up', () => {
      const res = swapPositions([
        { type: -1, position: 0 },
        { type: 1, position: 1 },
        { type: 2, position: 2 },
        { type: 3, position: 3 },
        { type: 4, position: 4 },
        { type: 5, position: 5 },
        { type: 6, position: 6 },
        { type: 7, position: 7 },
        { type: 8, position: 8 }
      ], 6, 0, 3)

      expect(getPositions(res)).toEqual([6, 1, 2, 0, 4, 5, 3, 7, 8])
    })
  })

  it('getEmptyTilePos', () => {
    expect(getEmptyTilePos([
      {
        type: -1,
        position: 0
      }
    ])).toBe(0)

    expect(getEmptyTilePos([
      {
        type: -1,
        position: 10
      }
    ])).toBe(10)
  })

  it('updatePlayableTiles', () => {
    // 2x2
    expect(getPlayableTiles([
      { type: -1, position: 0 },
      { type: 1, position: 1 },
      { type: 1, position: 2 },
      { type: 1, position: 3 }
    ], 2)).toEqual([
      { type: -1, position: 0, isPlayable: false },
      { type: 1, position: 1, isPlayable: true },
      { type: 1, position: 2, isPlayable: true },
      { type: 1, position: 3, isPlayable: false }
    ])

    // 3x3
    expect(getPlayableTiles([
      { type: 1, position: 0 },
      { type: 1, position: 1 },
      { type: 1, position: 2 },
      { type: 1, position: 3 },
      { type: -1, position: 4 },
      { type: 0, position: 5 },
      { type: 1, position: 6 },
      { type: 1, position: 7 },
      { type: 1, position: 8 }
    ], 3)).toEqual([
      { type: 1, position: 0, isPlayable: false },
      { type: 1, position: 1, isPlayable: true },
      { type: 1, position: 2, isPlayable: false },
      { type: 1, position: 3, isPlayable: true },
      { type: -1, position: 4, isPlayable: false },
      { type: 0, position: 5, isPlayable: false },
      { type: 1, position: 6, isPlayable: false },
      { type: 1, position: 7, isPlayable: true },
      { type: 1, position: 8, isPlayable: false }
    ])
  })
})
