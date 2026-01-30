import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

function renderApp() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// Start MSW in development when USE_MOCK is enabled
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK === 'true') {
  const { worker } = require('./mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass',
  }).then(() => {
    console.log('[MSW] Mock Service Worker started');
    renderApp();
  });
} else {
  renderApp();
}
