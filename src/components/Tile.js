import React, { Component, PropTypes } from 'react'
import { COLS } from '../constants/Board'

const TILE_SIZE = 60
const basicStyles = {
    position: 'absolute',
    //flexGrow: 1,
    border: '1px solid',
    width: TILE_SIZE,
    height: TILE_SIZE
}

export default class Tile extends Component {

    static propTypes = {
        idx: PropTypes.number.isRequired,
        type: PropTypes.number.isRequired
    }

    getStyles(idx) {
        return {
            ...basicStyles,
            left: (idx % COLS) * TILE_SIZE,
            top: (Math.ceil((idx + 1) / COLS) - 1) * TILE_SIZE
        }
    }

    render() {
        const {type, idx} = this.props
        const styles = this.getStyles(idx)
        return (
            <div style={styles}>{type}</div>
        )
    }
}
