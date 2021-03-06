// @flow

import { find, map } from 'lodash'
import { COLS } from './constants'
import type { TileType } from './types'

export function getTileWithPosition(items: Array<TileType>, position: number): TileType {
  return find(items, { position })
}

export function getEmptyTilePos(items: Array<TileType>): number {
  return items.length ? find(items, { type: -1 }).position : -1
}

export function getPositions(items: Array<TileType>): Array<number> {
  return map(items, 'position')
}

export function getCol(position: number, cols: number): number {
  return position % cols
}

export function getRow(position: number, cols: number): number {
  return Math.floor(position / cols)
}

export function isSameCol(posA: number, posB: number, cols: number): boolean {
  return getCol(posA, cols) === getCol(posB, cols)
}

export function isSameRow(posA: number, posB: number, cols: number): boolean {
  return getRow(posA, cols) === getRow(posB, cols)
}

export function isTilePlayable(
  tile: TileType,
  emptyPos: number,
  cols: number): boolean {
  const { type, position } = tile
  return type > 0
    && (isSameCol(position, emptyPos, cols) || isSameRow(position, emptyPos, cols))
}

export function getPlayableTiles(
  tiles: Array<TileType>,
  cols: number = COLS): Array<TileType> {
  const emptyPos = getEmptyTilePos(tiles)
  return tiles.map(tile =>
    ({ ...tile, isPlayable: isTilePlayable(tile, emptyPos, cols) })
  )
}

export function mapPositionsToTiles(
  items: Array<TileType>,
  positions: Array<number>): Array<TileType> {
  return items.map((item, idx) => ({
    ...item,
    position: positions[idx]
  }))
}

export function swapPositions(
  positions: Array<number>,
  posA: number,
  posB: number,
  cols: number = COLS): Array<number> {
  return positions.map((pos) => {
    if (isSameRow(posA, posB, cols)) {
      if (posA <= pos && pos < posB) {
        return pos + 1
      }
      if (posB < pos && pos <= posA) {
        return pos - 1
      }
    } else if (isSameCol(posA, posB, cols)) {
      if (posA <= pos && pos < posB && isSameCol(pos, posA, cols)) {
        return pos + cols
      }
      if (posB < pos && pos <= posA && isSameCol(pos, posA, cols)) {
        return pos - cols
      }
    }
    if (pos === posB) {
      return posA
    }
    return pos
  })
}
