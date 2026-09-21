import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';

const TYPEWRITER_WORDS = [
  'Créez vos devis et factures',
  'Faites-vous payer plus vite',
];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { navigate } = useNavigation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentText(TYPEWRITER_WORDS[0]);
      return;
    }

    const fullWord = TYPEWRITER_WORDS[wordIndex % TYPEWRITER_WORDS.length];

    if (!isDeleting && currentText === fullWord) {
      const timer = setTimeout(() => setIsDeleting(true), 1600);
      return () => clearTimeout(timer);
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
      return;
    }

    const speed = isDeleting ? 45 : 85;
    const timer = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting ? fullWord.slice(0, prev.length - 1) : fullWord.slice(0, prev.length + 1)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex]);

  return (
    <section className="relative overflow-hidden">
      {/* Glow backgrounds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#f27a2c]/10 blur-3xl"
      />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 relative flex flex-col items-center gap-10 py-14 text-center lg:py-20">
        <div className="max-w-3xl animate-fadeUp">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Logiciel de facturation pour PME, commerçants &amp; freelances
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            <span className="sr-only">
              Créez vos devis et factures en moins de 30 secondes et faites-vous payer plus vite.
            </span>
            <span aria-hidden="true" className="block min-h-[1.15em] text-[#295294]">
              <span className="inline-block min-w-[10ch] text-center">
                {currentText}
                <span
                  aria-hidden="true"
                  className="animate-blink ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.06em] rounded-full bg-[#f27a2c] align-middle"
                />
              </span>
            </span>
            <span aria-hidden="true">
              en moins de <span className="text-[#f27a2c]">30 secondes</span>.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            Fini les heures perdues sur Excel, les erreurs de calcul, les factures oubliées et les paiements en retard.
            Chapfacture vous fait créer des devis et factures professionnels, suivre vos paiements et relancer vos
            clients — depuis votre téléphone comme votre ordinateur.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-teal-400 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/40 ring-1 ring-inset ring-white/30 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Créer mon compte gratuitement
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => navigate('#fonctionnalites')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
            >
              Voir les fonctionnalités
            </button>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <div className="flex -space-x-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-[11px] font-bold text-white ring-2 ring-white">
                AK
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-teal-500 to-teal-400 text-[11px] font-bold text-white ring-2 ring-white">
                MD
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-[11px] font-bold text-white ring-2 ring-white">
                SA
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 text-[11px] font-bold text-white ring-2 ring-white">
                FK
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-[#f27a2c]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Adopté par des{' '}
                <span className="font-bold text-[#f27a2c]">entrepreneurs africains</span>
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Sans carte bancaire • 14 jours d'essai Entreprise • Prêt en 2 minutes
          </p>
        </div>

        {/* Dashboard hero screenshot */}
        <div className="relative w-full max-w-5xl animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f27a2c]/20 blur-3xl"
          />
          <img
            src="/hero.png"
            alt="Aperçu de Chapfacture : tableau de bord et facture professionnelle"
            className="relative z-10 h-auto w-full animate-float drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
