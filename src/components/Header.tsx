import { useState, useEffect } from 'react';
import type { NavItem } from '../types';
import { useNavigation } from '../context/NavigationContext';

const NAV_ITEMS: NavItem[] = [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Pour qui ?', href: '#pour-qui' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useNavigation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          className="flex items-center gap-2 text-lg font-bold tracking-tight cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="/icon.svg" alt="Chapfacture" className="h-8 w-8" />
          <span>
            <span className="text-[#295294]">Chap</span>
            <span className="text-[#f27a2c]">facture</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 cursor-pointer"
              onClick={() => navigate(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Connexion
          </button>
          <button
            className="inline-flex items-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 px-4 py-2 text-sm font-bold text-white shadow-md shadow-teal-500/20 transition-transform hover:-translate-y-0.5 cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Créer mon compte
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-slate-900/20"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-16 z-50 border-b border-slate-200 bg-white p-4 shadow-lg animate-fadeIn">
            <nav className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    closeMenu();
                    navigate(item.href);
                  }}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 text-left cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  closeMenu();
                  navigate('/login');
                }}
                className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
              >
                Connexion
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  navigate('/register');
                }}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-500/20 cursor-pointer"
              >
                Créer mon compte
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
