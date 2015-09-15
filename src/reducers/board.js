import { range, shuffle, merge } from 'lodash'
import { NEW_GAME, GAME_OVER, INCREMENT_STEPS } from '../actions/game'
import { COLS, ROWS, SIZE } from '../constants/Board'

const initialState = []
const startRow = (ROWS - COLS)

export default function tiles(state = initialState, action) {
    switch (action.type) {
        case NEW_GAME:
            const emptyBoard = []
            const filledBoard = []
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const idx = row * COLS + col
                    if (row >= startRow) {
                        filledBoard.push({
                            type: idx === (SIZE - 1)  ? 0 : row - startRow + 1,
                            pos: idx
                        })
                    } else {
                        emptyBoard.push({
                            type: 0,
                            pos: idx
                        })
                    }
                }
            }

            const positions = range(startRow * COLS, SIZE, 1).sort(() => 0.5 - Math.random())
            filledBoard.forEach((tile, idx) => {
                tile.pos = positions[idx]
            })

            return [...emptyBoard, ...filledBoard]

        default:
            return state;
    }
}
