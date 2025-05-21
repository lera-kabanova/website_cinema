import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
const isColdStart = navEntry?.type === 'navigate';

if (isColdStart) {
  // Only clear specific cache keys, not authentication-related items
  const CACHE_KEYS = ['cinema_halls', 'cinema_schedule'];
  CACHE_KEYS.forEach(k => {
    if (!k.includes('token') && !k.includes('email') && !k.includes('role')) {
      localStorage.removeItem(k);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
