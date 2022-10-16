import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStateProvider } from './states';
import { SocketProvider } from './socket';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
      <BrowserRouter>
        <GlobalStateProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </GlobalStateProvider>
      </BrowserRouter>
);
