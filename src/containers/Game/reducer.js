/* @flow */

import type { GameActionType, GameStateType } from './types'

const initialState = {
  isGameOver: false,
  moves: 0
}

export default function game(
  state: GameStateType = initialState,
  action: GameActionType
): GameStateType {
  switch (action.type) {
    case 'INCREMENT_MOVES':
    case 'PLAY_TILE':
      return {
        ...state,
        moves: state.moves + 1
      }

    case 'GAME_OVER':
      return {
        ...state,
        isGameOver: true
      }

    case 'NEW_GAME':
      return {
        ...state,
        isGameOver: false,
        moves: 0
      }

    default:
      return state
  }
}
