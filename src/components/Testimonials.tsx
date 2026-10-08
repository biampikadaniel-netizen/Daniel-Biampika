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
    gradient: 'bg-[#1E4F91]',
  },
  {
    quote:
      'Avant FAKTELIO, nous perdions un temps fou à chercher quelles factures étaient payées ou en attente. Aujourd’hui, tout notre tableau de bord et nos relances sont centralisés.',
    initials: 'AT',
    name: 'Aminata Touré',
    role: 'Fondatrice, Agence Digitale Kora',
    city: 'Dakar',
    gradient: 'bg-[#F47B20]',
  },
  {
    quote:
      'La gestion du catalogue et les alertes de stock nous ont permis d’éviter les ruptures sur nos articles les plus vendus. L’interface est claire et très rapide.',
    initials: 'JK',
    name: 'Jean-Marc Koffi',
    role: 'Gérant, ElectroPro Distribution',
    city: 'Abidjan',
    gradient: 'bg-[#2D5FA8]',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#F5F7FA] border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#1E4F91]/10 text-[#1E4F91] text-xs font-extrabold uppercase tracking-wider mb-3">
            Avis Clients
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Ils gèrent leur facturation au quotidien avec FAKTELIO
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#F47B20]">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <QuoteIcon className="w-6 h-6 text-[#1E4F91]/15" />
                </div>
                <p className="text-sm sm:text-base text-[#101828] leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F5F7FA]">
                <div
                  className={`w-10 h-10 rounded-full ${t.gradient} text-white text-xs font-extrabold flex items-center justify-center shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-[#101828]">{t.name}</p>
                  <p className="text-xs text-[#526581]">
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
