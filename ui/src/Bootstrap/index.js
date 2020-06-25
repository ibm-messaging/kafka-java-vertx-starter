import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './App/App.view.js';
import { ConfigContextProvider, SelectedMessageProvider } from 'Contexts';

let config = JSON.parse(
  document.querySelector('meta[name="config"]').getAttribute('content')
);

const returnWebsocketForEndpoint = (path) => () =>
  new WebSocket(`ws://localhost:8080${path}`);

ReactDOM.render(
  <React.StrictMode>
    <ConfigContextProvider value={config}>
      <SelectedMessageProvider>
        <App producer consumer websocketFactory={returnWebsocketForEndpoint} />
      </SelectedMessageProvider>
    </ConfigContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
