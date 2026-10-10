import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Sliders, ExternalLink, Cookie } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

export interface CookiePreferences {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'faktelio_cookie_consent';

export function getStoredCookieConsent(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function openCookiePreferencesModal() {
  window.dispatchEvent(new CustomEvent('faktelio_open_cookie_preferences'));
}

export function CookieConsentBanner() {
  const { navigate } = useNavigation();
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference switches
  const [preferences, setPreferences] = useState<Omit<CookiePreferences, 'necessary' | 'timestamp'>>({
    preferences: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent has already been registered
    const stored = getStoredCookieConsent();
    if (!stored) {
      // Show banner after brief initial mount
      const timer = setTimeout(() => setShowBanner(true), 600);
      return () => clearTimeout(timer);
    } else {
      setPreferences({
        preferences: stored.preferences,
        analytics: stored.analytics,
        marketing: stored.marketing,
      });
    }

    // Listen for custom event to reopen preferences (from footer or settings)
    const handleReopen = () => {
      setShowPreferences(true);
    };
    window.addEventListener('faktelio_open_cookie_preferences', handleReopen);
    return () => window.removeEventListener('faktelio_open_cookie_preferences', handleReopen);
  }, []);

  const saveConsent = (fullPrefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullPrefs));
    } catch {
      // Ignore quota errors
    }
    setShowBanner(false);
    setShowPreferences(false);

    // Notify listeners (e.g., PWA prompt that triggers 2 seconds after acceptance)
    window.dispatchEvent(
      new CustomEvent('faktelio_cookie_decision', {
        detail: { accepted: fullPrefs.analytics || fullPrefs.preferences || fullPrefs.marketing },
      })
    );
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    saveConsent(allAccepted);
  };

  const handleRefuseAll = () => {
    const refused: CookiePreferences = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    saveConsent(refused);
  };

  const handleSaveCustom = () => {
    const custom: CookiePreferences = {
      necessary: true,
      preferences: preferences.preferences,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: Date.now(),
    };
    saveConsent(custom);
  };

  return (
    <>
      {/* ==============================================================
          COOKIE CONSENT BANNER (SLIDE-UP FROM BOTTOM)
         ============================================================== */}
      {showBanner && !showPreferences && (
        <div
          role="region"
          aria-label="Consentement aux cookies"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 md:left-auto md:right-8 md:max-w-2xl z-50 animate-fade-in-up"
        >
          <div className="bg-[#F7FAF8]/95 backdrop-blur-2xl border border-[rgba(169,189,188,0.5)] shadow-[0_20px_60px_rgba(13,43,33,0.18)] rounded-3xl p-5 sm:p-6 text-[#10241D]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#215C46]/10 text-[#215C46] flex items-center justify-center shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-extrabold text-[#10241D] leading-tight">
                  Gestion des cookies &amp; Confidentialité
                </h3>
                <p className="text-xs sm:text-sm text-[#4A635A] mt-1.5 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur FAKTELIO, mesurer l&apos;utilisation du site et personnaliser certains contenus.
                </p>

                <div className="mt-2">
                  <button
                    onClick={() => navigate('/politique-confidentialite')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#215C46] hover:underline cursor-pointer"
                  >
                    En savoir plus
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="mt-5 pt-4 border-t border-[#D9E7E3]/60 flex flex-wrap items-center justify-end gap-2.5">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#D9E7E3]/30 border border-[#D9E7E3] text-[#10241D] text-xs font-bold transition-all cursor-pointer"
              >
                Personnaliser
              </button>

              <button
                onClick={handleRefuseAll}
                className="px-4 py-2.5 rounded-xl bg-[#D9E7E3]/40 hover:bg-[#D9E7E3]/70 text-[#10241D] text-xs font-bold transition-all cursor-pointer"
              >
                Refuser
              </button>

              <button
                onClick={handleAcceptAll}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-xs font-extrabold shadow-[0_4px_16px_rgba(33,92,70,0.25)] hover:shadow-[0_6px_20px_rgba(33,92,70,0.35)] transition-all cursor-pointer"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          CUSTOM PREFERENCES MODAL
         ============================================================== */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 bg-[#0D2B21]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#D9E7E3] overflow-hidden my-auto animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 bg-[#F7FAF8] border-b border-[#D9E7E3] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#215C46]/10 text-[#215C46] flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#10241D]">
                    Personnaliser vos préférences de cookies
                  </h2>
                  <p className="text-xs text-[#4A635A]">
                    Contrôlez les catégories de données que vous partagez avec FAKTELIO.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPreferences(false);
                  if (!getStoredCookieConsent()) setShowBanner(true);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Categories Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto divide-y divide-[#D9E7E3]/60">
              {/* Category 1: Strictly Necessary */}
              <div className="pt-2 first:pt-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-[#10241D] flex items-center gap-2">
                      Cookies strictement nécessaires
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-[#215C46]/10 text-[#215C46]">
                        Obligatoires
                      </span>
                    </h3>
                    <p className="text-xs text-[#4A635A] mt-1 leading-relaxed">
                      Indispensables au fonctionnement sécurisé de FAKTELIO (gestion de session, authentification, protection anti-fraude et mémorisation de vos choix de confidentialité). Ils ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="w-11 h-6 flex items-center bg-[#215C46] rounded-full p-1 opacity-70 cursor-not-allowed">
                      <span className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-5 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-[#215C46]" />
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Category 2: Preferences */}
              <div className="pt-4">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-[#10241D]">
                      Cookies de préférences
                    </h3>
                    <p className="text-xs text-[#4A635A] mt-1 leading-relaxed">
                      Permettent de mémoriser vos paramètres de confort : devise d&apos;affichage par défaut (FCFA), filtres de recherche récents et choix d&apos;interface.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({ ...prev, preferences: !prev.preferences }))
                    }
                    className={`shrink-0 w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      preferences.preferences ? 'bg-[#215C46]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        preferences.preferences ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Category 3: Analytics */}
              <div className="pt-4">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-[#10241D]">
                      Cookies de mesure d&apos;audience &amp; statistiques
                    </h3>
                    <p className="text-xs text-[#4A635A] mt-1 leading-relaxed">
                      Nous permettent d&apos;analyser l&apos;utilisation globale et les temps de chargement de manière strictement anonyme pour fluidifier la création de devis et factures.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))
                    }
                    className={`shrink-0 w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      preferences.analytics ? 'bg-[#215C46]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Category 4: Marketing */}
              <div className="pt-4">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-[#10241D]">
                      Cookies marketing &amp; communication ciblée
                    </h3>
                    <p className="text-xs text-[#4A635A] mt-1 leading-relaxed">
                      Permettent d&apos;adapter nos communications et suggestions selon votre secteur d&apos;activité (PME, commerçant, freelance).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))
                    }
                    className={`shrink-0 w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      preferences.marketing ? 'bg-[#215C46]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[#F7FAF8] border-t border-[#D9E7E3] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleRefuseAll}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#4A635A] hover:text-[#10241D] hover:bg-gray-200/50 transition-colors cursor-pointer"
              >
                Tout refuser
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleSaveCustom}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-[#D9E7E3] text-[#10241D] text-xs font-bold transition-all cursor-pointer"
                >
                  Enregistrer mes choix
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-xs font-extrabold shadow-sm cursor-pointer"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
