export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  startDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  currentStep: number;
  totalSteps: number;
  documents: Document[];
  approvals: Approval[];
  timeline: TimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
}

export interface Approval {
  id: string;
  approverId: string;
  approverName: string;
  approverRole: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  timestamp: Date;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'document_uploaded' | 'approved' | 'rejected' | 'completed';
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface DashboardMetrics {
  totalOnboarding: number;
  pendingApprovals: number;
  completedThisMonth: number;
  averageCompletionTime: number;
  timeSaved: number;
  costSavings: number;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
}