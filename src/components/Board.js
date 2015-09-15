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
        tiles: PropTypes.array.isRequired
    }

    render() {
        const { tiles } = this.props;
        return (
            <div style={styles.row}>
            {
                tiles.map((value, i) => {
                    return <Tile type={value} idx={i} key={i} />
                })
            }
            </div>
        );
    }
}


