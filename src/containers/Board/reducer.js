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
      const startRow = (rows - cols)
      const emptyBoard = range(0, startRow * cols, 1).map(position => ({
        type: 0,
        position
      }))

      const filledBoard = []
      for (let row = startRow; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const position = (row * cols) + col
          const isEmpty = position === (size - 1)
          filledBoard.push({
            type: isEmpty ? -1 : (row - startRow) + 1,
            position
          })
        }
      }

      return {
        ...state,
        tiles: getPlayableTiles([
          ...emptyBoard,
          ...mapPositionsToTiles(filledBoard, action.positions)
        ])
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
