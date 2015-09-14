import React, { Component, PropTypes } from 'react';
import Board from '../containers/Board'

export default class Game extends Component {

    static propTypes = {
        steps: PropTypes.number.isRequired,
        isGameOver: PropTypes.bool.isRequired,
        incrementSteps: PropTypes.func.isRequired,
        startNewGame: PropTypes.func.isRequired
    }

    render() {
        const { steps, incrementSteps, startNewGame } = this.props;
        return (
            <div>
                <button onClick={startNewGame}>New game</button>
                <h1 onClick={incrementSteps}>{steps}</h1>
                <Board/>
            </div>
        );
    }
}


