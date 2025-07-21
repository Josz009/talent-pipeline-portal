import React from 'react';
import { createRoot } from 'react-dom/client';
import AppSimple from './AppSimple';

console.log('main-simple.tsx: Starting...');

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('main-simple.tsx: Creating root...');
  const root = createRoot(rootElement);
  
  console.log('main-simple.tsx: Rendering AppSimple...');
  root.render(
    <React.StrictMode>
      <AppSimple />
    </React.StrictMode>
  );
  
  console.log('main-simple.tsx: Done!');
} else {
  console.error('main-simple.tsx: Root element not found!');
  document.body.innerHTML = '<h1>Error: Root element not found</h1>';
}