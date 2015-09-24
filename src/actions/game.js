import random from 'random-seed'
import { range } from 'lodash'
import { COLS, ROWS, SIZE } from '../constants/Board'

const rand = random.create()
const startRow = (ROWS - COLS)

export const NEW_GAME = 'NEW_GAME'
export const GAME_OVER = 'GAME_OVER'
export const INCREMENT_STEPS = 'INCREMENT_STEPS'

export function incrementSteps() {
    return {
        type: INCREMENT_STEPS
    }
}

export function startNewGame() {
    const positions = range(startRow * COLS, SIZE, 1).sort(() => 0.5 - rand.random())
    return {
        type: NEW_GAME,
        positions
    }
}

export function gameOver() {
    return {
        type: GAME_OVER
    }
}

