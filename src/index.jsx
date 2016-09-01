import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Game from './containers/Game/index'
import configureStore from './store'

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('root')
)
