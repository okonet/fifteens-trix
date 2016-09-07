import React from 'react'
import Tile from './Tile'
import type { TileType } from '../containers/Board/types'

const styles = {
  row: {
    position: 'relative',
    flexDirection: 'row'
  }
}

const Board = (
  {
    tiles,
    cols,
    rows,
    playTile
  }: {
    tiles: Array<TileType>,
    cols: number,
    rows: number,
    playTile: Function
  }) => (
  <div style={styles.row}>
    {
      tiles.map((tile, idx) =>
        <Tile
          type={tile.type}
          position={tile.position}
          key={idx}
          index={idx}
          isPlayable={tile.isPlayable}
          onClick={playTile}
        />
      )
    }
  </div>
)

export default Board
