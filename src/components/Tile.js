import React, { Component, PropTypes } from 'react'
import {Spring} from 'react-motion'
import { COLS } from '../constants/Board'

const TILE_SIZE = 60
const basicStyles = {
    position: 'absolute',
    border: '1px solid',
    width: TILE_SIZE,
    height: TILE_SIZE
}

export default class Tile extends Component {

    static propTypes = {
        type: PropTypes.number.isRequired,
        position: PropTypes.number.isRequired
    }

    getLeftValue(position) {
        return (position % COLS) * TILE_SIZE
    }

    getTopValue(position) {
        return (Math.ceil((position + 1) / COLS) - 1) * TILE_SIZE
    }

    render() {
        const {type, position} = this.props
        return (
            <Spring
                endValue={{val: {left: this.getLeftValue(position), top: this.getTopValue(position)}}}
            >
                {interpolated =>
                    <div style={{
                        ...basicStyles,
                        top: interpolated.val.top,
                        left: interpolated.val.left
                    }}>{type}</div>
                }
            </Spring>
        )
    }
}
