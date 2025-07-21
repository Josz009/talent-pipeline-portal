import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { OnboardingTask, TimelineEvent } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useOnboarding = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const createOnboarding = useMutation({
    mutationFn: async (data: Partial<OnboardingTask>) => {
      const onboardingData = {
        ...data,
        status: 'pending',
        currentStep: 1,
        totalSteps: 5,
        documents: [],
        approvals: [],
        timeline: [
          {
            id: crypto.randomUUID(),
            type: 'created',
            description: 'Onboarding process initiated',
            userId: currentUser!.id,
            userName: currentUser!.displayName,
            timestamp: new Date(),
          },
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'onboardings'), onboardingData);
      return { id: docRef.id, ...onboardingData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardings'] });
    },
  });

  const updateOnboarding = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OnboardingTask> }) => {
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, 'onboardings', id), updateData);
      return { id, ...updateData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardings'] });
    },
  });

  const addTimelineEvent = async (onboardingId: string, event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const docRef = doc(db, 'onboardings', onboardingId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const timeline = docSnap.data().timeline || [];
      const newEvent: TimelineEvent = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      };
      
      await updateDoc(docRef, {
        timeline: [...timeline, newEvent],
        updatedAt: Timestamp.now(),
      });
    }
  };

  return {
    createOnboarding,
    updateOnboarding,
    addTimelineEvent,
  };
};

export const useOnboardingList = (filters?: { status?: string; departmentId?: string }) => {
  return useQuery({
    queryKey: ['onboardings', filters],
    queryFn: async () => {
      let q = query(collection(db, 'onboardings'), orderBy('createdAt', 'desc'));

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.departmentId) {
        q = query(q, where('department', '==', filters.departmentId));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as OnboardingTask[];
    },
  });
};

export const useOnboardingById = (id: string) => {
  return useQuery({
    queryKey: ['onboardings', id],
    queryFn: async () => {
      const docSnap = await getDoc(doc(db, 'onboardings', id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as OnboardingTask;
      }
      throw new Error('Onboarding not found');
    },
    enabled: !!id,
  });
};