import { getTileWithPosition } from './reducer'
import { incrementMoves } from '../Game/actions'

export const PLAY_TILE = 'PLAY_TILE'

export function playTile(position: number) {
  return (dispatch, getState) => {
    const { board } = getState()
    const tile = getTileWithPosition(board, position)

    if (tile.isPlayable) {
      dispatch({
        type: PLAY_TILE,
        position
      })
      dispatch(incrementMoves())
    }
  }
}
