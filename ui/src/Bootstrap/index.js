import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from 'Bootstrap/App/App.js';
import { ConfigContextProvider } from '../Contexts/index.js';

let config = JSON.parse(
  document.querySelector('meta[name="config"]').getAttribute('content')
);

ReactDOM.render(
  <React.StrictMode>
    <ConfigContextProvider value={config}>
      <App />
    </ConfigContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
