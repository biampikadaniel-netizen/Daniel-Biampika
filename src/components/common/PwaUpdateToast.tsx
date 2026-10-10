import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export function PwaUpdateToast() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let refreshing = false;
    // Reload once when the active controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;

      // Check if there is already a waiting worker
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShowUpdate(true);
      }

      // Detect new worker being installed
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(newWorker);
            setShowUpdate(true);
          }
        });
      });

      // Periodically check for updates when user returns to tab
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          reg.update().catch(() => {});
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    });
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  if (!showUpdate) return null;

  return (
    <aside
      aria-label="Mise à jour de l'application disponible"
      role="region"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE5DE] shadow-[0_16px_40px_rgba(16,75,56,0.18)] flex items-start gap-3.5 relative overflow-hidden">
        {/* Subtle decorative green bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#176B4D] via-[#2E8B57] to-[#104B38]" />

        <div className="w-10 h-10 rounded-xl bg-[#E8F3ED] text-[#176B4D] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5 text-[#2E8B57]" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#E8F3ED] text-[#176B4D] border border-[#DCE5DE]">
              Mise à jour
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#17231D] leading-snug">
            Une nouvelle version de FAKTELIO est disponible
          </h4>
          <p className="text-[11px] sm:text-xs text-[#65736B] mt-0.5 mb-3 leading-relaxed">
            Actualisez pour afficher immédiatement la nouvelle identité visuelle et les améliorations.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#176B4D] hover:bg-[#104B38] text-white text-xs font-bold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Mise à jour...' : 'Mettre à jour'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUpdate(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#65736B] hover:text-[#17231D] hover:bg-[#F7F9F7] transition-colors cursor-pointer"
            >
              Plus tard
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUpdate(false)}
          className="absolute top-3 right-3 p-1 rounded-lg text-[#65736B] hover:text-[#17231D] hover:bg-[#F7F9F7] transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
