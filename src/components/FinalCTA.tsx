import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

export function FinalCTA() {
  const { user, loginDemo } = useAuth();
  const { navigate } = useNavigation();

  return (
    <section className="py-16 lg:py-24 bg-[#F7F9F7]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#104B38] via-[#176B4D] to-[#2E8B57] px-6 py-12 sm:px-12 sm:py-16 text-center text-white border border-[#DCE5DE]/30 shadow-[0_25px_60px_rgba(16,75,56,0.30)]">
          {/* Subtle Ambient Glow */}
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(232,243,237,0.4) 0%, rgba(23,107,77,0.8) 50%, transparent 80%)',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-[#E8F3ED] text-xs font-extrabold uppercase tracking-wider mb-4">
              Prêt à moderniser votre gestion ?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 text-white">
              Passez à la facturation rapide avec FAKTELIO dès aujourd&apos;hui
            </h2>
            <p className="text-base sm:text-lg text-[#E8F3ED] mb-8 max-w-2xl mx-auto">
              Rejoignez les PME, commerçants et freelances qui créent leurs devis et factures en quelques secondes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white hover:bg-[#E8F3ED] text-[#104B38] text-base font-extrabold shadow-[0_8px_24px_rgba(16,75,56,0.25)] hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <span>{user ? 'Ouvrir mon Dashboard FAKTELIO' : 'Créer mon compte gratuitement'}</span>
                <ArrowRight className="w-4 h-4 text-[#104B38] transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => {
                  loginDemo();
                  navigate('/dashboard');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md text-base font-bold transition-all cursor-pointer"
              >
                Explorer la démo interactive
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#E8F3ED] font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#E8F3ED] stroke-[3]" />
                0 FCFA pour commencer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#E8F3ED] stroke-[3]" />
                Sans carte bancaire
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#E8F3ED] stroke-[3]" />
                Support réactif 7j/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
