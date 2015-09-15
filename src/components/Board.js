import React, { Component, PropTypes } from 'react'
import Tile from './Tile'

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
                tiles.map((tile, idx) => {
                    return (
                        <Tile
                            type={tile.type}
                            position={tile.pos}
                            key={idx}
                            index={idx}
                            onClickCb={this.props.playTile}
                        />
                    )
                })
            }
            </div>
        );
    }
}


