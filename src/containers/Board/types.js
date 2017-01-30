// @flow

import type { NewGameActionType } from '../Game/types'

export type PlayTileActionType = {
  type: 'PLAY_TILE',
  position: number
}

export type BardActionType = NewGameActionType | PlayTileActionType

export type TileType = {
  position: number,
  type: number,
  isPlayable?: boolean
}

export type BoardStateType = {
  tiles: Array<TileType>,
  cols: number,
  rows: number
}
