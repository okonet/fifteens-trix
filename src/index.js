import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import Game from './containers/Game';
import configureStore from './store/configureStore';

const store = configureStore();

ReactDOM.render(
    <div>
        <Provider store={store}>
            <Game />
        </Provider>
        <DebugPanel top right bottom>
            <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
    </div>,
    document.getElementById('root')
);
