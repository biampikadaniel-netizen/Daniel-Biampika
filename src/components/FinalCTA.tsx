import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

export function FinalCTA() {
  const { user, loginDemo } = useAuth();
  const { navigate } = useNavigation();

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E4F91] via-[#2D5FA8] to-[#1E4F91] px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-[0_25px_60px_-15px_rgba(30,79,145,0.35)]">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-white text-xs font-extrabold uppercase tracking-wider mb-4">
              Prêt à moderniser votre gestion ?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
              Passez à la facturation rapide avec FAKTELIO dès aujourd&apos;hui
            </h2>
            <p className="text-base sm:text-lg text-white/85 mb-8 max-w-2xl mx-auto">
              Rejoignez les PME, commerçants et freelances qui créent leurs devis et factures en quelques secondes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-base font-bold shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>{user ? 'Ouvrir mon Dashboard FAKTELIO' : 'Créer mon compte gratuitement'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  loginDemo();
                  navigate('/dashboard');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 text-base font-bold transition-all cursor-pointer"
              >
                Explorer la démo interactive
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/90 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#F47B20] stroke-[3]" />
                0 FCFA pour commencer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#F47B20] stroke-[3]" />
                Sans carte bancaire
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#F47B20] stroke-[3]" />
                Support réactif 7j/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
