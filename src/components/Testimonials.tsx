import React from 'react';
import { Star, Quote as QuoteIcon } from 'lucide-react';
import { Testimonial } from '../types';

const testimonials: Testimonial[] = [
  {
    quote:
      'Avec FAKTELIO, mes commerciaux envoient les devis directement sur WhatsApp en sortant de rendez-vous. Dès que le client accepte, on transforme en facture en 1 clic.',
    initials: 'MD',
    name: 'Moussa Diallo',
    role: 'Directeur Général, Ivoire Équipements',
    city: 'Abidjan',
    gradient: 'bg-[#215C46]',
  },
  {
    quote:
      'Avant FAKTELIO, nous perdions un temps fou à chercher quelles factures étaient payées ou en attente. Aujourd’hui, tout notre tableau de bord et nos relances sont centralisés.',
    initials: 'AT',
    name: 'Aminata Touré',
    role: 'Fondatrice, Agence Digitale Kora',
    city: 'Dakar',
    gradient: 'bg-[#123A2C]',
  },
  {
    quote:
      'La gestion du catalogue et les alertes de stock nous ont permis d’éviter les ruptures sur nos articles les plus vendus. L’interface est claire et très rapide.',
    initials: 'JK',
    name: 'Jean-Marc Koffi',
    role: 'Gérant, ElectroPro Distribution',
    city: 'Abidjan',
    gradient: 'bg-[#3F7A65]',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#0D2B21] text-white border-b border-[#123A2C] relative overflow-hidden">
      {/* Subtle Oceanic Glow */}
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(33,92,70,0.8) 0%, rgba(169,189,188,0.2) 60%, transparent 80%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#215C46]/50 border border-[#A9BDBC]/30 text-[#D9E7E3] text-xs font-extrabold uppercase tracking-wider mb-3">
            Avis Clients
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F7FAF8] tracking-tight">
            Ils gèrent leur facturation au quotidien avec FAKTELIO
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[rgba(169,189,188,0.08)] backdrop-blur-xl rounded-2xl p-7 border border-[rgba(217,231,227,0.20)] shadow-[0_20px_60px_rgba(13,43,33,0.30)] hover:shadow-[0_24px_70px_rgba(33,92,70,0.35)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#A9BDBC]">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current text-[#D9E7E3]" />
                    ))}
                  </div>
                  <QuoteIcon className="w-6 h-6 text-[#A9BDBC]/30" />
                </div>
                <p className="text-sm sm:text-base text-[#F7FAF8] leading-relaxed mb-6 font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[rgba(217,231,227,0.15)]">
                <div
                  className={`w-10 h-10 rounded-full ${t.gradient} border border-[rgba(217,231,227,0.3)] text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#F7FAF8]">{t.name}</p>
                  <p className="text-xs text-[#A9BDBC]">
                    {t.role} • {t.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
