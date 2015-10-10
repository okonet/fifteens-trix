import { NEW_GAME, GAME_OVER, INCREMENT_MOVES } from '../actions/game';

const initialState = {
    isGameOver: false,
    moves: 0
};

export default function game(state = initialState, action) {
    switch (action.type) {
        case INCREMENT_MOVES:
            return {
                ...state,
                moves: state.moves + 1
            }

        case GAME_OVER:
            return {
                ...state,
                isGameOver: true
            }

        case NEW_GAME:
            return {
                ...state,
                isGameOver: false,
                moves: 0
            }

        default:
            return state;
    }
}
