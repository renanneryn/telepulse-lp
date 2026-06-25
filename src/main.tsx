import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const ADMIN_SYNC_BUILD = '2026-06-25-admin-auth-proxy';
void ADMIN_SYNC_BUILD;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
