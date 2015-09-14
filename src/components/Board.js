import React, { Component, PropTypes } from 'react';

export default class Board extends Component {

    static propTypes = {
        tiles: PropTypes.array.isRequired
    }

    render() {
        const { tiles } = this.props;
        return (
            <h2>{tiles.join(', ')}</h2>
        );
    }
}


