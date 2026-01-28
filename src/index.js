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

// Start MSW in development and wait for it to be ready
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass',
  }).then(() => {
    renderApp();
  });
} else {
  renderApp();
}
