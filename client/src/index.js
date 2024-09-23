import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18 uses createRoot
import './index.css';  // Custom CSS
import App from './App';  // Main App component

const root = ReactDOM.createRoot(document.getElementById('root'));  // Get root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
