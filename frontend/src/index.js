import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import WalletProvider from './context/WalletContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Router>
      <Suspense fallback="loading">
        <WalletProvider><App /></WalletProvider>
      </Suspense>
      </Router>
  </React.StrictMode>
);
