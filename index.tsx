
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root')!;

// Define a type for our custom property on the window object
interface CustomWindow extends Window {
  _reactRoot?: ReactDOM.Root;
}

const customWindow = window as CustomWindow;

// Use a property on the window object to store the root, as it persists across HMR updates.
if (!customWindow._reactRoot) {
  customWindow._reactRoot = ReactDOM.createRoot(rootElement);
}

customWindow._reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
