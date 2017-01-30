// @flow

import random from 'random-seed'
import type { NewGameActionType, GameOverActionType, IncrementMovesActionType } from './types'

export function incrementMoves(): IncrementMovesActionType {
  return {
    type: 'INCREMENT_MOVES'
  }
}

export function startNewGame(): NewGameActionType {
  return {
    type: 'NEW_GAME',
    seed: random.create().string(6)
  }
}

export function gameOver(): GameOverActionType {
  return {
    type: 'GAME_OVER'
  }
}

