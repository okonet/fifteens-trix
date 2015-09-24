import { COLS } from '../constants/Board'
export const PLAY_TILE = 'PLAY_TILE'
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'

export function playTile(position: number) {
    return (dispatch, getState) => {
        const { tiles } = getState()
        const emptyTile = tiles.find(tile => tile.type === -1)
        const emptyPos = tiles.indexOf(emptyTile)
        const delta = Math.abs(position - emptyPos)

        if (delta === 1 || delta === COLS) {
            if (emptyPos % COLS === 0 && position === (emptyPos - 1)) {
                return // Empty is in last row. Next tile can not be played
            }  else if ((emptyPos + 1) % COLS === 0 && position === (emptyPos + 1)) {
                return // Empty is in first row. Previous tile can not be played
            }
            dispatch({
                type: PLAY_TILE,
                position
            });
        }

        return
    };
}
