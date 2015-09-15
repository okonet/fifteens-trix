import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Game from '../components/Game';
import * as GameActions from '../actions/game';

function mapStateToProps(state) {
    return {
        steps: state.game.steps,
        isGameOver: state.game.isGameOver
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(GameActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);