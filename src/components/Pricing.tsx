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
    <section id="tarifs" className="py-20 lg:py-28 bg-[#F7FAF8] border-b border-[#D9E7E3]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#215C46]/10 text-[#215C46] border border-[#D9E7E3] text-xs font-extrabold uppercase tracking-wider mb-3">
            Tarifs transparents
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10241D] tracking-tight mb-4">
            Commencez à 0 FCFA et évoluez selon vos besoins
          </h2>
          <p className="text-base text-[#4A635A] mb-8">
            Aucun frais caché. Sans carte bancaire à l&apos;inscription. Paiement flexible par Mobile Money (Wave, Orange Money, MTN) ou carte bancaire.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white border border-[#D9E7E3] shadow-xs">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                !annual ? 'bg-[#215C46] text-white shadow-xs' : 'text-[#4A635A] hover:text-[#10241D]'
              }`}
            >
              Facturation mensuelle
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                annual ? 'bg-[#215C46] text-white shadow-xs' : 'text-[#4A635A] hover:text-[#10241D]'
              }`}
            >
              <span>Facturation annuelle</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#A9BDBC] text-[#0D2B21]">
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
                    ? 'bg-white border-2 border-[#215C46] shadow-[0_20px_50px_rgba(33,92,70,0.18)] relative lg:-translate-y-2'
                    : 'bg-white/95 border border-[#D9E7E3] shadow-xs hover:shadow-[0_14px_35px_rgba(33,92,70,0.1)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        plan.popular
                          ? 'bg-[#215C46] text-white'
                          : 'bg-[#215C46]/10 text-[#215C46]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    {plan.popular && <Sparkles className="w-5 h-5 text-[#215C46]" />}
                  </div>

                  <h3 className="text-2xl font-extrabold text-[#10241D]">{plan.name}</h3>
                  <p className="text-xs sm:text-sm text-[#4A635A] mt-1.5 mb-6">{plan.subtitle}</p>

                  <div className="pb-6 mb-6 border-b border-[#D9E7E3]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#10241D]">
                        {price === 0 ? '0 FCFA' : `${price.toLocaleString('fr-FR')} FCFA`}
                      </span>
                      <span className="text-xs font-semibold text-[#4A635A]">/ mois</span>
                    </div>
                    <p className="text-xs text-[#4A635A] mt-1">
                      {price === 0
                        ? 'Gratuit sans limite de durée pour débuter'
                        : annual
                        ? 'Facturé annuellement • Économisez 20%'
                        : 'Sans engagement, résiliable à tout moment'}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#10241D]">
                        <span className="w-5 h-5 rounded-full bg-[#215C46]/15 text-[#215C46] flex items-center justify-center shrink-0 mt-0.5">
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
                  className={`w-full py-3.5 px-5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white shadow-[0_8px_24px_rgba(33,92,70,0.3)] hover:-translate-y-0.5'
                      : 'bg-[#123A2C] hover:bg-[#0D2B21] text-white shadow-xs'
                  }`}
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 text-[#D9E7E3]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
