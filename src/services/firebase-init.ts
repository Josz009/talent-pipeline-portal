import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import type { User, UserRole } from '../types';

// Demo users data
const demoUsers = [
  {
    email: 'admin@talentpipeline.com',
    password: 'admin123',
    displayName: 'Admin User',
    role: 'admin' as UserRole,
  },
  {
    email: 'manager@talentpipeline.com',
    password: 'manager123',
    displayName: 'Manager User',
    role: 'manager' as UserRole,
  },
  {
    email: 'employee@talentpipeline.com',
    password: 'employee123',
    displayName: 'Employee User',
    role: 'employee' as UserRole,
  },
];

// Demo onboarding data
const demoOnboardings = [
  {
    employeeName: 'John Smith',
    employeeEmail: 'john.smith@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    startDate: new Date('2024-02-01'),
    status: 'completed',
    currentStep: 5,
    totalSteps: 5,
  },
  {
    employeeName: 'Sarah Johnson',
    employeeEmail: 'sarah.johnson@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    startDate: new Date('2024-02-15'),
    status: 'in_progress',
    currentStep: 3,
    totalSteps: 5,
  },
  {
    employeeName: 'Michael Chen',
    employeeEmail: 'michael.chen@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    startDate: new Date('2024-03-01'),
    status: 'pending',
    currentStep: 1,
    totalSteps: 5,
  },
];

export const initializeFirebaseData = async () => {
  try {
    // Create demo users
    for (const userData of demoUsers) {
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        
        await updateProfile(user, { displayName: userData.displayName });
        
        const userDoc: Omit<User, 'id'> = {
          email: userData.email,
          displayName: userData.displayName,
          role: userData.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await setDoc(doc(db, 'users', user.uid), userDoc);
        console.log(`Created user: ${userData.email}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`User ${userData.email} already exists`);
        } else {
          console.error(`Error creating user ${userData.email}:`, error);
        }
      }
    }

    // Create demo onboarding tasks
    for (const onboarding of demoOnboardings) {
      try {
        await addDoc(collection(db, 'onboardings'), {
          ...onboarding,
          documents: [],
          approvals: [],
          timeline: [
            {
              id: crypto.randomUUID(),
              type: 'created',
              description: 'Onboarding process initiated',
              userId: 'system',
              userName: 'System',
              timestamp: new Date(),
            },
          ],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        console.log(`Created onboarding for: ${onboarding.employeeName}`);
      } catch (error) {
        console.error(`Error creating onboarding:`, error);
      }
    }

    console.log('Firebase initialization complete!');
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
};

// Function to check if demo data exists
export const checkDemoData = async () => {
  try {
    await signInWithEmailAndPassword(auth, 'admin@talentpipeline.com', 'admin123');
    console.log('Demo data exists');
    await auth.signOut();
    return true;
  } catch (error) {
    console.log('Demo data needs to be created');
    return false;
  }
};