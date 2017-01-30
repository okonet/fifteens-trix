/* eslint import/prefer-default-export: 0 */

import { getTileWithPosition } from './utils'
import { incrementMoves } from '../Game/actions'

export function playTile(position: number) {
  return (dispatch, getState) => {
    const { tiles } = getState().board
    const tile = getTileWithPosition(tiles, position)
    if (tile.isPlayable) {
      dispatch({
        type: 'PLAY_TILE',
        position
      })
      dispatch(incrementMoves())
    }
  }
}
