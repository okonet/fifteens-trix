import random from 'random-seed'

export const NEW_GAME = 'NEW_GAME'
export const GAME_OVER = 'GAME_OVER'
export const INCREMENT_MOVES = 'INCREMENT_MOVES'

export function incrementMoves() {
  return {
    type: INCREMENT_MOVES
  }
}

export function startNewGame() {
  return {
    type: NEW_GAME,
    seed: random.create().string(6)
  }
}

export function gameOver() {
  return {
    type: GAME_OVER
  }
}

