import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

console.log('Testing Firebase connection...');
console.log('Project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testConnection() {
  try {
    // Test authentication
    console.log('\nTesting Authentication...');
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@talentpipeline.com', 'admin123');
    console.log('✓ Authentication successful:', userCredential.user.email);
    
    // Test Firestore
    console.log('\nTesting Firestore...');
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    console.log(`✓ Firestore connected: Found ${snapshot.size} users`);
    
    // Test collections
    const collections = ['users', 'onboardings', 'documents'];
    for (const collName of collections) {
      const collRef = collection(db, collName);
      const snap = await getDocs(collRef);
      console.log(`  - ${collName}: ${snap.size} documents`);
    }
    
    console.log('\n✅ All backend connections working properly!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Backend connection error:', error.message);
    process.exit(1);
  }
}

testConnection();