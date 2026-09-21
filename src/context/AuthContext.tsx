import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authStorage } from '../services/storage';
import { useNavigation } from './NavigationContext';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: {
    name: string;
    email: string;
    companyName: string;
    phone: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentRoute, navigate, isDashboardRoute } = useNavigation();

  const refreshUser = useCallback(() => {
    const user = authStorage.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Route protection
  useEffect(() => {
    if (isLoading) return;

    if (isDashboardRoute && !currentUser) {
      navigate('/login');
    }
  }, [isDashboardRoute, currentUser, isLoading, navigate]);

  const register = async (data: {
    name: string;
    email: string;
    companyName: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for realistic UX loading spinner
    await new Promise((resolve) => setTimeout(resolve, 400));
    const result = authStorage.register(data);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      navigate('/dashboard');
      return { success: true };
    }
    return { success: false, error: result.error || 'Erreur lors de la création du compte.' };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const result = authStorage.login(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      navigate('/dashboard');
      return { success: true };
    }
    return { success: false, error: result.error || 'Identifiants invalides.' };
  };

  const logout = () => {
    authStorage.logout();
    setCurrentUser(null);
    navigate('/');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = authStorage.updateUserProfile(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        register,
        login,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
