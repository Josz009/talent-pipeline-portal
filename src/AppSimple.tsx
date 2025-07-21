import React from 'react';

console.log('AppSimple.tsx: Loading...');

function AppSimple() {
  console.log('AppSimple: Rendering component');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#3b82f6' }}>Talent Pipeline Portal</h1>
      <p style={{ color: 'green', fontWeight: 'bold' }}>✅ React App is Running!</p>
      <p>If you can see this, the basic React setup is working.</p>
      <hr style={{ margin: '20px 0' }} />
      <h2>Debug Information:</h2>
      <ul>
        <li>React Version: {React.version}</li>
        <li>Environment: {import.meta.env.MODE}</li>
        <li>Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <hr style={{ margin: '20px 0' }} />
      <a href="/login" style={{ color: '#3b82f6' }}>Go to Login</a>
    </div>
  );
}

export default AppSimple;