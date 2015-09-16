import React, { Component, PropTypes } from 'react'
import Tile from './Tile'
import { sortBy } from 'lodash'

const styles = {
    row: {
        position: 'relative',
        flexDirection: 'row'
    }
}

export default class Board extends Component {

    static propTypes = {
        tiles: PropTypes.array.isRequired,
        playTile: PropTypes.func.isRequired
    }

    render() {
        const { tiles } = this.props;
        return (
            <div style={styles.row}>
            {
                sortBy(tiles, 'index').map((tile) => {
                    return (
                        <Tile
                            type={tile.type}
                            position={tiles.indexOf(tile)}
                            key={tile.index}
                            index={tile.index}
                            onClickCb={this.props.playTile}
                        />
                    )
                })
            }
            </div>
        );
    }
}


