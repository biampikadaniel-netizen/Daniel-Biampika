import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';
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
          ? 'bg-[#F7FAF8]/85 backdrop-blur-md border-b border-[rgba(217,231,227,0.6)] shadow-[0_4px_25px_rgba(13,43,33,0.06)] py-3'
          : 'bg-[#F7FAF8]/90 backdrop-blur-sm border-b border-transparent py-4'
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
              className="text-sm font-semibold text-[#4A635A] hover:text-[#215C46] transition-colors duration-200 py-1"
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
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] rounded-xl shadow-[0_6px_20px_rgba(33,92,70,0.25)] hover:shadow-[0_10px_28px_rgba(33,92,70,0.35)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-[#D9E7E3]" />
              Mon Espace ({user.name.split(' ')[0]})
            </button>
          ) : (
            <>
              <button
                onClick={handleDemoAccess}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#215C46] bg-[#A9BDBC]/15 hover:bg-[#A9BDBC]/30 border border-[#D9E7E3] rounded-lg transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#215C46]" />
                Démo directe
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2.5 text-sm font-semibold text-[#10241D] hover:text-[#215C46] transition-colors duration-200 cursor-pointer"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] rounded-xl shadow-[0_8px_24px_rgba(33,92,70,0.25)] hover:shadow-[0_12px_30px_rgba(33,92,70,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-250 cursor-pointer group"
              >
                Créer mon compte
                <ArrowRight className="w-4 h-4 text-[#D9E7E3] transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Right CTA + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {!user && (
            <button
              onClick={() => navigate('/register')}
              className="inline-flex md:hidden items-center justify-center px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#215C46] to-[#3F7A65] rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
            >
              Créer mon compte
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2.5 rounded-xl text-[#10241D] hover:text-[#215C46] hover:bg-[#A9BDBC]/15 transition-colors focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7FAF8] border-b border-[#D9E7E3] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fade-in-up">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-base font-semibold text-[#10241D] hover:text-[#215C46] hover:bg-[#A9BDBC]/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#D9E7E3] flex flex-col gap-2.5">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#215C46] to-[#3F7A65] flex items-center justify-center gap-2 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-[#D9E7E3]" />
                Accéder au Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDemoAccess();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#215C46] bg-[#A9BDBC]/15 border border-[#D9E7E3] flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Tester la démo instantanée
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-[#10241D] hover:text-[#215C46] hover:bg-[#A9BDBC]/10 text-center"
                >
                  Connexion
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#215C46] to-[#3F7A65] shadow-md flex items-center justify-center gap-2"
                >
                  Créer mon compte gratuitement
                  <ArrowRight className="w-4 h-4 text-[#D9E7E3]" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
