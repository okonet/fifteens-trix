import { range, findWhere, sortBy } from 'lodash'
import { NEW_GAME } from '../actions/game'
import { PLAY_TILE } from '../actions/board'
import { COLS, ROWS, SIZE } from '../constants/Board'

const initialState = []
const startRow = (ROWS - COLS)

export default function tiles(state = initialState, action) {
    switch (action.type) {
        case NEW_GAME:
            const emptyBoard = range(0, startRow * COLS, 1).map(index => {
                return {type: 0, index}
            })

            let filledBoard = []
            for (let row = startRow; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const idx = row * COLS + col
                    filledBoard.push({
                        type: idx === (SIZE - 1)  ? -1 : row - startRow + 1,
                        index: idx
                    })
                }
            }
            filledBoard = sortBy(filledBoard, (item, idx) => action.positions[idx])

            return [...emptyBoard, ...filledBoard]

        case PLAY_TILE:
            const { position } = action
            const emptyTile = findWhere(state, {index: SIZE - 1})
            const emptyTilePosition = state.indexOf(emptyTile)
            state[emptyTilePosition] = state.splice(position, 1, state[emptyTilePosition])[0]
            return [...state]

        default:
            return state
    }
}
