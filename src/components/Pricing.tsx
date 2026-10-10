import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

interface FaktelioPlan {
  id: 'basique' | 'startup' | 'entreprise';
  name: string;
  subtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  popular?: boolean;
  badge?: string;
  ctaLabel: string;
  features: string[];
}

const plans: FaktelioPlan[] = [
  {
    id: 'basique',
    name: 'Gratuit / Découverte',
    subtitle: 'Idéal pour démarrer et tester FAKTELIO sans engagement.',
    monthlyPrice: 0,
    annualPrice: 0,
    badge: '0 FCFA POUR COMMENCER',
    ctaLabel: 'Démarrer gratuitement',
    features: [
      'Jusqu’à 15 devis & factures / mois',
      'Conversion Devis → Facture en 1 clic',
      'Gestion des clients & CRM de base',
      'Catalogue produits & services',
      'Téléchargement PDF professionnel',
    ],
  },
  {
    id: 'startup',
    name: 'FAKTELIO Pro',
    subtitle: 'Pour les PME, commerçants et freelances en pleine activité.',
    monthlyPrice: 9900,
    annualPrice: 7900,
    popular: true,
    badge: 'LE PLUS POPULAIRE',
    ctaLabel: 'Choisir FAKTELIO Pro',
    features: [
      'Devis et factures illimités',
      'Relances clients WhatsApp automatiques',
      'Gestion complète du stock & alertes seuils',
      'Suivi des paiements partiels & Mobile Money',
      'Documents personnalisés (logo, couleurs, cachet)',
      'Jusqu’à 3 utilisateurs inclus',
    ],
  },
  {
    id: 'entreprise',
    name: 'FAKTELIO Business',
    subtitle: 'Pour les entreprises structurées et équipes multi-utilisateurs.',
    monthlyPrice: 24900,
    annualPrice: 19900,
    badge: 'PERFORMANCE MAXIMALE',
    ctaLabel: 'Choisir FAKTELIO Business',
    features: [
      'Tout le plan FAKTELIO Pro inclus',
      'Utilisateurs & collaborateurs illimités',
      'Analyses financières avancées & exports CSV',
      'Gestion multi-dépôts & mouvements de stock',
      'Accompagnement prioritaire & formation équipe',
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const handleSelectPlan = (planId: FaktelioPlan['id']) => {
    if (user) {
      navigate('/subscription');
    } else {
      navigate('/register', { selectedPlan: planId });
    }
  };

  return (
    <section id="tarifs" className="py-20 lg:py-28 bg-[#F7F9F7] border-b border-[#DCE5DE]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#E8F3ED] text-[#176B4D] border border-[#DCE5DE] text-xs font-extrabold uppercase tracking-wider mb-3">
            Tarifs transparents
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17231D] tracking-tight mb-4">
            Commencez à 0 FCFA et évoluez selon vos besoins
          </h2>
          <p className="text-base text-[#65736B] mb-8">
            Aucun frais caché. Sans carte bancaire à l&apos;inscription. Paiement flexible par Mobile Money (Wave, Orange Money, MTN) ou carte bancaire.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white border border-[#DCE5DE] shadow-xs">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                !annual ? 'bg-[#176B4D] text-white shadow-xs' : 'text-[#65736B] hover:text-[#17231D]'
              }`}
            >
              Facturation mensuelle
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                annual ? 'bg-[#176B4D] text-white shadow-xs' : 'text-[#65736B] hover:text-[#17231D]'
              }`}
            >
              <span>Facturation annuelle</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                annual ? 'bg-[#104B38] text-white' : 'bg-[#E8F3ED] text-[#176B4D]'
              }`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
          {plans.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 backdrop-blur-md ${
                  plan.popular
                    ? 'bg-white border-2 border-[#176B4D] shadow-[0_20px_50px_rgba(23,107,77,0.18)] relative lg:-translate-y-2'
                    : 'bg-white/95 border border-[#DCE5DE] shadow-xs hover:shadow-[0_14px_35px_rgba(23,107,77,0.1)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        plan.popular
                          ? 'bg-[#176B4D] text-white'
                          : 'bg-[#E8F3ED] text-[#176B4D] border border-[#DCE5DE]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    {plan.popular && <Sparkles className="w-5 h-5 text-[#2E8B57]" />}
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#17231D]">{plan.name}</h3>
                  <p className="text-xs sm:text-sm text-[#65736B] mt-1.5 mb-6">{plan.subtitle}</p>

                  <div className="pb-6 mb-6 border-b border-[#DCE5DE]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#17231D]">
                        {price === 0 ? '0 FCFA' : `${price.toLocaleString('fr-FR')} FCFA`}
                      </span>
                      <span className="text-xs font-semibold text-[#65736B]">/ mois</span>
                    </div>
                    <p className="text-xs text-[#65736B] mt-1">
                      {price === 0
                        ? 'Gratuit sans limite de durée pour débuter'
                        : annual
                        ? 'Facturé annuellement • Économisez 20%'
                        : 'Sans engagement, résiliable à tout moment'}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#17231D]">
                        <span className="w-5 h-5 rounded-full bg-[#E8F3ED] text-[#176B4D] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3.5 px-5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#176B4D] ${
                    plan.popular
                      ? 'bg-[#176B4D] hover:bg-[#104B38] text-white shadow-[0_8px_24px_rgba(23,107,77,0.25)] hover:-translate-y-0.5'
                      : 'bg-white hover:bg-[#E8F3ED] text-[#104B38] border border-[#DCE5DE] shadow-xs hover:border-[#176B4D]'
                  }`}
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-current" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
