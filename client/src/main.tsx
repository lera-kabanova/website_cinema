import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';



const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
const isColdStart = navEntry?.type === 'navigate'; // true, если вкладка открылась впервые

if (isColdStart) {
  const CACHE_KEYS = ['cinema_halls', 'cinema_schedule'];
  CACHE_KEYS.forEach(k => localStorage.removeItem(k));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
