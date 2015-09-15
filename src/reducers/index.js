import { combineReducers } from 'redux';
import game from './game';
import tiles from './board';

const rootReducer = combineReducers({
    game,
    tiles
});

export default rootReducer;
