export const NEW_GAME = 'NEW_GAME';
export const GAME_OVER = 'GAME_OVER';
export const INCREMENT_STEPS = 'INCREMENT_STEPS';

export function incrementSteps() {
    return {
        type: INCREMENT_STEPS
    };
}

export function startNewGame() {
    return {
        type: NEW_GAME
    };
}

export function gameOver() {
    return {
        type: GAME_OVER
    };
}

