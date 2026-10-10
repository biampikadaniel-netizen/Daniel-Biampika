import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';
import { NavItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { FaktelioLogo } from './common/FaktelioLogo';
import { Button } from './common/Button';

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
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleDemoAccess = () => {
    setMobileMenuOpen(false);
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 sm:top-2.5 z-50 w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 transition-all duration-300 max-w-[1340px] mx-auto">
      {/* ==============================================================
          GLASSMORPHIC FLOATING NAVBAR (OCEANIC GREEN DESIGN SYSTEM)
         ============================================================== */}
      <div
        className={`w-full rounded-2xl sm:rounded-3xl transition-all duration-300 px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between ${
          scrolled
            ? 'shadow-[0_16px_45px_rgba(13,43,33,0.12)]'
            : 'shadow-[0_12px_40px_rgba(13,43,33,0.08)]'
        }`}
        style={{
          background: scrolled ? 'rgba(247, 250, 248, 0.88)' : 'rgba(247, 250, 248, 0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(169, 189, 188, 0.35)',
        }}
      >
        {/* Left: FAKTELIO Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          aria-label="FAKTELIO Accueil"
        >
          <FaktelioLogo size="md" className="transition-transform duration-200 group-hover:scale-[1.02]" />
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8" aria-label="Navigation principale">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#17231D]/80 hover:text-[#176B4D] transition-colors duration-200 py-1 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#176B4D] rounded-full transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3 shrink-0">
          {user ? (
            <Button
              variant="primary"
              size="md"
              shape="capsule"
              onClick={() => navigate('/dashboard')}
              icon={<LayoutDashboard className="w-4 h-4 text-[#E8F3ED]" />}
            >
              Mon Espace ({user.name.split(' ')[0]})
            </Button>
          ) : (
            <>
              {/* Démo directe */}
              <Button
                variant="glass"
                size="sm"
                shape="capsule"
                onClick={handleDemoAccess}
                icon={<Sparkles className="w-3.5 h-3.5 text-[#2E8B57]" />}
              >
                Démo directe
              </Button>

              {/* Connexion */}
              <Button
                variant="ghost"
                size="md"
                shape="capsule"
                onClick={() => navigate('/login')}
              >
                Connexion
              </Button>

              {/* Créer mon compte */}
              <Button
                variant="primary"
                size="md"
                shape="capsule"
                onClick={() => navigate('/register')}
                iconRight={<ArrowRight className="w-4 h-4 text-[#E8F3ED]" />}
              >
                Créer mon compte
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger & Quick Action */}
        <div className="flex items-center gap-2 lg:hidden">
          {!user && (
            <Button
              variant="primary"
              size="sm"
              shape="capsule"
              onClick={() => navigate('/register')}
              className="sm:hidden text-xs py-1.5 px-3"
            >
              Inscription
            </Button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-[#17231D] hover:text-[#176B4D] bg-white/80 hover:bg-[#E8F3ED]/40 border border-[#DCE5DE] shadow-xs transition-all active:scale-95 focus:outline-none cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with backdrop blur */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-3 top-20 z-50 bg-[#F7F9F7]/95 backdrop-blur-2xl border border-[#DCE5DE] rounded-3xl p-5 shadow-[0_20px_50px_rgba(16,75,56,0.18)] max-h-[calc(100vh-6rem)] overflow-y-auto animate-fade-in-up">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5DE] mb-2">
            <FaktelioLogo size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-xl text-gray-500 hover:text-[#17231D] hover:bg-gray-100"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-semibold text-[#17231D] hover:text-[#176B4D] hover:bg-[#E8F3ED]/50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 mt-2 border-t border-[#DCE5DE] flex flex-col gap-3">
            {user ? (
              <Button
                variant="primary"
                size="lg"
                shape="capsule"
                fullWidth
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/dashboard');
                }}
                icon={<LayoutDashboard className="w-4 h-4 text-[#E8F3ED]" />}
              >
                Accéder au Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="glass"
                  size="md"
                  shape="capsule"
                  fullWidth
                  onClick={handleDemoAccess}
                  icon={<Sparkles className="w-4 h-4 text-[#2E8B57]" />}
                >
                  Tester la démo instantanée
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  shape="capsule"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  shape="capsule"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  iconRight={<ArrowRight className="w-4 h-4 text-[#D9E7E3]" />}
                >
                  Créer mon compte gratuitement
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
