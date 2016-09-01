import { range, findWhere, pluck } from 'lodash'
import { NEW_GAME } from '../actions/game'
import { PLAY_TILE } from '../actions/board'
import { COLS, ROWS, SIZE } from '../constants/Board'

const initialState = []
const startRow = (ROWS - COLS)

export function getEmptyTilePos(items: Array<Object>): number {
    return findWhere(items, { type: -1 }).position
}

export function updatePlayableTiles(items: Array<Object>, cols: number = COLS): Array<Object> {
    const emptyPos = getEmptyTilePos(items)
    const emptyRow = ~~(emptyPos / cols)
    return items.map(item => {
        const delta = (item.position - emptyPos)
        const isSameCol = Math.abs(delta) % cols === 0
        const isSameRow = ~~(item.position / cols) === emptyRow
        const isPlayable = item.type > 0 && (isSameCol || isSameRow)
        return { ...item, isPlayable }
    })
}

export function getPositions(items: Array<Object>): Array<number> {
    return pluck(items, 'position')
}
export function swapPositions(
    items: Array<Object>,
    posA: number,
    posB: number,
    cols: number = COLS): Array<Object> {
    const colA = posA % cols
    const rowA = ~~(posA / cols)
    const colB = posB % cols
    const rowB = ~~(posB / cols)
    let positions = getPositions(items)

    // Swap positions
    positions = positions.map(pos => {
        if (rowA === rowB) {
            if (posA <= pos && pos < posB) {
                return pos + 1
            }
            if (posB < pos && pos <= posA) {
                return pos - 1
            }
        } else if (colA === colB) {
            if (posA <= pos && pos < posB && pos % cols === colA) {
                return pos + cols
            }
            if (posB < pos && pos <= posA && pos % cols === colA) {
                return pos - cols
            }
        }
        if (pos === posB) {
            return posA
        }
        return pos
    })

    return items.map((tile, idx) => {
        return {
            ...tile,
            position: positions[idx]
        }
    })
}

export default function tiles(state = initialState, action) {
    switch (action.type) {
        case NEW_GAME:
            const emptyBoard = range(0, startRow * COLS, 1).map(position => {
                return { type: 0, position }
            })

            let filledBoard = []
            for (let row = startRow; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    const position = row * COLS + col
                    const isEmpty = position === (SIZE - 1)
                    filledBoard.push({
                        type: isEmpty ? -1 : row - startRow + 1,
                        position
                    })
                }
            }
            filledBoard = filledBoard.map((item, idx) => {
                return {
                    ...item,
                    position: action.positions[idx]
                }
            })

            return updatePlayableTiles([...emptyBoard, ...filledBoard])

        case PLAY_TILE:
            const { position } = action
            const emptyTilePosition = getEmptyTilePos(state)
            const tileToPlay = findWhere(state, { position })
            if (tileToPlay.isPlayable) {
                return updatePlayableTiles(
                    swapPositions(state, position, emptyTilePosition)
                )
            }
            return state

        default:
            return state
    }
}
