import { range, shuffle, merge } from 'lodash'
import { NEW_GAME, GAME_OVER, INCREMENT_STEPS } from '../actions/game'
import { COLS, ROWS } from '../constants/Board'

const SIZE = COLS * ROWS
const initialState = range(0, SIZE, 0)

export default function tiles(state = initialState, action) {
    switch (action.type) {
        case NEW_GAME:
            const emptyPart = range(0, (ROWS - COLS) * COLS, 0)
            const filledBoard = []
            for (let i = 0; i < COLS; i++) {
                for (let j = 0; j < COLS; j++) {
                    const idx = i * COLS + j
                    filledBoard[idx] = i + 1
                }
            }
            filledBoard[0] = 0 // Add empty tile to the filled board
            return [...emptyPart, ...shuffle(filledBoard)]

        default:
            return state;
    }
}
