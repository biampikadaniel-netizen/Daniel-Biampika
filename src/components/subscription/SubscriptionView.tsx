import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Check,
  Zap,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export function SubscriptionView() {
  const { currentUser, refreshUser } = useAuth();
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<'wave' | 'orange' | 'mtn' | 'moov' | 'card'>('wave');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!currentUser) return null;

  // Compute trial remaining days
  const trialEnd = new Date(currentUser.trialEndsAt).getTime();
  const now = Date.now();
  const daysRemaining = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));
  const trialProgress = Math.min(100, Math.round(((14 - daysRemaining) / 14) * 100));

  const plans = [
    {
      id: 'basic',
      name: 'Basique',
      price: 'Gratuit',
      subtitle: 'Pour démarrer en solo',
      features: [
        'Jusqu’à 5 factures par mois',
        '1 seul utilisateur',
        'Création de devis & factures',
        'Export PDF standard',
        'Support communautaire',
      ],
      current: currentUser.plan === 'basic',
    },
    {
      id: 'startup',
      name: 'StartUp',
      price: '1 833 FCFA',
      period: '/mois (facturé annuellement)',
      subtitle: 'Pour les TPE & indépendants actifs',
      popular: true,
      features: [
        'Factures & Devis illimités',
        'Relances 1-clic sur WhatsApp',
        'Gestion complète des clients',
        'Gestion des stocks & alertes',
        'Jusqu’à 3 collaborateurs',
        'Paiements Mobile Money intégrés',
        'Support prioritaire 7j/7',
      ],
      current: currentUser.plan === 'startup',
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: '2 917 FCFA',
      period: '/mois (facturé annuellement)',
      subtitle: 'Pour les PME en forte croissance',
      features: [
        'Tout ce qui est dans StartUp',
        'Utilisateurs & équipes illimités',
        'Rapports financiers avancés & exports',
        'Multi-devises & TVA personnalisée',
        'Cachet d’entreprise numérique',
        'Accompagnement dédié & onboarding',
      ],
      current: currentUser.plan === 'enterprise',
    },
  ];

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(
        `Félicitations ! Votre souscription au plan ${selectedPlanModal?.toUpperCase()} a été validée avec succès via ${payMethod.toUpperCase()}.`
      );
      setTimeout(() => {
        setSuccessMessage(null);
        setSelectedPlanModal(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Abonnement &amp; Facturation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gérez votre formule, consultez l'état de votre période d'essai et débloquez toutes les fonctionnalités.
        </p>
      </div>

      {/* Trial Countdown Card */}
      <div className="bg-gradient-to-tr from-[#295294] via-[#1f3f72] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Essai gratuit Entreprise actif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Il vous reste <span className="text-teal-300">{daysRemaining} jour{daysRemaining > 1 ? 's' : ''}</span> d'essai gratuit
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Vous profitez actuellement de toutes les fonctionnalités premium du plan Entreprise (facturation illimitée, relances WhatsApp, stocks, multi-utilisateurs) sans aucun engagement.
            </p>
          </div>

          <div className="w-full md:w-64 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">Temps d'essai</span>
              <span className="text-teal-300">14 jours offerts</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${trialProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center">
              Expire le {new Date(currentUser.trialEndsAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-6 sm:p-8 bg-white border transition-all relative flex flex-col justify-between ${
              plan.popular
                ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-xl'
                : 'border-slate-200/80 shadow-xs hover:border-slate-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md">
                Recommandé pour PME
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                {plan.current && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 uppercase">
                    Plan Actuel
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-6">{plan.subtitle}</p>

              <div className="mb-6">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-xs text-slate-400 block mt-0.5">{plan.period}</span>}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Fonctionnalités incluses :
                </span>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={() => setSelectedPlanModal(plan.name)}
                className={`w-full py-3 rounded-2xl text-xs font-extrabold cursor-pointer transition-all ${
                  plan.popular
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.current ? 'Votre formule actuelle' : `Choisir l'offre ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Money / Payment Simulator Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Souscrire au plan {selectedPlanModal}
                </h3>
                <p className="text-xs text-slate-500">Paiement sécurisé instantané</p>
              </div>
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-800">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Moyen de paiement
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayMethod('wave')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                        payMethod === 'wave'
                          ? 'border-teal-500 bg-teal-50/60 text-teal-800 ring-1 ring-teal-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-teal-600" />
                      <span>Wave CI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayMethod('orange')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                        payMethod === 'orange'
                          ? 'border-orange-500 bg-orange-50/60 text-orange-800 ring-1 ring-orange-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-orange-600" />
                      <span>Orange Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayMethod('mtn')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                        payMethod === 'mtn'
                          ? 'border-amber-500 bg-amber-50/60 text-amber-800 ring-1 ring-amber-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>MTN MoMo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayMethod('card')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                        payMethod === 'card'
                          ? 'border-blue-500 bg-blue-50/60 text-blue-800 ring-1 ring-blue-500'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Carte Visa / MC</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Numéro de débit / Mobile Money
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transaction cryptée 256-bit. Aucun prélèvement automatique sans accord.</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanModal(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-extrabold text-white shadow-md shadow-teal-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? 'Validation en cours...' : 'Confirmer et activer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
