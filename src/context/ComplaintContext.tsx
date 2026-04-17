import React, { createContext, useContext, useState, useEffect } from 'react';
import { Complaint, Comment, ComplaintStatus, Priority } from '../types';

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  addComment: (complaintId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getComplaintsByUser: (userId: string) => Complaint[];
  getComplaintById: (id: string) => Complaint | undefined;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const sampleComplaints: Complaint[] = [
  {
    id: '1', title: 'Leaky faucet in kitchen',
    description: 'The kitchen faucet has been leaking for a week now. Water is wasting.',
    category: 'Plumbing', status: 'open', priority: 'medium',
    createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z',
    userId: '1', userName: 'John Doe',
    comments: [{ id: '1', text: 'I will look into this issue.', userId: 'admin', userName: 'Admin', createdAt: '2024-01-15T11:00:00Z' }],
  },
  {
    id: '2', title: 'Power outage in building A',
    description: 'Complete power outage in building A since last night.',
    category: 'Electrical', status: 'in-progress', priority: 'high',
    createdAt: '2024-01-14T20:00:00Z', updatedAt: '2024-01-15T08:00:00Z',
    userId: '2', userName: 'Jane Smith', assignedTo: 'Electrician', comments: [],
  },
  {
    id: '3', title: 'Broken elevator',
    description: 'Elevator in building B is not working. Stuck between floors.',
    category: 'Lift', status: 'resolved', priority: 'high',
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-12T14:00:00Z',
    userId: '3', userName: 'Bob Johnson', assignedTo: 'Maintenance',
    comments: [{ id: '2', text: 'Elevator has been repaired.', userId: 'admin', userName: 'Admin', createdAt: '2024-01-12T14:00:00Z' }],
  },
];

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('complaints');
    return saved ? JSON.parse(saved) : sampleComplaints;
  });

  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const now = new Date().toISOString();
    setComplaints(prev => [...prev, { ...data, id: Date.now().toString(), createdAt: now, updatedAt: now, comments: [] }]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ));
  };

  const addComment = (complaintId: string, data: Omit<Comment, 'id' | 'createdAt'>) => {
    const comment: Comment = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setComplaints(prev => prev.map(c =>
      c.id === complaintId ? { ...c, comments: [...c.comments, comment] } : c
    ));
  };

  const getComplaintsByUser = (userId: string) => complaints.filter(c => c.userId === userId);
  const getComplaintById = (id: string) => complaints.find(c => c.id === id);

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, updateComplaint, addComment, getComplaintsByUser, getComplaintById }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error('useComplaints must be used within ComplaintProvider');
  return ctx;
};

export type { Complaint, Comment, ComplaintStatus, Priority };
