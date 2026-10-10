import React from 'react';
import { FaktelioLogo } from './common/FaktelioLogo';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { openCookiePreferencesModal } from './common/CookieConsentBanner';

export function Footer() {
  const { navigate } = useNavigation();
  const { loginDemo } = useAuth();

  return (
    <footer className="bg-[#0D2B21] text-white pt-16 pb-12 border-t border-[#123A2C]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#123A2C]">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <FaktelioLogo variant="white" size="md" />
            <p className="text-sm text-[#A9BDBC] leading-relaxed max-w-sm">
              FAKTELIO est la plateforme SaaS professionnelle de facturation, devis, CRM clients, suivi de paiements, stock et relances WhatsApp pour PME, commerçants et freelances.
            </p>
            <p className="text-xs text-[#D9E7E3]/60">
              Disponible 24/7 sur téléphone, tablette et ordinateur.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#F7FAF8]">Plateforme</h3>
            <ul className="space-y-2 text-sm text-[#A9BDBC]">
              <li>
                <a href="#fonctionnalites" className="hover:text-[#D9E7E3] transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-[#D9E7E3] transition-colors">
                  Solutions métiers
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-[#D9E7E3] transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#D9E7E3] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D9E7E3] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Modules Direct Access */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#F7FAF8]">
              Modules FAKTELIO
            </h3>
            <ul className="space-y-2 text-sm text-[#A9BDBC]">
              <li>
                <button
                  onClick={() => {
                    loginDemo();
                    navigate('/billing');
                  }}
                  className="hover:text-[#D9E7E3] transition-colors cursor-pointer"
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
                  className="hover:text-[#D9E7E3] transition-colors cursor-pointer"
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
                  className="hover:text-[#D9E7E3] transition-colors cursor-pointer"
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
                  className="hover:text-[#D9E7E3] transition-colors cursor-pointer"
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
                  className="hover:text-[#D9E7E3] transition-colors cursor-pointer"
                >
                  Analyses &amp; Rapports Financiers
                </button>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#F7FAF8]">
              Accès Rapide
            </h3>
            <p className="text-xs text-[#A9BDBC]">
              Testez immédiatement l&apos;application ou connectez-vous à votre espace entreprise.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/register')}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(33,92,70,0.3)] cursor-pointer"
              >
                Créer mon compte gratuitement
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-xl bg-[rgba(169,189,188,0.12)] hover:bg-[rgba(169,189,188,0.22)] border border-[rgba(217,231,227,0.3)] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Se connecter à FAKTELIO
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A9BDBC]/70">
          <p>© {new Date().getFullYear()} FAKTELIO. Tous droits réservés. Plateforme de facturation et gestion commerciale.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/politique-confidentialite')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Confidentialité
            </button>
            <button
              onClick={() => navigate('/mentions-legales')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mentions légales
            </button>
            <button
              onClick={() => navigate('/politique-cookies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Politique cookies
            </button>
            <button
              onClick={() => openCookiePreferencesModal()}
              className="hover:text-white transition-colors cursor-pointer text-[#D9E7E3] font-semibold underline underline-offset-2"
            >
              Gestion des cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
