import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | '/'
  | '/login'
  | '/register'
  | '/dashboard'
  | '/quotes'
  | '/invoices'
  | '/clients'
  | '/products'
  | '/stock'
  | '/payments'
  | '/reminders'
  | '/reports'
  | '/team'
  | '/subscription'
  | '/settings';

interface NavigationContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute | string) => void;
  isDashboardRoute: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/quotes',
  '/invoices',
  '/clients',
  '/products',
  '/stock',
  '/payments',
  '/reminders',
  '/reports',
  '/team',
  '/subscription',
  '/settings',
];

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname;
    if (PROTECTED_PREFIXES.includes(path) || path === '/login' || path === '/register') {
      return path as AppRoute;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (PROTECTED_PREFIXES.includes(path) || path === '/login' || path === '/register') {
        setCurrentRoute(path as AppRoute);
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: AppRoute | string) => {
    // If it's an anchor on landing page (e.g. #tarifs or #fonctionnalites)
    if (route.startsWith('#')) {
      if (currentRoute !== '/') {
        window.history.pushState({}, '', '/' + route);
        setCurrentRoute('/');
        setTimeout(() => {
          const el = document.querySelector(route);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(route);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const cleanRoute = (route as AppRoute) || '/';
    if (window.location.pathname !== cleanRoute) {
      window.history.pushState({}, '', cleanRoute);
    }
    setCurrentRoute(cleanRoute);
    window.scrollTo(0, 0);
  };

  const isDashboardRoute = PROTECTED_PREFIXES.some((prefix) => currentRoute.startsWith(prefix));

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate, isDashboardRoute }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    return {
      currentRoute: '/',
      navigate: (route: string) => {
        if (typeof window !== 'undefined') {
          if (route.startsWith('#')) {
            const el = document.querySelector(route);
            el?.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.pathname = route;
          }
        }
      },
      isDashboardRoute: false,
    };
  }
  return context;
}
