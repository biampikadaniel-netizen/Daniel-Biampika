import React from 'react';
import { Clock, ShieldCheck, Smartphone, TrendingUp, CheckCircle2 } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Gagnez jusqu’à 8 heures par semaine',
    description:
      'Fini les calculs manuels sur papier ou Excel. Vos totaux HT, TVA, remises et soldes restants sont calculés automatiquement.',
    highlight: 'Facturation en +30 sec',
  },
  {
    icon: Smartphone,
    title: 'Facturez depuis votre téléphone ou votre PC',
    description:
      'Au bureau, en déplacement chez un client ou en boutique, créez un devis et partagez-le sur WhatsApp immédiatement.',
    highlight: '100% Cloud & Mobile',
  },
  {
    icon: TrendingUp,
    title: 'Soyez payé 2x plus rapidement',
    description:
      'Suivez vos factures en attente et relancez vos clients en 1 clic sur WhatsApp avec tous les détails de règlement.',
    highlight: 'Relances WhatsApp intégrées',
  },
  {
    icon: ShieldCheck,
    title: 'Image professionnelle irréprochable',
    description:
      'Vos documents portent votre logo, vos couleurs, votre cachet et vos mentions légales avec une mise en page nette.',
    highlight: 'PDF A4 certifiés FAKTELIO',
  },
];

export function Benefits() {
  return (
    <section className="py-20 bg-[#F5F7FA] border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#1E4F91]/10 text-[#1E4F91] text-xs font-extrabold uppercase tracking-wider mb-3">
            Pourquoi choisir FAKTELIO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Conçu pour simplifier la gestion quotidienne de votre entreprise
          </h2>
          <p className="text-base text-[#526581] mt-3">
            FAKTELIO remplace les carnets à souche et les tableurs complexes par un outil moderne, rapide et rassurant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1E4F91]/10 text-[#1E4F91] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#101828] mb-2">{b.title}</h3>
                  <p className="text-sm text-[#526581] leading-relaxed mb-5">{b.description}</p>
                </div>
                <div className="pt-3 border-t border-[#F5F7FA] flex items-center gap-1.5 text-xs font-bold text-[#F47B20]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>{b.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
