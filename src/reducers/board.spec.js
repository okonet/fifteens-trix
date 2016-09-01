import expect from 'expect'
import reducer, { getEmptyTilePos, updatePlayableTiles, swapPositions, getPositions } from './board'

describe('board reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual([])
    })

    describe('getPositions', () => {
        it('should return an Array of numbers with positions', () => {
            const tiles = [
                { type: -1, position: 0 },
                { type: 1, position: 1 }
            ]
            expect(getPositions(tiles).length).toEqual(2)
            expect(getPositions(tiles)).toEqual([0, 1])
        })
    })

    describe('swapPositions', () => {
        it('should swap positions for nearby tiles', () => {
            const res = swapPositions([
                { type: -1, position: 0 },
                { type: 1, position: 1 }
            ], 0, 1, 2)
            expect(getPositions(res)).toEqual([1, 0])
        })

        it('should swap positions when moving a row of tiles horizontally to the left', () => {
            const res = swapPositions([
                { type: -1, position: 0 },
                { type: 1, position: 1 },
                { type: 2, position: 2 },
                { type: 3, position: 3 },
                { type: 4, position: 4 },
                { type: 5, position: 5 }
            ], 2, 0, 3)

            expect(getPositions(res)).toEqual([2, 0, 1, 3, 4, 5])
        })

        it('should swap positions when moving a row of tiles horizontally to the right', () => {
            const res = swapPositions([
                { type: -1, position: 2 },
                { type: 1, position: 0 },
                { type: 2, position: 1 },
                { type: 3, position: 3 },
                { type: 4, position: 4 },
                { type: 5, position: 5 }
            ], 0, 2, 3)

            expect(getPositions(res)).toEqual([0, 1, 2, 3, 4, 5])
        })

        it('should swap positions when moving a column of tiles vertically down', () => {
            const res = swapPositions([
                { type: -1, position: 6 },
                { type: 1, position: 1 },
                { type: 2, position: 2 },
                { type: 3, position: 0 },
                { type: 4, position: 4 },
                { type: 5, position: 5 },
                { type: 6, position: 3 },
                { type: 7, position: 7 },
                { type: 8, position: 8 }
            ], 0, 6, 3)

            expect(getPositions(res)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
        })

        it('should swap positions when moving a column of tiles vertically up', () => {
            const res = swapPositions([
                { type: -1, position: 0 },
                { type: 1, position: 1 },
                { type: 2, position: 2 },
                { type: 3, position: 3 },
                { type: 4, position: 4 },
                { type: 5, position: 5 },
                { type: 6, position: 6 },
                { type: 7, position: 7 },
                { type: 8, position: 8 }
            ], 6, 0, 3)

            expect(getPositions(res)).toEqual([6, 1, 2, 0, 4, 5, 3, 7, 8])
        })
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
