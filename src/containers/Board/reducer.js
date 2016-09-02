import { range } from 'lodash'
import { NEW_GAME } from '../Game/actions'
import { PLAY_TILE } from './actions'
import { COLS, ROWS, SIZE } from './constants'
import {
  getTileWithPosition,
  getEmptyTilePos,
  getPlayableTiles,
  swapPositions,
  getPositions,
  mapPositionsToTiles
} from './utils'

const initialState = []
const startRow = (ROWS - COLS)

export default function tiles(state = initialState, action) {
  switch (action.type) {
    case NEW_GAME: {
      const emptyBoard = range(0, startRow * COLS, 1).map(position => ({
        type: 0,
        position
      }))

      const filledBoard = []
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

      return getPlayableTiles([
        ...emptyBoard,
        ...mapPositionsToTiles(filledBoard, action.positions)
      ])
    }

    case PLAY_TILE: {
      const { position } = action
      const emptyTilePos = getEmptyTilePos(state)
      const tileToPlay = getTileWithPosition(state, position)
      if (tileToPlay.isPlayable) {
        const newPositions = swapPositions(getPositions(state), position, emptyTilePos)
        return getPlayableTiles(mapPositionsToTiles(state, newPositions))
      }
      return state
    }

    default: {
      return state
    }
  }
}
