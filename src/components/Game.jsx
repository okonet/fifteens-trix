import React, { Component, PropTypes } from 'react'
import Board from '../containers/Board'

export default class Game extends Component {

  static propTypes = {
    steps: PropTypes.number.isRequired,
    isGameOver: PropTypes.bool.isRequired,
    startNewGame: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.startNewGame()
  }

  render() {
    const { steps, startNewGame } = this.props
    return (
            <div>
                <button onClick={startNewGame}>New game</button>
                <p>Moves: {steps}</p>
                <Board />
            </div>
        )
  }
}

