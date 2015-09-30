import { range, findWhere, sortBy } from 'lodash'
import { NEW_GAME } from '../actions/game'
import { PLAY_TILE } from '../actions/board'
import { COLS, ROWS, SIZE } from '../constants/Board'

const initialState = []
const startRow = (ROWS - COLS)

function getEmptyTilePos(items) {
    return items.indexOf(findWhere(items, {index: SIZE - 1}))
}

function updatePlayableTiles(items) {
    const emptyIdx = getEmptyTilePos(items)
    const emptyRow = ~~(emptyIdx / COLS)
    return items.map((item, idx) => {
        const delta = (idx - emptyIdx)
        const isSameCol = Math.abs(delta) % COLS === 0
        const isSameRow = ~~(idx / COLS) === emptyRow
        const isPlayable = isSameCol || isSameRow
        return {...item, isPlayable}
    })
}

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
                    const isEmpty = idx === (SIZE - 1)
                    filledBoard.push({
                        type: isEmpty ? -1 : row - startRow + 1,
                        index: idx
                    })
                }
            }
            filledBoard = sortBy(filledBoard, (item, idx) => action.positions[idx])

            return updatePlayableTiles([...emptyBoard, ...filledBoard])

        case PLAY_TILE:
            const { position } = action

            const emptyTilePosition = getEmptyTilePos(state)
            state[emptyTilePosition] = state.splice(position, 1, state[emptyTilePosition])[0]
            return updatePlayableTiles([...state])

        default:
            return state
    }
}
