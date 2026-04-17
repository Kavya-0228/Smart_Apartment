export type Role = 'resident' | 'admin';
export type ComplaintStatus = 'open' | 'in-progress' | 'resolved';
export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  assignedTo?: string;
  imageUrl?: string;
  comments: Comment[];
}

export const CATEGORIES = [
  'Plumbing', 'Electrical', 'Security', 'Lift', 'Cleaning',
  'Parking', 'Internet', 'Noise', 'Structural', 'Other',
] as const;

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'resolved': 'Resolved',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'text-red-600 dark:text-red-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-green-600 dark:text-green-400',
};

export const STATUS_BADGE_VARIANT: Record<ComplaintStatus, 'error' | 'warning' | 'success'> = {
  'open': 'error',
  'in-progress': 'warning',
  'resolved': 'success',
};
