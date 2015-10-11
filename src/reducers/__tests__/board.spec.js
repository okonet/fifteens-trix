import expect from 'expect'
import reducer, {getEmptyTilePos, updatePlayableTiles} from '../board'
import * as types from '../../actions/board'

describe('board reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual([])
    })

    it('should handle PLAY_TILE for non playable tile', () => {
        expect(
            reducer([
                {type: -1, position: 0, isPlayable: false},
                {type: 1, position: 1, isPlayable: true}
            ], {
                type: types.PLAY_TILE,
                position: 0
            })
        ).toEqual([
            {type: -1, position: 0, isPlayable: false},
            {type: 1, position: 1, isPlayable: true}
        ])
    })

    it('should handle PLAY_TILE for playable tile', () => {
        expect(
            reducer([
                { type: -1, position: 0, isPlayable: false },
                { type: 1, position: 1, isPlayable: true },
                { type: 1, position: 2, isPlayable: true },
                { type: 1, position: 3, isPlayable: false }
            ], {
                type: types.PLAY_TILE,
                position: 1
            })
        ).toEqual([
            { type: -1, position: 1, isPlayable: false },
            { type: 1, position: 0, isPlayable: true },
            { type: 1, position: 2, isPlayable: true },
            { type: 1, position: 3, isPlayable: false }
        ])
    })

    it('getEmptyTilePos', () => {
        expect(getEmptyTilePos([
            {
                type: -1,
                position: 0
            }
        ])).toBe(0)

        expect(getEmptyTilePos([
            {
                type: -1,
                position: 10
            }
        ])).toBe(10)
    })


    it('updatePlayableTiles', () => {
        // 2x2
        expect(updatePlayableTiles([
            { type: -1, position: 0 },
            { type: 1, position: 1 },
            { type: 1, position: 2 },
            { type: 1, position: 3 }
        ], 2)).toEqual([
            { type: -1, position: 0, isPlayable: false },
            { type: 1, position: 1, isPlayable: true },
            { type: 1, position: 2, isPlayable: true },
            { type: 1, position: 3, isPlayable: false }
        ])

        // 3x3
        expect(updatePlayableTiles([
            { type: 1, position: 0 },
            { type: 1, position: 1 },
            { type: 1, position: 2 },
            { type: 1, position: 3 },
            { type: -1, position: 4 },
            { type: 0, position: 5 },
            { type: 1, position: 6 },
            { type: 1, position: 7 },
            { type: 1, position: 8 }
        ], 3)).toEqual([
            { type: 1, position: 0, isPlayable: false },
            { type: 1, position: 1, isPlayable: true },
            { type: 1, position: 2, isPlayable: false },
            { type: 1, position: 3, isPlayable: true },
            { type: -1, position: 4, isPlayable: false },
            { type: 0, position: 5, isPlayable: false },
            { type: 1, position: 6, isPlayable: false },
            { type: 1, position: 7, isPlayable: true },
            { type: 1, position: 8, isPlayable: false }
        ])
    })
})
