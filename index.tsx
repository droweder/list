
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Corrected import path for App component.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { UIProvider } from './contexts/UIContext';

root.render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);