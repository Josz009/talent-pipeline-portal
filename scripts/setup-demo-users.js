import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const demoUsers = [
  {
    email: 'admin@example.com',
    password: 'Admin123!',
    displayName: 'Admin User',
    role: 'admin',
    department: 'Management'
  },
  {
    email: 'manager@example.com',
    password: 'Manager123!',
    displayName: 'Manager User',
    role: 'manager',
    department: 'Human Resources'
  },
  {
    email: 'employee@example.com',
    password: 'Employee123!',
    displayName: 'Employee User',
    role: 'employee',
    department: 'Engineering'
  }
];

async function setupDemoUsers() {
  console.log('Setting up demo users...\n');
  
  for (const user of demoUsers) {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await updateProfile(userCredential.user, { displayName: user.displayName });
      
      // Create Firestore user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        department: user.department,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Created ${user.email}`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  ${user.email} already exists`);
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message);
      }
    }
  }
  
  console.log('\n✅ Demo users setup complete!');
  console.log('\nLogin credentials:');
  console.log('- Admin: admin@example.com / Admin123!');
  console.log('- Manager: manager@example.com / Manager123!');
  console.log('- Employee: employee@example.com / Employee123!');
  
  process.exit(0);
}

setupDemoUsers();