/* eslint import/prefer-default-export: 0 */

export function playTile(position: number) {
  return {
    type: 'PLAY_TILE',
    position
  }
}
