import { range, find, map } from 'lodash'
import { NEW_GAME } from '../Game/actions'
import { PLAY_TILE } from './actions'
import { COLS, ROWS, SIZE } from './constants'
import type { TileType } from './types'

const initialState = []
const startRow = (ROWS - COLS)

export function getTileWithPosition(items: Array<TileType>, position: number): TileType {
  return find(items, { position })
}

export function getEmptyTilePos(items: Array<TileType>): number {
  return find(items, { type: -1 }).position
}

export function getPositions(items: Array<TileType>): Array<number> {
  return map(items, 'position')
}

export function getCol(position: number, cols: number): number {
  return position % cols
}

export function getRow(position: number, cols: number): number {
  return ~~(position / cols)
}

export function isSameCol(posA: number, posB: number, cols: number): boolean {
  return getCol(posA, cols) === getCol(posB, cols)
}

export function isSameRow(posA: number, posB: number, cols: number): boolean {
  return getRow(posA, cols) === getRow(posB, cols)
}

export function getPlayableTiles(items: Array<TileType>, cols: number = COLS): Array<TileType> {
  const emptyPos = getEmptyTilePos(items)
  return items.map(item => {
    const { type, position } = item
    const isPlayable = type > 0
      && (isSameCol(position, emptyPos, cols) || isSameRow(position, emptyPos, cols))
    return { ...item, isPlayable }
  })
}

export function swapPositions(
  items: Array<TileType>,
  posA: number,
  posB: number,
  cols: number = COLS): Array<TileType> {
  const positions = getPositions(items).map(pos => {
    if (isSameRow(posA, posB, cols)) {
      if (posA <= pos && pos < posB) {
        return pos + 1
      }
      if (posB < pos && pos <= posA) {
        return pos - 1
      }
    } else if (isSameCol(posA, posB, cols)) {
      if (posA <= pos && pos < posB && isSameCol(pos, posA, cols)) {
        return pos + cols
      }
      if (posB < pos && pos <= posA && isSameCol(pos, posA, cols)) {
        return pos - cols
      }
    }
    if (pos === posB) {
      return posA
    }
    return pos
  })

  return items.map((tile, idx) => ({
    ...tile,
    position: positions[idx]
  }))
}

export default function tiles(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME: {
      const emptyBoard = range(0, startRow * COLS, 1).map(position => ({
        type: 0,
        position
      }))

      let filledBoard = []
      for (let row = startRow; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const position = (row * COLS) + col
          const isEmpty = position === (SIZE - 1)
          filledBoard.push({
            type: isEmpty ? -1 : (row - startRow) + 1,
            position
          })
        }
      }
      filledBoard = filledBoard.map((item, idx) => ({
        ...item,
        position: action.positions[idx]
      }))

      return getPlayableTiles([...emptyBoard, ...filledBoard])
    }

    case PLAY_TILE: {
      const { position } = action
      const emptyTilePos = getEmptyTilePos(state)
      const tileToPlay = getTileWithPosition(state, position)
      if (tileToPlay.isPlayable) {
        return getPlayableTiles(
          swapPositions(state, position, emptyTilePos)
        )
      }
      return state
    }

    default: {
      return state
    }
  }
}