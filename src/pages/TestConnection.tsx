import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export const TestConnection: React.FC = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const testResults: any = {
        timestamp: new Date().toISOString(),
        environment: {},
        firebase: {},
        auth: {},
        firestore: {},
      };

      // Test 1: Environment Variables
      testResults.environment = {
        apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        status: 'loaded',
      };

      // Test 2: Firebase Initialization
      testResults.firebase = {
        authInitialized: !!auth,
        firestoreInitialized: !!db,
        status: auth && db ? 'success' : 'failed',
      };

      // Test 3: Auth Connection
      try {
        await signInWithEmailAndPassword(auth, 'test@test.com', 'test123').catch(err => {
          testResults.auth = {
            status: 'connected',
            error: err.code,
            message: 'Auth is working (login failed as expected)',
          };
        });
      } catch (error: any) {
        testResults.auth = {
          status: 'error',
          error: error.message,
        };
      }

      // Test 4: Firestore Connection
      try {
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        testResults.firestore = {
          status: 'connected',
          message: 'Firestore is accessible',
        };
      } catch (error: any) {
        testResults.firestore = {
          status: 'error',
          error: error.message,
          code: error.code,
        };
      }

      setResults(testResults);
      setLoading(false);
    };

    runTests();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>🔧 Frontend-Backend Connection Test</h1>
      
      {loading ? (
        <p>Running tests...</p>
      ) : (
        <div>
          <h2>Test Results:</h2>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: 20, 
            borderRadius: 5,
            overflow: 'auto'
          }}>
            {JSON.stringify(results, null, 2)}
          </pre>
          
          <h3>Summary:</h3>
          <ul>
            <li>✅ Frontend is running</li>
            <li>{results.environment?.apiKey ? '✅' : '❌'} Environment variables loaded</li>
            <li>{results.firebase?.status === 'success' ? '✅' : '❌'} Firebase initialized</li>
            <li>{results.auth?.status === 'connected' ? '✅' : '❌'} Auth service connected</li>
            <li>{results.firestore?.status === 'connected' ? '✅' : '❌'} Firestore connected</li>
          </ul>
        </div>
      )}
    </div>
  );
};