import { NEW_GAME, GAME_OVER, INCREMENT_STEPS } from '../actions/game';

const initialState = {
    isGameOver: false,
    steps: 0
};

export default function game(state = initialState, action) {
    switch (action.type) {
        case INCREMENT_STEPS:
            return {
                ...state,
                steps: state.steps + 1
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
                steps: 0
            }

        default:
            return state;
    }
}
