import React, { Component, PropTypes } from 'react'
import { Motion, spring, presets } from 'react-motion'
import { COLS } from '../containers/Board/constants'

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

  state = {
    offsetX: 0,
    offsetY: 0
  }

  onClick(position) {
    if (this.props.onClickCb) {
      this.props.onClickCb(position)
    }
  }

  onTouchStart = (evt) => {
    evt.preventDefault()
    if (!this.props.isPlayable) return
    const touch = evt.touches[0]
    this.initialTouchPosition = {
      x: touch.clientX,
      y: touch.clientY
    }
    this.setState({
      isTouched: true
    })
  }

  onTouchMove = (evt) => {
    evt.preventDefault()
    const touch = evt.touches[0]
    if (this.state.isTouched) {
      this.setState({
        offsetX: touch.clientX - this.initialTouchPosition.x,
        offsetY: touch.clientY - this.initialTouchPosition.y
      })
    }
  }

  onTouchEnd = () => {
    this.initialTouchPosition = null
    this.setState({
      isTouched: false,
      offsetX: 0,
      offsetY: 0
    })
  }

  getLeftValue(position: number): number {
    const { offsetX } = this.state
    return offsetX + ((position % COLS) * TILE_SIZE)
  }

  getTopValue(position: number): number {
    const { offsetY } = this.state
    return offsetY + ((Math.ceil((position + 1) / COLS) - 1) * TILE_SIZE)
  }

  getPosition(position: number): Object {
    const springSettings = presets.stiff
    return {
      left: spring(this.getLeftValue(position), springSettings),
      top: spring(this.getTopValue(position), springSettings)
    }
  }

  render() {
    const { type, position, isPlayable } = this.props
    return (
            <Motion style={this.getPosition(position)}>
                {interpolatedStyle =>
                    <div
                      style={{
                        ...basicStyles,
                        opacity: type <= 0 ? 0.1 : 1,
                        borderColor: isPlayable ? '#0c0' : '#000',
                        transform: `translate(${interpolatedStyle.left}px, ${interpolatedStyle.top}px)`
                      }}
                      onClick={this.onClick.bind(this, position)}
                      onTouchStart={this.onTouchStart}
                      onTouchMove={this.onTouchMove}
                      onTouchEnd={this.onTouchEnd}
                    >
                        {type}
                    </div>
                }
            </Motion>
        )
  }
}
