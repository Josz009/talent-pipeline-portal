import { auth, db, storage } from './firebase';

export const debugFirebaseConnection = () => {
  console.log('🔥 Firebase Debug Information:');
  console.log('================================');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Loaded' : '❌ Missing');
  console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Loaded' : '❌ Missing');
  console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Loaded' : '❌ Missing');
  console.log('Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Loaded' : '❌ Missing');
  
  // Check Firebase instances
  console.log('\nFirebase Services:');
  console.log('Auth:', auth ? '✅ Initialized' : '❌ Failed');
  console.log('Firestore:', db ? '✅ Initialized' : '❌ Failed');
  console.log('Storage:', storage ? '✅ Initialized' : '❌ Failed');
  
  // Check auth state
  auth.onAuthStateChanged((user) => {
    console.log('\nAuth State:');
    if (user) {
      console.log('✅ User logged in:', user.email);
    } else {
      console.log('❌ No user logged in');
    }
  });
  
  // Test Firestore connection
  console.log('\nTesting Firestore connection...');
  import('firebase/firestore').then(({ collection, getDocs }) => {
    getDocs(collection(db, 'test'))
      .then(() => {
        console.log('✅ Firestore connected successfully');
      })
      .catch((error: any) => {
        console.error('❌ Firestore connection error:', error.message);
      });
  });
};