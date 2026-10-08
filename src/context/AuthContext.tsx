import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, PlanType } from '../types';
import { authService } from '../services/storage';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password?: string) => { user?: User; error?: string };
  loginDemo: () => User;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    phone: string;
    plan?: PlanType;
  }) => { user?: User; error?: string };
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      setUser(current);
    }
  }, []);

  const login = (email: string, password?: string) => {
    const res = authService.login(email, password);
    if (res.user) setUser(res.user);
    return res;
  };

  const loginDemo = () => {
    const demo = authService.loginDemo();
    setUser(demo);
    return demo;
  };

  const register = (data: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    phone: string;
    plan?: PlanType;
  }) => {
    const res = authService.register(data);
    if (res.user) setUser(res.user);
    return res;
  };

  const updateUser = (patch: Partial<User>) => {
    const updated = authService.updateUser(patch);
    if (updated) setUser(updated);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginDemo, register, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
