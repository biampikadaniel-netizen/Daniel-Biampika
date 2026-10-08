import React, { useState } from 'react';
import { Check, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlanType } from '../../types';

export function SubscriptionView() {
  const { user, updateUser } = useAuth();
  const [banner, setBanner] = useState<string | null>(null);

  if (!user) return null;

  const handleSelectPlan = (plan: PlanType, label: string) => {
    updateUser({ plan });
    setBanner(`Votre abonnement a été mis à jour vers la formule ${label} !`);
  };

  const plans: Array<{
    id: PlanType;
    name: string;
    price: string;
    features: string[];
  }> = [
    {
      id: 'basique',
      name: 'FAKTELIO Gratuit / Découverte',
      price: '0 FCFA / mois',
      features: [
        'Jusqu’à 15 devis & factures / mois',
        'Clients & CRM centralisés',
        'Téléchargement PDF professionnel',
      ],
    },
    {
      id: 'startup',
      name: 'FAKTELIO Pro',
      price: '9 900 FCFA / mois',
      features: [
        'Devis & factures illimités',
        'Relances WhatsApp en 1 clic',
        'Gestion de stock & alertes seuils',
        'Documents personnalisés (logo, couleurs, cachet)',
      ],
    },
    {
      id: 'entreprise',
      name: 'FAKTELIO Business',
      price: '24 900 FCFA / mois',
      features: [
        'Tout FAKTELIO Pro inclus',
        'Équipe & collaborateurs illimités',
        'Analyses avancées & exports CSV complets',
        'Support prioritaire dédié',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Mon Abonnement FAKTELIO
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Gérez votre formule FAKTELIO et vos moyens de règlement Mobile Money ou Carte.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E4F91]/10 text-[#1E4F91] text-xs font-extrabold uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
          Formule active : FAKTELIO {user.plan}
        </span>
      </div>

      {banner && (
        <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 text-[#15803D] text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {banner}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = user.plan === p.id;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-6 border flex flex-col justify-between ${
                isCurrent ? 'border-2 border-[#F47B20] shadow-md' : 'border-[#E2E8F0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-extrabold text-[#101828]">{p.name}</h2>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F47B20] text-white">
                      ACTUEL
                    </span>
                  )}
                </div>
                <p className="text-2xl font-extrabold text-[#1E4F91] mb-5">{p.price}</p>
                <ul className="space-y-2.5 mb-6 text-xs sm:text-sm text-[#101828]">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isCurrent}
                onClick={() => handleSelectPlan(p.id, p.name)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all ${
                  isCurrent
                    ? 'bg-[#F5F7FA] text-[#526581] cursor-default'
                    : 'bg-[#1E4F91] hover:bg-[#163C70] text-white cursor-pointer'
                }`}
              >
                {isCurrent ? 'Formule actuellement activée' : 'Activer cette formule'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
