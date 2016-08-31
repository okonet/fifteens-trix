import expect from 'expect'
import reducer, { getEmptyTilePos, updatePlayableTiles, switchPositions } from './board'

describe('board reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual([])
    })

    describe('switchPositions', () => {
        it('should swap positions for nearby tiles', () => {
            expect(
                switchPositions([
                    { type: -1, position: 0, isPlayable: false },
                    { type: 1, position: 1, isPlayable: true }
                ], 0, 1, 2)
            ).toEqual([
                { type: -1, position: 1, isPlayable: false },
                { type: 1, position: 0, isPlayable: true }
            ])
        })

        it('should swap positions for a set of tiles horizontally', () => {
            expect(
                switchPositions([
                    { type: -1, position: 0, isPlayable: false },
                    { type: 1, position: 1, isPlayable: true },
                    { type: 2, position: 2, isPlayable: true },
                    { type: 3, position: 3, isPlayable: true },
                    { type: 4, position: 4, isPlayable: false },
                    { type: 5, position: 5, isPlayable: false }
                ], 2, 0, 3)
            ).toEqual([
                { type: -1, position: 2, isPlayable: false },
                { type: 1, position: 0, isPlayable: true },
                { type: 2, position: 1, isPlayable: true },
                { type: 3, position: 3, isPlayable: false },
                { type: 4, position: 4, isPlayable: false },
                { type: 5, position: 5, isPlayable: true }
            ])

            expect(
                switchPositions([
                    { type: -1, position: 2, isPlayable: false },
                    { type: 1, position: 0, isPlayable: true },
                    { type: 2, position: 1, isPlayable: true },
                    { type: 3, position: 3, isPlayable: false },
                    { type: 4, position: 4, isPlayable: false },
                    { type: 5, position: 5, isPlayable: true }
                ], 0, 0, 3)
            ).toEqual([
                { type: -1, position: 0, isPlayable: false },
                { type: 1, position: 1, isPlayable: true },
                { type: 2, position: 2, isPlayable: true },
                { type: 3, position: 3, isPlayable: true },
                { type: 4, position: 4, isPlayable: false },
                { type: 5, position: 5, isPlayable: false }
            ])
        })

        it('should positions for a set of tiles vertically', () => {
            expect(
                switchPositions([
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
            ).toEqual([
                { type: 3, position: 0, isPlayable: true },
                { type: 1, position: 1, isPlayable: false },
                { type: 2, position: 2, isPlayable: false },
                { type: 6, position: 3, isPlayable: true },
                { type: 4, position: 4, isPlayable: false },
                { type: 5, position: 5, isPlayable: false },
                { type: -1, position: 6, isPlayable: false },
                { type: 7, position: 7, isPlayable: true },
                { type: 8, position: 8, isPlayable: true }
            ])
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
