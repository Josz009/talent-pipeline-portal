import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('main-test.tsx loading...');

try {
  const root = document.getElementById('root');
  console.log('Root element:', root);
  
  if (!root) {
    throw new Error('Root element not found');
  }
  
  const TestApp = () => {
    console.log('TestApp rendering');
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Test App is Working!</h1>
        <p>If you see this, React is loading correctly.</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
      </div>
    );
  };
  
  console.log('Creating React root...');
  const reactRoot = createRoot(root);
  
  console.log('Rendering app...');
  reactRoot.render(<TestApp />);
  
  console.log('App rendered successfully!');
} catch (error) {
  console.error('Error in main-test.tsx:', error);
  document.body.innerHTML = `<h1>Error: ${error.message}</h1>`;
}