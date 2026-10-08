import React from 'react';
import { Check, X } from 'lucide-react';
import { ComparisonRow } from '../types';
import { FaktelioLogo } from './common/FaktelioLogo';

const rows: ComparisonRow[] = [
  {
    feature: 'Temps de création d’une facture',
    traditional: '15 à 30 minutes (risque d’erreur de calcul)',
    faktelio: '+30 secondes avec calcul automatique HT/TVA/TTC',
  },
  {
    feature: 'Conversion Devis → Facture',
    traditional: 'Ressaisie complète manuelle',
    faktelio: 'En 1 clic sans aucune ressaisie',
  },
  {
    feature: 'Relances clients impayés',
    traditional: 'Oublis fréquents, messages rédigés à la main',
    faktelio: 'Message WhatsApp pré-rempli en 1 clic',
  },
  {
    feature: 'Suivi du stock et des alertes',
    traditional: 'Déconnecté de la facturation',
    faktelio: 'Synchronisé automatiquement à chaque facture',
  },
  {
    feature: 'Accès depuis téléphone et ordinateur',
    traditional: 'Fichiers bloqués sur un seul poste',
    faktelio: 'Accessible 24/7 partout avec sauvegarde Cloud',
  },
];

export function Comparison() {
  return (
    <section className="py-20 bg-white border-b border-[#D9E7E3]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#215C46]/10 text-[#215C46] border border-[#D9E7E3] text-xs font-extrabold uppercase tracking-wider mb-3">
            Comparatif
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Pourquoi passer d&apos;Excel ou du papier à FAKTELIO ?
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-[#D9E7E3] shadow-xs overflow-hidden">
          <div className="grid grid-cols-12 bg-[rgba(33,92,70,0.08)] border-b border-[rgba(33,92,70,0.15)] p-4 sm:p-5 text-xs sm:text-sm font-extrabold text-[#10241D]">
            <div className="col-span-12 sm:col-span-4 mb-2 sm:mb-0">Critère</div>
            <div className="col-span-6 sm:col-span-4 text-[#4A635A]">Méthode classique (Excel / Papier)</div>
            <div className="col-span-6 sm:col-span-4 flex items-center gap-2 text-[#215C46]">
              <FaktelioLogo size="sm" />
            </div>
          </div>

          <div className="divide-y divide-[#D9E7E3]">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center gap-2 text-xs sm:text-sm hover:bg-[rgba(169,189,188,0.10)] transition-colors">
                <div className="col-span-12 sm:col-span-4 font-bold text-[#10241D]">{row.feature}</div>
                <div className="col-span-6 sm:col-span-4 text-[#4A635A] flex items-start gap-2 pr-2">
                  <X className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
                <div className="col-span-6 sm:col-span-4 text-[#10241D] font-semibold flex items-start gap-2 bg-[#215C46]/6 p-2.5 rounded-xl border border-[#215C46]/15">
                  <Check className="w-4 h-4 text-[#215C46] stroke-[2.5] shrink-0 mt-0.5" />
                  <span>{row.faktelio}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
