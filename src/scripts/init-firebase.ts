import { initializeFirebaseData, checkDemoData } from '../services/firebase-init';

const runInit = async () => {
  console.log('Checking if demo data exists...');
  const exists = await checkDemoData();
  
  if (!exists) {
    console.log('Demo data not found. Initializing...');
    await initializeFirebaseData();
  } else {
    console.log('Demo data already exists.');
  }
  
  process.exit(0);
};

runInit().catch(console.error);