import React from 'react';
import { Store, Briefcase, Wrench, Building2, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

const solutions = [
  {
    icon: Store,
    title: 'Commerçants & Boutiques',
    subtitle: 'Vente de marchandises, équipements, distribution et négoce.',
    features: [
      'Facturation comptoir et devis rapides sur mobile ou PC',
      'Déduction automatique du stock à chaque vente validée',
      'Alertes de seuil minimum pour réapprovisionner à temps',
    ],
  },
  {
    icon: Briefcase,
    title: 'Freelances, Consultants & Agences',
    subtitle: 'Prestations intellectuelles, digital, conseil, design et formation.',
    features: [
      'Devis élégants convertis en factures en un seul clic',
      'Suivi des acomptes et paiements partiels par projet',
      'Documents personnalisés avec votre logo et votre signature',
    ],
  },
  {
    icon: Wrench,
    title: 'Artisans, BTP & Prestataires techniques',
    subtitle: 'Chantiers, maintenance, installation, solaire et services terrain.',
    features: [
      'Création de devis sur le terrain directement sur smartphone',
      'Envoi immédiat du PDF au client via WhatsApp',
      'Historique complet des interventions et règlements par client',
    ],
  },
  {
    icon: Building2,
    title: 'PME & Entreprises en croissance',
    subtitle: 'Équipes commerciales structurées et gestion multi-utilisateurs.',
    features: [
      'Tableau de bord financier et analyses du chiffre d’affaires',
      'Accès collaborateurs avec gestion des rôles (Admin, Manager)',
      'Export CSV des écritures, clients et rapports mensuels',
    ],
  },
];

export function Audience() {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  return (
    <section id="solutions" className="py-20 lg:py-24 bg-[#F7FAF8] border-b border-[#D9E7E3]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#215C46]/10 text-[#215C46] border border-[#D9E7E3] text-xs font-extrabold uppercase tracking-wider mb-3">
            Solutions par métier
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Une solution adaptée à chaque type d&apos;activité
          </h2>
          <p className="text-base text-[#4A635A] mt-3">
            Que vous vendiez des produits physiques, des prestations de services ou les deux, FAKTELIO s&apos;adapte à votre organisation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="bg-white/95 rounded-2xl p-7 border border-[#D9E7E3] shadow-xs hover:shadow-[0_16px_36px_rgba(33,92,70,0.12)] hover:border-[#215C46]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#215C46] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[#101828]">{sol.title}</h3>
                      <p className="text-xs sm:text-sm text-[#4A635A]">{sol.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5 my-5">
                    {sol.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#101828]">
                        <Check className="w-4 h-4 text-[#215C46] stroke-[2.5] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#D9E7E3]/60 flex items-center justify-between">
                  <button
                    onClick={() => navigate(user ? '/dashboard' : '/register')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#215C46] hover:text-[#123A2C] transition-colors cursor-pointer"
                  >
                    <span>Démarrer avec cette configuration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-semibold text-[#4A635A]">FAKTELIO Pro</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
