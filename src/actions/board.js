export const PLAY_TILE = 'PLAY_TILE';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

export function playTile(position) {
    return {
        type: PLAY_TILE,
        position
    };
}

//export function playTile(position: number) {
//    return (dispatch, getState) => {
//        const { tiles } = getState();
//
//        if (counter % 2 === 0) {
//            return;
//        }
//
//        dispatch(increment());
//    };
//}
