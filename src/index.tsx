import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStateProvider } from './states';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <GlobalStateProvider>
          <App />
        </GlobalStateProvider>
      </BrowserRouter>
  </React.StrictMode>
);
