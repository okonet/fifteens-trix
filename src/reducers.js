import { combineReducers } from 'redux'
import game from './containers/Game/reducer'
import board from './containers/Board/reducer'

export default combineReducers({
  game,
  board
})
