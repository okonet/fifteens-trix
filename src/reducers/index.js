import { combineReducers } from 'redux';
import counter from './counter';
import game from './game';
import board from './board';

const rootReducer = combineReducers({
    counter,
    game,
    board
});

export default rootReducer;
