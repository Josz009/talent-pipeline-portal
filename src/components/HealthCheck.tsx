import React, { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';

export const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState({
    app: false,
    firebase: false,
    auth: false,
    firestore: false,
    env: false,
  });

  useEffect(() => {
    // Check app is running
    setStatus(prev => ({ ...prev, app: true }));

    // Check environment variables
    const envLoaded = !!(
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    );
    setStatus(prev => ({ ...prev, env: envLoaded }));

    // Check Firebase initialization
    try {
      if (auth && db) {
        setStatus(prev => ({ ...prev, firebase: true }));
      }
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }

    // Check auth service
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setStatus(prev => ({ ...prev, auth: true }));
    });

    // Check Firestore
    import('firebase/firestore').then(({ collection, getDocs }) => {
      getDocs(collection(db, 'test'))
        .then(() => {
          setStatus(prev => ({ ...prev, firestore: true }));
        })
        .catch((error) => {
          console.error('Firestore error:', error);
        });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'white',
      padding: 20,
      borderRadius: 10,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'monospace',
      fontSize: 12,
      zIndex: 9999,
    }}>
      <h4 style={{ margin: '0 0 10px 0' }}>🔍 Health Check</h4>
      <div>React App: {status.app ? '✅' : '❌'}</div>
      <div>Environment: {status.env ? '✅' : '❌'}</div>
      <div>Firebase: {status.firebase ? '✅' : '❌'}</div>
      <div>Auth Service: {status.auth ? '✅' : '❌'}</div>
      <div>Firestore: {status.firestore ? '✅' : '❌'}</div>
    </div>
  );
};