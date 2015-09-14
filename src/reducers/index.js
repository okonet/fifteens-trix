import { combineReducers } from 'redux';
import game from './game';
import board from './board';

const rootReducer = combineReducers({
    game,
    board
});

export default rootReducer;
