import React from 'react';
import {
  Check,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { DynamicHeroText } from './hero/DynamicHeroText';

export function Hero() {
  const { user, loginDemo } = useAuth();
  const { navigate } = useNavigation();

  const handlePrimaryAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleDemoAction = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <section className="relative overflow-hidden w-full bg-[#F7FAF8] border-b border-[#D9E7E3]/60 py-7 sm:py-10 lg:py-16 xl:py-20 flex items-center">
      {/* Soft top-left ambient studio glow */}
      <div
        className="absolute -top-32 left-0 w-[260px] sm:w-[500px] lg:w-[600px] h-[360px] sm:h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(169,189,188,0.35) 0%, rgba(33,92,70,0.15) 50%, transparent 80%)',
        }}
      />

      {/* ==============================================================
          HERO RESPONSIVE CONTENT: TWO-COLUMN ON DESKTOP, AIRY FLOW ON MOBILE
          Guarantees 100% text contrast with ZERO text/image overlap
         ============================================================== */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: Text Content & Actions */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left w-full">
            {/* 1. Header Badge: Pill Capsule with Green Dot */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[rgba(169,189,188,0.25)] border border-[rgba(217,231,227,0.85)] backdrop-blur-md mb-4 sm:mb-5 shadow-xs max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#215C46] animate-pulse shrink-0" />
              <span className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-xs font-extrabold uppercase tracking-wide sm:tracking-wider text-[#123A2C] leading-snug">
                LOGICIEL DE FACTURATION POUR PME, COMMERÇANTS &amp; FREELANCES
              </span>
            </div>

            {/* 2. Main Title: Static Line 1 + Dynamic Rotating Line 2 */}
            <h1 className="text-[26px] min-[360px]:text-[29px] min-[390px]:text-[33px] min-[430px]:text-[36px] sm:text-[44px] md:text-[48px] lg:text-[48px] xl:text-[54px] font-extrabold text-[#10241D] tracking-tight leading-[1.15] sm:leading-[1.12] mb-4 sm:mb-5">
              <span className="block">Créez vos devis et factures</span>
              <span className="block mt-1 sm:mt-1.5">
                <DynamicHeroText />
              </span>
            </h1>

            {/* 3. Subtitle Paragraph: Crystal-clear contrast on solid luminous background */}
            <p className="text-[14px] min-[360px]:text-[15px] sm:text-[17px] lg:text-[18px] text-[#4A635A] max-w-xl font-normal leading-relaxed mb-6 sm:mb-7">
              Faktelio simplifie votre facturation, vos clients, vos paiements et votre gestion
              commerciale depuis votre téléphone ou votre ordinateur.
            </p>

            {/* 4. Action Buttons (Pill / Capsule Shape) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-7 w-full sm:w-auto">
              {/* Primary Capsule Button */}
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 min-h-[48px] rounded-full text-white text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer shadow-[0_12px_32px_rgba(18,58,44,0.32)] hover:shadow-[0_16px_36px_rgba(18,58,44,0.42)] hover:scale-[1.02] active:scale-[0.98] border border-white/20 w-full sm:w-auto text-center"
                style={{
                  background: 'linear-gradient(135deg, #123A2C 0%, #1A4937 40%, #215C46 100%)',
                  boxShadow:
                    'inset 0 1px 2px rgba(255, 255, 255, 0.40), inset 0 -2px 4px rgba(0, 0, 0, 0.20), 0 12px 32px rgba(18, 58, 44, 0.32)',
                }}
              >
                <span>{user ? 'Accéder à mon Dashboard' : 'Créer mon compte gratuitement'}</span>
                <ArrowRight className="w-4 h-4 text-[#D9E7E3] group-hover:translate-x-1 transition-transform shrink-0" />
              </button>

              {/* Secondary Capsule Button */}
              <a
                href="#fonctionnalites"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 min-h-[48px] rounded-full text-[#10241D] hover:text-[#215C46] text-sm sm:text-base font-bold bg-white/85 hover:bg-white border border-[#D9E7E3] hover:border-[#215C46]/40 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98] w-full sm:w-auto text-center"
              >
                Voir les fonctionnalités
              </a>
            </div>

            {/* 5. Reassurance Checkmarks */}
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#4A635A] mb-6 sm:mb-8 w-full">
              <span className="inline-flex items-center gap-1.5 shrink-0">
                <Check className="w-4 h-4 text-[#215C46] stroke-[2.5] shrink-0" />
                Sans carte bancaire
              </span>
              <span className="inline-flex items-center gap-1.5 shrink-0">
                <Check className="w-4 h-4 text-[#215C46] stroke-[2.5] shrink-0" />
                Démarrage gratuit
              </span>
              <span className="inline-flex items-center gap-1.5 shrink-0">
                <Check className="w-4 h-4 text-[#215C46] stroke-[2.5] shrink-0" />
                Accessible partout
              </span>
            </div>

            {/* 6. Floating Glass Rating Badge */}
            <div className="w-full sm:w-auto inline-flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center gap-2.5 sm:gap-3 p-3 min-[480px]:py-2.5 min-[480px]:px-5 rounded-2xl min-[480px]:rounded-full bg-white/90 backdrop-blur-md border border-[rgba(217,231,227,0.85)] shadow-[0_8px_24px_rgba(13,43,33,0.08)]">
              {/* Avatars & Stars group */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Overlapping User Avatars */}
                <div className="flex -space-x-2 shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0E7051] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                    KD
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#123A2C] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                    AT
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#3F7A65] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                    MK
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#A9BDBC] text-[#0D2B21] text-xs font-bold flex items-center justify-center ring-2 ring-white">
                    CN
                  </div>
                </div>

                {/* Star Rating & Stat */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-[#10241D]">4.9/5</span>
                </div>
              </div>

              {/* Stat text & 1-click Demo */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-[#4A635A]">
                <span>
                  <span className="hidden min-[480px]:inline text-[#4A635A]/60 mr-1">•</span>
                  Adopté par <strong className="text-[#10241D] font-bold">+2 500 PME &amp; entrepreneurs</strong>
                </span>

                {/* Clickable 1-click Demo */}
                <button
                  type="button"
                  onClick={handleDemoAction}
                  className="text-xs font-bold text-[#215C46] hover:text-[#123A2C] underline underline-offset-2 cursor-pointer transition-colors py-1 min-h-[36px] flex items-center ml-auto min-[480px]:ml-0"
                >
                  Tester la démo en 1 clic
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card (African Businesswoman & Faktelio Interface) */}
          <div className="lg:col-span-5 xl:col-span-6 w-full mt-2 lg:mt-0">
            <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
              {/* Ambient rim glow behind the card */}
              <div
                className="absolute -inset-2 sm:-inset-4 rounded-3xl opacity-35 blur-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(169,189,188,0.45) 0%, rgba(33,92,70,0.2) 60%, transparent 80%)',
                }}
              />

              {/* Image Showcase Card: Cleanly framing the entrepreneur, laptop, and 3D dashboard with ZERO text collision */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_45px_rgba(18,58,44,0.12)] border border-[#D9E7E3] bg-[#E9F0EC] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/11]">
                <img
                  src="/images/hero_faktelio_full.jpg"
                  alt="Entrepreneure gérant sa facturation sur Faktelio"
                  className="w-full h-full object-cover object-[78%_center] select-none filter contrast-[1.02]"
                  loading="eager"
                />

                {/* Subtle glass reflection ring */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/35 rounded-2xl sm:rounded-3xl pointer-events-none" />

                {/* Bottom soft gradient for subtle depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#10241D]/25 via-transparent to-transparent pointer-events-none" />

                {/* Floating micro-badge on image */}
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/92 backdrop-blur-md border border-[rgba(217,231,227,0.85)] shadow-md">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#215C46] animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-bold text-[#10241D]">
                    Gestion &amp; Facturation en temps réel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
