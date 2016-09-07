import { getTileWithPosition } from './utils'
import { incrementMoves } from '../Game/actions'

export const PLAY_TILE = 'PLAY_TILE'

export function playTile(position: number) {
  return (dispatch, getState) => {
    const { tiles } = getState().board
    const tile = getTileWithPosition(tiles, position)
    if (tile.isPlayable) {
      dispatch({
        type: PLAY_TILE,
        position
      })
      dispatch(incrementMoves())
    }
  }
}
