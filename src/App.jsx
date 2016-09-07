import React from 'react'
import { Provider } from 'react-redux'
import Game from './containers/Game/index'
import configureStore from './store'

const store = configureStore()

const App = () => (
  <Provider store={store}>
    <Game />
  </Provider>
)

export default App
