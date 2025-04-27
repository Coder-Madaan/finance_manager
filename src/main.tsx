import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { FinanceProvider } from '@/context/FinanceContext';
import { Toaster } from '@/components/ui/toaster';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FinanceProvider>
      <App />
      <Toaster />
    </FinanceProvider>
  </StrictMode>
);
