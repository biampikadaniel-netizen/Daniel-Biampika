import React from 'react';
import { ArrowLeft, Cookie, Check, Sliders, ExternalLink } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { FaktelioLogo } from '../common/FaktelioLogo';
import { openCookiePreferencesModal } from '../common/CookieConsentBanner';
import { Footer } from '../Footer';

export function CookiePolicyPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#10241D]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D9E7E3] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4A635A] hover:text-[#215C46] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </button>
          <FaktelioLogo size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#215C46]/10 text-[#215C46] text-xs font-bold uppercase tracking-wider mb-3">
            <Cookie className="w- trace-3.5 h-3.5" />
            Cookies &amp; Traceurs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10241D] tracking-tight">
            Politique Relative aux Cookies
          </h1>
          <p className="text-sm text-[#4A635A] mt-2">
            Comprendre comment FAKTELIO utilise les témoins de connexion pour sécuriser et optimiser votre expérience.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9E7E3] shadow-sm space-y-8 text-sm leading-relaxed text-[#10241D]">
          {/* Quick Action to manage cookies right from this page */}
          <div className="p-5 rounded-2xl bg-[#E8F4F0] border border-[#215C46]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-[#123A2C]">
                Modifier vos préférences de cookies à tout moment
              </h2>
              <p className="text-xs text-[#215C46] mt-0.5">
                Vous pouvez activer ou désactiver les cookies optionnels quand vous le souhaitez.
              </p>
            </div>
            <button
              onClick={() => openCookiePreferencesModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors shrink-0"
            >
              <Sliders className="w-4 h-4" />
              Gérer mes préférences
            </button>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46]">
              1. Qu&apos;est-ce qu&apos;un cookie ?
            </h2>
            <p className="text-[#4A635A]">
              Un cookie est un petit fichier texte déposé sur votre navigateur lors de la consultation d&apos;un site ou de l&apos;utilisation d&apos;une application web. Il permet de reconnaître votre terminal, de maintenir votre session ouverte en toute sécurité et de conserver vos préférences d&apos;utilisation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46]">
              2. Les catégories de cookies utilisées sur FAKTELIO
            </h2>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <h3 className="font-bold text-[#10241D] flex items-center justify-between">
                  <span>A. Cookies strictement nécessaires (Obligatoires)</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#215C46]/10 text-[#215C46]">Actif en permanence</span>
                </h3>
                <p className="text-xs text-[#4A635A] mt-1.5 leading-relaxed">
                  Ces cookies garantissent les fonctions essentielles de la plateforme : authentification sécurisée de votre compte, protection contre les failles CSRF, mémorisation de votre panier ou état de formulaire, et conservation de vos choix de consentement. Ils ne requièrent pas de consentement préalable car le service ne peut fonctionner sans eux.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <h3 className="font-bold text-[#10241D]">
                  B. Cookies de préférences (Optionnels)
                </h3>
                <p className="text-xs text-[#4A635A] mt-1.5 leading-relaxed">
                  Ils permettent de mémoriser vos choix de personnalisation (devise par défaut FCFA, affichage de l&apos;interface, filtres récemment utilisés) pour vous éviter de devoir les réinitialiser à chaque connexion.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <h3 className="font-bold text-[#10241D]">
                  C. Cookies de mesure d&apos;audience (Optionnels)
                </h3>
                <p className="text-xs text-[#4A635A] mt-1.5 leading-relaxed">
                  Ces traceurs mesurent les performances techniques (temps de génération des factures PDF, fluidité de navigation) de manière strictement anonyme et agrégée.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <h3 className="font-bold text-[#10241D]">
                  D. Cookies marketing (Optionnels)
                </h3>
                <p className="text-xs text-[#4A635A] mt-1.5 leading-relaxed">
                  Ils permettent d&apos;adapter les communications et conseils d&apos;utilisation selon votre profil (PME, commerçant, freelance).
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46]">
              3. Durée de conservation
            </h2>
            <p className="text-[#4A635A]">
              Votre choix de consentement aux cookies est conservé pour une durée maximale de <strong>6 mois</strong>. À l&apos;expiration de cette durée, ou si vous videz le cache de votre navigateur, le bandeau de consentement vous sera à nouveau proposé.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46]">
              4. Gestion via votre navigateur
            </h2>
            <p className="text-[#4A635A]">
              Vous pouvez également configurer votre navigateur pour refuser ou supprimer les cookies. Veuillez noter que la désactivation des cookies nécessaires peut empêcher le bon fonctionnement de votre espace administrateur FAKTELIO.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
