import React, { Component, PropTypes } from 'react'
import { COLS, ROWS, SIZE } from '../constants/Board'
import { range } from 'lodash'
import Tile from './Tile'

const styles = {
    row: {
        position: 'relative',
        flexDirection: 'row'
    }
}

export default class Board extends Component {

    static propTypes = {
        tiles: PropTypes.array.isRequired
    }

    render() {
        const { tiles } = this.props;
        return (
            <div style={styles.row}>
            {
                tiles.map((tile, idx) => {
                    return (
                        <Tile
                            type={tile.type}
                            position={tile.pos}
                            key={idx} />
                    )
                })
            }
            </div>
        );
    }
}

