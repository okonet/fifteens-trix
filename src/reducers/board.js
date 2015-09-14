import { NEW_GAME, GAME_OVER, INCREMENT_STEPS } from '../actions/game';

const COLS = 5
const ROWS = 8

const initialState = [1, 2, 3];

export default function game(state = initialState, action) {
    switch (action.type) {

    default:
        return state;
    }
}
