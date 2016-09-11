import random from 'random-seed'
import { range } from 'lodash'
import { NEW_GAME } from '../Game/actions'
import { PLAY_TILE } from './actions'
import { COLS, ROWS } from './constants'
import {
  getTileWithPosition,
  getEmptyTilePos,
  getPlayableTiles,
  swapPositions,
  getPositions,
  mapPositionsToTiles
} from './utils'

const initialState = {
  tiles: [],
  cols: COLS,
  rows: ROWS
}

export default function Board(state = initialState, action) {
  const { cols, rows, tiles } = state
  const size = cols * rows
  switch (action.type) {
    case NEW_GAME: {
      const { seed } = action
      const rand = random.create(seed)
      const startRow = (rows - cols)
      const positions = range(startRow * cols, size).sort(() => 0.5 - rand.random())
      const newBoard = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const position = (row * cols) + col
          const isEmpty = position === (size - 1)
          if (row < startRow) {
            newBoard.push({
              type: 0,
              position
            })
          } else {
            newBoard.push({
              type: isEmpty ? -1 : (row - startRow) + 1,
              position: positions[position - (startRow * cols)]
            })
          }
        }
      }

      return {
        ...state,
        tiles: getPlayableTiles(newBoard)
      }
    }

    case PLAY_TILE: {
      const { position } = action
      const emptyTilePos = getEmptyTilePos(tiles)
      const tileToPlay = getTileWithPosition(tiles, position)
      if (tileToPlay.isPlayable) {
        const newPositions = swapPositions(getPositions(tiles), position, emptyTilePos)
        return {
          ...state,
          tiles: getPlayableTiles(mapPositionsToTiles(tiles, newPositions))
        }
      }
      return state
    }

    default: {
      return state
    }
  }
}
