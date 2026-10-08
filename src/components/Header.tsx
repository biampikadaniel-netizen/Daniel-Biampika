import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, ArrowRight } from 'lucide-react';
import { NavItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { FaktelioLogo } from './common/FaktelioLogo';

const navItems: NavItem[] = [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loginDemo } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_4px_20px_-4px_rgba(16,24,40,0.06)] py-3'
          : 'bg-white/90 backdrop-blur-sm border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: FAKTELIO Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="FAKTELIO Accueil"
        >
          <FaktelioLogo size="md" className="transition-transform duration-200 group-hover:scale-[1.02]" />
        </a>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#526581] hover:text-[#1E4F91] transition-colors duration-200 py-1"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#1E4F91] hover:bg-[#163C70] rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              Mon Espace ({user.name.split(' ')[0]})
            </button>
          ) : (
            <>
              <button
                onClick={handleDemoAccess}
                className="px-3.5 py-2 text-xs font-bold text-[#1E4F91] bg-[#1E4F91]/8 hover:bg-[#1E4F91]/15 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Démo directe
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2.5 text-sm font-semibold text-[#101828] hover:text-[#1E4F91] transition-colors duration-200 cursor-pointer"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-[#F47B20] hover:bg-[#FF7A21] rounded-xl shadow-[0_6px_16px_rgba(244,123,32,0.28)] hover:shadow-[0_10px_22px_rgba(244,123,32,0.38)] hover:-translate-y-0.5 transition-all duration-250 cursor-pointer"
              >
                Créer mon compte
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Right CTA + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="inline-flex md:hidden items-center justify-center px-3.5 py-2 text-xs font-bold text-white bg-[#F47B20] hover:bg-[#FF7A21] rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
            >
              Créer mon compte
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2.5 rounded-xl text-[#101828] hover:text-[#1E4F91] hover:bg-[#F5F7FA] transition-colors focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E8F0] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fade-in-up">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-[#101828] hover:text-[#1E4F91] hover:bg-[#F5F7FA] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2.5">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-3 text-center text-sm font-bold text-white bg-[#1E4F91] rounded-xl shadow-md"
              >
                Accéder à mon Dashboard FAKTELIO
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDemoAccess();
                  }}
                  className="w-full py-2.5 text-center text-sm font-bold text-[#1E4F91] bg-[#1E4F91]/10 rounded-xl"
                >
                  Explorer la Démo Interactive
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-[#101828] border border-[#E2E8F0] rounded-xl hover:bg-[#F5F7FA]"
                >
                  Connexion
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full py-3 text-center text-sm font-bold text-white bg-[#F47B20] hover:bg-[#FF7A21] rounded-xl shadow-md transition-all duration-200"
                >
                  Créer mon compte gratuitement →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
