import random from 'random-seed'
import { range } from 'lodash'
import { COLS, ROWS } from '../Board/constants'

const rand = random.create()

export const NEW_GAME = 'NEW_GAME'
export const GAME_OVER = 'GAME_OVER'
export const INCREMENT_MOVES = 'INCREMENT_MOVES'

export function incrementMoves() {
  return {
    type: INCREMENT_MOVES
  }
}

export function startNewGame(cols = COLS, rows = ROWS) {
  const startRow = (rows - cols)
  const size = cols * rows
  const positions = range(startRow * cols, size, 1).sort(() => 0.5 - rand.random())
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


