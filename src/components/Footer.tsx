import React from 'react';
import { FaktelioLogo } from './common/FaktelioLogo';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';

export function Footer() {
  const { navigate } = useNavigation();
  const { loginDemo } = useAuth();

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-12 border-t border-[#1E293B]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <FaktelioLogo variant="white" size="md" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              FAKTELIO est la plateforme SaaS professionnelle de facturation, devis, CRM clients, suivi de paiements, stock et relances WhatsApp pour PME, commerçants et freelances.
            </p>
            <p className="text-xs text-slate-400">
              Disponible 24/7 sur téléphone, tablette et ordinateur.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Plateforme</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="#fonctionnalites" className="hover:text-[#F47B20] transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#F47B20] transition-colors">
                  Solutions métiers
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-[#F47B20] transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#F47B20] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F47B20] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Modules Direct Access */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Modules FAKTELIO
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => {
                    loginDemo();
                    navigate('/billing');
                  }}
                  className="hover:text-[#F47B20] transition-colors cursor-pointer"
                >
                  Création de Factures &amp; Devis
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    loginDemo();
                    navigate('/clients');
                  }}
                  className="hover:text-[#F47B20] transition-colors cursor-pointer"
                >
                  CRM Clients &amp; Historique
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    loginDemo();
                    navigate('/products');
                  }}
                  className="hover:text-[#F47B20] transition-colors cursor-pointer"
                >
                  Catalogue &amp; Gestion de Stock
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    loginDemo();
                    navigate('/reminders');
                  }}
                  className="hover:text-[#F47B20] transition-colors cursor-pointer"
                >
                  Relances Automatiques WhatsApp
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    loginDemo();
                    navigate('/reports');
                  }}
                  className="hover:text-[#F47B20] transition-colors cursor-pointer"
                >
                  Analyses &amp; Rapports Financiers
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Accès Rapide
            </h3>
            <p className="text-xs text-slate-300">
              Testez immédiatement l&apos;application ou connectez-vous à votre espace entreprise.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/register')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Créer mon compte gratuitement
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Se connecter à FAKTELIO
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} FAKTELIO SaaS. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>Sécurité Cloud SSL</span>
            <span>Conformité Facturation PME</span>
            <span>FAKTELIO v2.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
