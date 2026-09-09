import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { InstitutionProvider } from './context/InstitutionContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <InstitutionProvider>
          <App />
        </InstitutionProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
