// Mock API service - in a real app, this would make HTTP requests
export const apiService = {
  // Mock login - replace with actual API call
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response
    if (email === 'admin@apartment.com' && password === 'password') {
      return {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Admin',
          email: 'admin@apartment.com',
          role: 'admin'
        }
      };
    }

    // For demo purposes, any email/password works
    return {
      token: 'mock-jwt-token',
      user: {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: 'resident'
      }
    };
  },

  // Mock register
  register: async (name: string, email: string, _password: string, role: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      token: 'mock-jwt-token',
      user: {
        id: Date.now().toString(),
        name,
        email,
        role
      }
    };
  },

  // Mock complaint operations
  getComplaints: async () => {
    // In real app, fetch from API
    return JSON.parse(localStorage.getItem('complaints') || '[]');
  },

  createComplaint: async (complaint: any) => {
    // In real app, POST to API
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const newComplaint = { ...complaint, id: Date.now().toString() };
    complaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    return newComplaint;
  },

  updateComplaint: async (id: string, updates: any) => {
    // In real app, PUT to API
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    const index = complaints.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      complaints[index] = { ...complaints[index], ...updates };
      localStorage.setItem('complaints', JSON.stringify(complaints));
      return complaints[index];
    }
    throw new Error('Complaint not found');
  }
};