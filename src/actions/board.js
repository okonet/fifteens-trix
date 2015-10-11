import { findWhere } from 'lodash'
export const PLAY_TILE = 'PLAY_TILE'

export function playTile(position: number) {
    return (dispatch, getState) => {
        const { board } = getState()
        const tile = findWhere(board, {position})

        if (tile.isPlayable) {
            dispatch({
                type: PLAY_TILE,
                position
            })
        }

        return
    }
}
