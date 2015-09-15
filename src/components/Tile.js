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
        position: PropTypes.number.isRequired,
        onClickCb: PropTypes.func
    }

    getLeftValue(position) {
        return (position % COLS) * TILE_SIZE
    }

    getTopValue(position) {
        return (Math.ceil((position + 1) / COLS) - 1) * TILE_SIZE
    }

    onClick(position) {
        if (this.props.onClickCb) {
            this.props.onClickCb(position)
        }
    }

    render() {
        const {type, position, index} = this.props
        return (
            <Spring
                endValue={{val: {left: this.getLeftValue(position), top: this.getTopValue(position)}}}
            >
                {interpolated =>
                    <div
                        style={{
                            ...basicStyles,
                            opacity: type === 0 ? 0.1 : 1,
                            top: interpolated.val.top,
                            left: interpolated.val.left
                        }}
                        onClick={this.onClick.bind(this, position)}
                    >{type} [{index}]</div>
                }
            </Spring>
        )
    }
}
