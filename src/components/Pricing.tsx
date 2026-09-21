import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const { navigate } = useNavigation();

  const isYearly = billingCycle === 'yearly';

  return (
    <section id="tarifs" className="border-t border-slate-200/70 bg-slate-50/50 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Tarifs
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Des tarifs simples et transparents
          </h2>
          <p className="mt-4 text-slate-600">
            Choisissez l'offre adaptée à votre activité. Commencez gratuitement et passez à la vitesse supérieure quand
            votre entreprise grandit — sans engagement, changez ou annulez à tout moment.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-bold text-teal-700">
            🎁 14 jours d'essai Entreprise offerts à l'inscription
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`text-sm font-bold transition-colors ${
              isYearly ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Par an
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={!isYearly}
            aria-label="Basculer entre facturation annuelle et mensuelle"
            onClick={() => setBillingCycle(isYearly ? 'monthly' : 'yearly')}
            className="relative inline-flex h-7 w-14 shrink-0 items-center rounded-full bg-slate-200 transition-colors"
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-slate-700 shadow-sm transition-transform ${
                isYearly ? 'translate-x-1' : 'translate-x-8'
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`text-sm font-bold transition-colors ${
              !isYearly ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Par mois
          </button>
          <span className="rounded-lg bg-teal-100 px-2.5 py-1 text-xs font-bold text-teal-700">
            Économisez jusqu'à 48% 🤩
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="reveal mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-3">
          {/* Basique */}
          <div className="relative flex flex-col rounded-3xl border bg-white p-7 text-center shadow-sm border-slate-200">
            <h3 className="text-lg font-bold">Basique</h3>
            <p className="text-xs text-slate-500">Pour démarrer</p>
            <div className="mt-4">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight">0 FCFA</span>
              </div>
            </div>
            <div className="mt-1 min-h-[2.5rem]">
              <p className="text-xs text-slate-400">Gratuit, pour toujours</p>
            </div>
            <ul className="mt-5 space-y-2.5 text-left text-sm">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Jusqu'à 5 clients</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Jusqu'à 10 factures / mois</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Canal WhatsApp (basique)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Support communautaire</span>
              </li>
            </ul>
            <div className="mt-7 flex flex-1 items-end pt-2">
              <button
                onClick={() => navigate('/register')}
                className="block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold transition-transform hover:-translate-y-0.5 border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Commencer gratuitement
              </button>
            </div>
          </div>

          {/* StartUp */}
          <div className="relative flex flex-col rounded-3xl border bg-white p-7 text-center shadow-sm border-slate-200">
            <h3 className="text-lg font-bold">StartUp</h3>
            <p className="text-xs text-slate-500">Pour les indépendants et TPE</p>
            <div className="mt-4">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight">
                  {isYearly ? '1 833 F CFA' : '3 500 F CFA'}
                </span>
                <span className="whitespace-nowrap text-sm text-slate-400">/ mois</span>
              </div>
            </div>
            <div className="mt-1 min-h-[2.5rem]">
              {isYearly ? (
                <>
                  <p className="text-xs text-slate-400">22 000 F CFA / an, facturé annuellement</p>
                  <p className="text-xs font-semibold text-teal-600">Économisez 20 000 F CFA par an</p>
                </>
              ) : (
                <p className="text-xs text-slate-400">Facturé mensuellement, sans engagement</p>
              )}
            </div>
            <ul className="mt-5 space-y-2.5 text-left text-sm">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Jusqu'à 30 clients</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Jusqu'à 100 factures / mois</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Catalogue produits &amp; services</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Gestion de stock</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Canal WhatsApp (avancé)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Support email (48h)</span>
              </li>
            </ul>
            <div className="mt-7 flex flex-1 items-end pt-2">
              <button
                onClick={() => navigate('/register')}
                className="block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold transition-transform hover:-translate-y-0.5 bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-md shadow-teal-500/20 cursor-pointer"
              >
                Commencez maintenant
              </button>
            </div>
          </div>

          {/* Entreprise */}
          <div className="relative flex flex-col rounded-3xl border bg-white p-7 text-center shadow-sm border-teal-400 ring-2 ring-teal-400/40 lg:-mt-2 lg:shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              Le plus choisi
            </span>
            <h3 className="text-lg font-bold">Entreprise</h3>
            <p className="text-xs text-slate-500">Pour les équipes</p>
            <div className="mt-4">
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight">
                  {isYearly ? '2 917 F CFA' : '5 500 F CFA'}
                </span>
                <span className="whitespace-nowrap text-sm text-slate-400">/ mois</span>
              </div>
            </div>
            <div className="mt-1 min-h-[2.5rem]">
              {isYearly ? (
                <>
                  <p className="text-xs text-slate-400">35 000 F CFA / an, facturé annuellement</p>
                  <p className="text-xs font-semibold text-teal-600">Économisez 31 000 F CFA par an</p>
                </>
              ) : (
                <p className="text-xs text-slate-400">Facturé mensuellement, sans engagement</p>
              )}
            </div>
            <ul className="mt-5 space-y-2.5 text-left text-sm">
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Clients illimités</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Factures illimitées</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Catalogue produits &amp; services</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Gestion de stock</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Équipe jusqu'à 3 utilisateurs</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Signature &amp; cachet sur les documents</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Canal WhatsApp (prioritaire)</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-slate-600">Support prioritaire (24h)</span>
              </li>
            </ul>
            <div className="mt-7 flex flex-1 items-end pt-2">
              <button
                onClick={() => navigate('/register')}
                className="block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold transition-transform hover:-translate-y-0.5 bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-md shadow-teal-500/20 cursor-pointer"
              >
                Commencez maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
