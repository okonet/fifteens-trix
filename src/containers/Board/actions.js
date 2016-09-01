export const PLAY_TILE = 'PLAY_TILE'

export function playTile(position: number) {
  return {
    type: PLAY_TILE,
    position
  }
}
