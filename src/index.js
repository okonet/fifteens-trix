import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Game from './containers/Game'
import configureStore from './store/configureStore'

const store = configureStore()

ReactDOM.render(
    <Provider store={store}>
        <Game />
    </Provider>,
    document.getElementById('root')
)
