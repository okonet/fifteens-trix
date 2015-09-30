import React, { Component, PropTypes } from 'react'
import { Spring } from 'react-motion'
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
        isPlayable: PropTypes.bool,
        onClickCb: PropTypes.func
    }

    static defaultProps = {
        isPlayable: false
    }

    onClick(position) {
        if (this.props.onClickCb) {
            this.props.onClickCb(position)
        }
    }

    getLeftValue(position) {
        return (position % COLS) * TILE_SIZE
    }

    getTopValue(position) {
        return (Math.ceil((position + 1) / COLS) - 1) * TILE_SIZE
    }

    render() {
        const {type, position, isPlayable} = this.props
        return (
            <Spring
                endValue={{val: {left: this.getLeftValue(position), top: this.getTopValue(position)}}}
            >
                {interpolated =>
                    <div
                        style={{
                            ...basicStyles,
                            opacity: type <= 0 ? 0.1 : 1,
                            borderColor: isPlayable ? '#0c0' : '#000',
                            transform: `translate(${interpolated.val.left}px, ${interpolated.val.top}px)`
                        }}
                        onClick={this.onClick.bind(this, position)}
                    >{type}</div>
                }
            </Spring>
        )
    }
}
