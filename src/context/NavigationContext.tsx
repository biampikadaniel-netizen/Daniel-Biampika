import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | '/'
  | '/login'
  | '/register'
  | '/dashboard'
  | '/billing'
  | '/invoices'
  | '/quotes'
  | '/clients'
  | '/products'
  | '/stock'
  | '/payments'
  | '/reminders'
  | '/reports'
  | '/team'
  | '/subscription'
  | '/settings';

interface NavigationContextValue {
  route: AppRoute;
  navigate: (to: AppRoute, params?: Record<string, string>) => void;
  params: Record<string, string>;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<AppRoute>('/');
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('/')) {
      setRoute(hash as AppRoute);
    }
  }, []);

  const navigate = (to: AppRoute, nextParams: Record<string, string> = {}) => {
    setRoute(to);
    setParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ route, navigate, params }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within a NavigationProvider');
  return ctx;
}
