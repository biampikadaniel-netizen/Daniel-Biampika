import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Share2, PlusSquare, Check } from 'lucide-react';
import { FaktelioLogo } from './FaktelioLogo';
import { getStoredCookieConsent } from './CookieConsentBanner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = 'faktelio_pwa_dismissed';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));
      return isStandaloneMode;
    };

    if (checkStandalone()) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      try {
        localStorage.setItem('faktelio_pwa_installed', 'true');
      } catch {
        // Ignore
      }
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // Handle cookie acceptance sequence:
    // If user accepts cookies right now, wait 2 seconds before showing PWA prompt
    const handleCookieDecision = (e: Event) => {
      const detail = (e as CustomEvent<{ accepted: boolean }>).detail;
      if (detail && detail.accepted) {
        schedulePwaPrompt(2000);
      }
    };
    window.addEventListener('faktelio_cookie_decision', handleCookieDecision);

    // If cookies were already accepted on a previous visit, check whether to show
    const existingConsent = getStoredCookieConsent();
    if (existingConsent && (existingConsent.analytics || existingConsent.preferences || existingConsent.marketing)) {
      schedulePwaPrompt(3000);
    }

    function schedulePwaPrompt(delayMs: number) {
      if (checkStandalone()) return;
      const dismissed = localStorage.getItem(DISMISS_KEY);
      // If user dismissed in the last 48 hours, don't nag
      if (dismissed && Date.now() - Number(dismissed) < 48 * 3600 * 1000) {
        return;
      }
      setTimeout(() => {
        if (!checkStandalone()) {
          setShowPrompt(true);
        }
      }, delayMs);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('faktelio_cookie_decision', handleCookieDecision);
    };
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install error:', err);
        setShowInstructionsModal(true);
      }
    } else {
      // Native prompt not directly available (e.g., iOS Safari or non-Chromium browser)
      // Open device-specific guidance modal
      setShowInstructionsModal(true);
    }
  };

  if (isStandalone || !showPrompt) {
    return (
      <>
        {showInstructionsModal && (
          <InstructionsModal
            isIOS={isIOS}
            onClose={() => setShowInstructionsModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* ==============================================================
          PWA INVITATION FLOATING BANNER (OCEANIC GREEN DESIGN)
         ============================================================== */}
      <div
        role="dialog"
        aria-label="Invitation d'installation de FAKTELIO"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-45 animate-fade-in-up"
      >
        <div className="bg-[#F7FAF8]/95 backdrop-blur-2xl border border-[rgba(169,189,188,0.6)] shadow-[0_20px_50px_rgba(13,43,33,0.18)] rounded-3xl p-5 text-[#10241D] relative overflow-hidden">
          {/* Subtle gradient accent bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#215C46] via-[#3F7A65] to-[#A9BDBC]" />

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#215C46] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Download className="w-5 h-5 text-[#D9E7E3]" />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <h3 className="text-sm font-extrabold text-[#10241D] leading-snug">
                Installer FAKTELIO sur votre appareil
              </h3>
              <p className="text-xs text-[#4A635A] mt-1 leading-relaxed">
                Accédez plus rapidement à FAKTELIO depuis votre téléphone ou votre ordinateur.
              </p>
            </div>

            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              aria-label="Fermer l'invitation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-[#D9E7E3]/60 flex items-center justify-end gap-2.5">
            <button
              onClick={handleDismiss}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#4A635A] hover:text-[#10241D] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Plus tard
            </button>

            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-xs font-extrabold shadow-[0_4px_14px_rgba(33,92,70,0.28)] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D9E7E3]" />
              Installer
            </button>
          </div>
        </div>
      </div>

      {showInstructionsModal && (
        <InstructionsModal
          isIOS={isIOS}
          onClose={() => setShowInstructionsModal(false)}
        />
      )}
    </>
  );
}

function InstructionsModal({
  isIOS,
  onClose,
}: {
  isIOS: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0D2B21]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#D9E7E3] p-6 text-[#10241D] my-auto animate-scale-in">
        <div className="flex items-center justify-between pb-4 border-b border-[#D9E7E3]/70 mb-4">
          <div className="flex items-center gap-2.5">
            <FaktelioLogo size="sm" />
            <h3 className="text-base font-extrabold text-[#10241D]">
              Installer l&apos;application FAKTELIO
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#4A635A]">
              Sur iPhone &amp; iPad (Safari), l&apos;installation s&apos;effectue en 3 étapes simples :
            </p>

            <ol className="space-y-3 text-xs sm:text-sm text-[#10241D]">
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <span className="w-6 h-6 rounded-full bg-[#215C46] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>
                  Appuyez sur le bouton <strong>Partager</strong>{' '}
                  <Share2 className="w-4 h-4 inline-block text-[#215C46] mx-1 align-sub" /> (icône en bas de Safari).
                </span>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <span className="w-6 h-6 rounded-full bg-[#215C46] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                  Faites défiler le menu et sélectionnez{' '}
                  <strong className="text-[#215C46]">Sur l&apos;écran d&apos;accueil</strong>{' '}
                  <PlusSquare className="w-4 h-4 inline-block text-[#215C46] mx-1 align-sub" />.
                </span>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <span className="w-6 h-6 rounded-full bg-[#215C46] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>
                  Appuyez sur <strong>Ajouter</strong> en haut à droite. FAKTELIO s&apos;ouvrira alors en plein écran comme une application native.
                </span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#4A635A]">
              Pour installer FAKTELIO sur votre téléphone ou votre ordinateur :
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <div className="flex items-center gap-2 font-bold text-[#10241D] mb-1">
                  <Smartphone className="w-4 h-4 text-[#215C46]" />
                  Sur Android (Chrome / Samsung) :
                </div>
                <p className="text-xs text-[#4A635A]">
                  Ouvrez le menu navigateur (les 3 points verticaux <strong>⋮</strong>) et cliquez sur <strong>« Installer l&apos;application »</strong> ou <strong>« Ajouter à l&apos;écran d&apos;accueil »</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <div className="flex items-center gap-2 font-bold text-[#10241D] mb-1">
                  <Monitor className="w-4 h-4 text-[#215C46]" />
                  Sur ordinateur (Chrome, Edge, Brave) :
                </div>
                <p className="text-xs text-[#4A635A]">
                  Cliquez sur l&apos;icône <strong>Installer</strong> <Download className="w-3.5 h-3.5 inline-block text-[#215C46]" /> située à droite dans la barre d&apos;adresse de votre navigateur.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#D9E7E3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            J&apos;ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
