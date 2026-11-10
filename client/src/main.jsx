import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f0e8',
            borderRadius: '14px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#2c7a4a', secondary: '#f5f0e8' } },
          error: { iconTheme: { primary: '#b33a3a', secondary: '#f5f0e8' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);