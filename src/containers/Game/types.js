// @flow

export type NewGameActionType = {
  type: 'NEW_GAME',
  seed: string
}

export type GameOverActionType = {
  type: 'GAME_OVER'
}

export type IncrementMovesActionType = {
  type: 'INCREMENT_MOVES'
}

export type GameActionType = NewGameActionType | GameOverActionType | IncrementMovesActionType

export type GameStateType = {
  moves: number,
  isGameOver: boolean
}

