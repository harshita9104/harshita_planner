import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Super Stretch: Register Service Worker for offline support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                if (window.confirm('A new version of Weekendly is available. Refresh to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error(' Service Worker registration failed:', error);
      });
  });
}

// Super Stretch: Performance monitoring
if (window.performance && window.performance.mark) {
  window.performance.mark('app-start');
  
  // Track when the app becomes interactive
  window.addEventListener('load', () => {
    window.performance.mark('app-interactive');
    window.performance.measure('app-load-time', 'app-start', 'app-interactive');
    
    const measure = window.performance.getEntriesByName('app-load-time')[0];
    if (measure) {
      console.log(`App load time: ${Math.round(measure.duration)}ms`);
    }
  });
}
