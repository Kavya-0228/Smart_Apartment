import React, { createContext, useContext, useState } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: Role) => boolean;
  register: (name: string, email: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('user', JSON.stringify(u));
    else localStorage.removeItem('user');
  };

  const login = (email: string, password: string, role: Role): boolean => {
    if (!email || !password) return false;
    const isAdmin = email === 'admin@apartment.com' && password === 'password';
    const userData: User = {
      id: isAdmin ? '1' : Date.now().toString(),
      name: isAdmin ? 'Admin' : email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : role,
    };
    persist(userData);
    return true;
  };

  const register = (name: string, email: string, password: string, role: Role): boolean => {
    if (!name || !email || !password) return false;
    persist({ id: Date.now().toString(), name, email, role });
    return true;
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
