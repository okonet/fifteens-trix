import { range, findWhere, merge } from 'lodash'
import random from 'random-seed'
import { NEW_GAME } from '../actions/game'
import { PLAY_TILE } from '../actions/board'
import { COLS, ROWS, SIZE } from '../constants/Board'

const rand = random.create()
const initialState = []
const startRow = (ROWS - COLS)

export default function tiles(state = initialState, action) {
    console.log(action.type)
    switch (action.type) {
        case NEW_GAME:
            rand.initState()
            const emptyBoard = []
            const filledBoard = []
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const idx = row * COLS + col
                    if (row >= startRow) {
                        filledBoard.push({
                            type: idx === (SIZE - 1)  ? -1 : row - startRow + 1,
                            pos: idx
                        })
                    } else {
                        emptyBoard.push({
                            type: 0,
                            pos: idx
                        })
                    }
                }
            }

            console.log(111)

            const positions = range(startRow * COLS, SIZE, 1).sort(() => 0.5 - rand.random())
            filledBoard.forEach((tile, idx) => {
                tile.pos = positions[idx]
            })

            return [...emptyBoard, ...filledBoard]

        case PLAY_TILE:
            const {position} = action
            const tileWithPosition = findWhere(state, {pos: position})
            const emptyTile = findWhere(state, {type: -1})
            const emptyTilePosition = emptyTile.pos
            tileWithPosition.pos = emptyTilePosition
            emptyTile.pos = position
            return merge(state, tileWithPosition, emptyTile)

        default:
            return state
    }
}
