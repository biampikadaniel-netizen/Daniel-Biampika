import React, { useState, useEffect, useRef } from 'react';
import { Lock, Globe, X } from 'lucide-react';
import { FaktelioLogo } from '../common/FaktelioLogo';

interface FaktelioIntroLoaderProps {
  onComplete?: () => void;
}

export function FaktelioIntroLoader({ onComplete }: FaktelioIntroLoaderProps) {
  // Always render on full page load
  const [shouldRender, setShouldRender] = useState<boolean>(true);

  // 1 = L'ordinateur (0 - 1.1s)
  // 2 = Le navigateur & curseur saisie (1.1s - 2.5s)
  // 3 = L'ouverture avec logo Faktelio (2.5s - 3.7s)
  // 4 = Le message "Bienvenue chez FAKTELIO" (3.7s - 4.7s)
  // 5 = La transition vers le site réel (4.7s - 5.4s+)
  const [scene, setScene] = useState<number>(1);

  const [typedUrl, setTypedUrl] = useState<string>('');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 72, y: 76 });
  const [cursorClicked, setCursorClicked] = useState<boolean>(false);
  const [browserLoading, setBrowserLoading] = useState<boolean>(false);
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const fullUrl = 'faktelio.vercel.app';
  const timeoutsRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const registerTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  // Exit transition after at least 5 full seconds
  const handleFinish = (forceImmediate = false) => {
    const elapsed = Date.now() - startTimeRef.current;
    const minWait = forceImmediate ? 0 : Math.max(0, 5200 - elapsed);

    window.setTimeout(() => {
      clearAllTimeouts();
      setIsExiting(true);

      window.setTimeout(() => {
        setShouldRender(false);
        onComplete?.();
      }, 500);
    }, minWait);
  };

  // Skip on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearAllTimeouts();
        setIsExiting(true);
        window.setTimeout(() => {
          setShouldRender(false);
          onComplete?.();
        }, 350);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  // Reduced motion preference check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Listen for manual replay event from footer or menu
  useEffect(() => {
    const handleReplay = () => {
      clearAllTimeouts();
      startTimeRef.current = Date.now();
      setIsExiting(false);
      setIsZooming(false);
      setTypedUrl('');
      setCursorClicked(false);
      setBrowserLoading(false);
      setCursorPos({ x: 72, y: 76 });
      setScene(1);
      setShouldRender(true);
    };
    window.addEventListener('faktelio_replay_intro', handleReplay);
    return () => window.removeEventListener('faktelio_replay_intro', handleReplay);
  }, []);

  // Preload essential hero images in parallel
  useEffect(() => {
    const preloadImg1 = new Image();
    preloadImg1.src = '/images/hero_entrepreneur.jpg';
    const preloadImg2 = new Image();
    preloadImg2.src = '/images/laptop_intro.jpg';
  }, []);

  // Main 5-scene cinematic timeline (total visible duration: >= 5.3 seconds)
  useEffect(() => {
    if (!shouldRender) return;

    if (reducedMotion) {
      // Accessible simplified version still respecting the 5-second minimum
      registerTimeout(() => {
        setScene(4);
      }, 1500);
      registerTimeout(() => {
        handleFinish(false);
      }, 5000);
      return () => clearAllTimeouts();
    }

    // SCÈNE 1 — L'ORDINATEUR (0ms - 1100ms)
    // Ordinateur photoréaliste apparaît dans environnement vert profond
    setScene(1);

    // SCÈNE 2 — LE NAVIGATEUR ET LA SOURIS (1100ms - 2500ms)
    // Curseur se déplace vers barre d'adresse, clique et saisit "faktelio.vercel.app"
    registerTimeout(() => {
      setScene(2);

      // Le curseur glisse naturellement vers la barre d'adresse
      registerTimeout(() => {
        setCursorPos({ x: 50, y: 14 });
      }, 80);

      // Clic dans la barre d'adresse
      registerTimeout(() => {
        setCursorClicked(true);
      }, 350);

      // Saisie progressive et naturelle de l'URL
      registerTimeout(() => {
        let charIndex = 0;
        const typeInterval = window.setInterval(() => {
          charIndex++;
          setTypedUrl(fullUrl.slice(0, charIndex));
          if (charIndex >= fullUrl.length) {
            clearInterval(typeInterval);

            // Validation de l'adresse et chargement
            registerTimeout(() => {
              setBrowserLoading(true);
            }, 80);
          }
        }, 38);
      }, 500);
    }, 1100);

    // SCÈNE 3 — L'OUVERTURE DE FAKTELIO (2500ms - 3700ms)
    // Le logo réel de Faktelio apparaît sur l'écran avec lumière douce et reflet menthe
    registerTimeout(() => {
      setScene(3);
    }, 2500);

    // SCÈNE 4 — LE MESSAGE DE BIENVENUE (3700ms - 4700ms)
    // Affichage élégant de « Bienvenue chez FAKTELIO »
    registerTimeout(() => {
      setScene(4);
    }, 3700);

    // SCÈNE 5 — LA TRANSITION (4700ms - 5400ms+)
    // L'écran se transforme vers l'interface de Faktelio, zoom fluide et révélation du vrai site
    registerTimeout(() => {
      setScene(5);
      registerTimeout(() => {
        setIsZooming(true);
      }, 200);

      // Fin de la transition à 5300ms (dépasse les 5 secondes complètes demandées)
      registerTimeout(() => {
        handleFinish(false);
      }, 650);
    }, 4700);

    return () => {
      clearAllTimeouts();
    };
  }, [shouldRender, reducedMotion]);

  if (!shouldRender) {
    return null;
  }

  // Composant réutilisable pour le contenu interactif de l'écran d'ordinateur
  const renderScreenContent = (isCompact: boolean) => (
    <div
      className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out ${
        scene >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0E2920 0%, #091D16 100%)',
      }}
    >
      {/* Barre de navigation du navigateur moderne */}
      <div className="relative shrink-0 h-7 sm:h-8 md:h-9 bg-[#123A2C]/95 border-b border-[#215C46]/50 flex items-center px-2 sm:px-3 gap-1.5 sm:gap-2 select-none">
        {/* Boutons fenêtre macOS */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#EF4444]/80 shadow-xs" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#D9E7E3]/80 shadow-xs" />
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#10B981]/90 shadow-xs" />
        </div>

        {/* Onglet actif (affiché à partir de tablet ou quand non-compact) */}
        <div className="hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-t bg-[#0D2B21] border-t border-x border-[#215C46]/50 text-[9px] sm:text-[10px] text-[#D9E7E3] font-medium max-w-[120px] truncate shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#215C46]" />
          <span className="truncate">FAKTELIO</span>
        </div>

        {/* Barre d'adresse URL */}
        <div
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-mono tracking-tight transition-all duration-200 border truncate ${
            cursorClicked
              ? 'bg-[#091D16] border-[#A9BDBC]/80 shadow-[0_0_12px_rgba(169,189,188,0.35)] text-[#F7FAF8]'
              : 'bg-[#091D16]/80 border-[#215C46]/40 text-[#A9BDBC]/80'
          }`}
        >
          <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#10B981] shrink-0" />
          <span className="text-[#A9BDBC]/60 hidden sm:inline text-[10px]">https://</span>
          <span className="font-semibold text-white tracking-normal truncate">
            {typedUrl || (scene < 2 ? '' : ' ')}
          </span>
          {scene === 2 && !browserLoading && (
            <span className="w-1 h-3 bg-[#A9BDBC] animate-pulse ml-0.5 inline-block shrink-0" />
          )}
        </div>

        {/* Barre de chargement fluide */}
        {browserLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#215C46] via-[#A9BDBC] to-white animate-[progress_0.6s_ease-in-out_forwards]" />
          </div>
        )}
      </div>

      {/* ==============================================================
          CONTENU DE L'ÉCRAN (Évolution Scènes 2, 3, 4 et 5)
         ============================================================== */}
      <div className="relative flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-4">
        {/* Fond d'écran à grille subtile */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(169, 189, 188, 0.4) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* SCÈNE 2 : Chargement initial */}
        {scene === 2 && !browserLoading && (
          <div className="text-center opacity-70 animate-fadeIn">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-[#A9BDBC] animate-pulse mb-1.5" />
            <p className="text-[10px] sm:text-xs text-[#D9E7E3] font-mono">Connexion à Faktelio...</p>
          </div>
        )}

        {/* SCÈNE 3 : Apparition du logo FAKTELIO avec halo vert menthe */}
        {scene === 3 && (
          <div className="relative z-10 flex flex-col items-center justify-center text-center animate-fadeIn w-full px-2">
            {/* Halo lumineux */}
            <div className="absolute w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-[#215C46]/50 blur-2xl pointer-events-none" />

            {/* Logo FAKTELIO adapté à la taille de l'écran */}
            <div className="relative mb-2 sm:mb-3 transform transition-transform duration-700 scale-95 sm:scale-100">
              <FaktelioLogo size={isCompact ? 'md' : 'lg'} variant="white" />
            </div>

            {/* Reflet lumineux traversant doucement l'écran */}
            <div className="absolute -inset-x-8 top-1/2 -translate-y-1/2 h-6 bg-gradient-to-r from-transparent via-[#A9BDBC]/25 to-transparent blur-md pointer-events-none -rotate-12 animate-float" />

            <p className="text-[9px] sm:text-xs text-[#A9BDBC] font-semibold tracking-wider uppercase mt-1">
              Initialisation de votre plateforme
            </p>
          </div>
        )}

        {/* SCÈNE 4 : Message de bienvenue « Bienvenue chez FAKTELIO » */}
        {scene === 4 && (
          <div className="relative z-10 flex flex-col items-center justify-center text-center animate-fadeIn w-full max-w-sm px-3">
            {/* Halo vert émeraude */}
            <div className="absolute w-36 h-36 sm:w-52 sm:h-52 rounded-full bg-[#215C46]/45 blur-2xl pointer-events-none" />

            {/* Logo compact */}
            <div className="relative mb-1.5 sm:mb-2">
              <FaktelioLogo size={isCompact ? 'sm' : 'md'} variant="white" />
            </div>

            {/* Message exact demandé */}
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
              Bienvenue chez <span className="text-[#A9BDBC]">FAKTELIO</span>
            </h2>

            <p className="text-[9px] sm:text-[11px] md:text-xs text-[#D9E7E3]/90 font-medium mt-1 sm:mt-1.5 max-w-[280px] sm:max-w-[340px] leading-relaxed">
              Facturation, devis et gestion commerciale pour entrepreneurs et PME
            </p>
          </div>
        )}

        {/* SCÈNE 5 : Transition vers l'interface FAKTELIO */}
        {scene === 5 && (
          <div className="relative z-10 w-full h-full flex flex-col justify-between py-1 sm:py-2 px-1.5 sm:px-3 animate-fadeIn">
            {/* Mini barre d'en-tête */}
            <div className="flex items-center justify-between border-b border-[#215C46]/40 pb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[#215C46] flex items-center justify-center text-[8px] font-bold text-white">
                  F
                </div>
                <span className="text-[10px] font-bold text-white tracking-tight">FAKTELIO</span>
              </div>
              <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-[#D9E7E3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Espace Prêt</span>
              </div>
            </div>

            {/* Mini cartes de gestion */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2 my-auto">
              <div className="p-1 sm:p-2 rounded bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="text-[7px] sm:text-[8px] text-[#A9BDBC]">Devis &amp; Factures</div>
                <div className="text-[9px] sm:text-[11px] font-bold text-white">Création 1 clic</div>
              </div>
              <div className="p-1 sm:p-2 rounded bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="text-[7px] sm:text-[8px] text-[#A9BDBC]">Encaissements</div>
                <div className="text-[9px] sm:text-[11px] font-bold text-[#10B981]">Wave &amp; Mobile</div>
              </div>
              <div className="p-1 sm:p-2 rounded bg-white/10 backdrop-blur-xs border border-white/10">
                <div className="text-[7px] sm:text-[8px] text-[#A9BDBC]">Relances</div>
                <div className="text-[9px] sm:text-[11px] font-bold text-white">WhatsApp</div>
              </div>
            </div>

            {/* Mini facture de démo */}
            <div className="flex items-center justify-between p-1 sm:p-1.5 rounded bg-[#123A2C]/85 border border-[#215C46]/50 text-[8px] sm:text-[9px]">
              <span className="font-semibold text-white truncate mr-2">FAC-2026-0001 • Ivoire Distribution</span>
              <span className="font-bold text-[#10B981] bg-[#10B981]/20 px-1.5 py-0.5 rounded shrink-0">
                177 000 FCFA
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ==============================================================
          CURSEUR DE SOURIS RÉALISTE
         ============================================================== */}
      {scene === 2 && !browserLoading && (
        <div
          className={`absolute pointer-events-none z-40 transition-all duration-700 ease-out will-change-transform ${
            cursorClicked ? 'scale-90' : 'scale-100'
          }`}
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            transform: 'translate(-2px, -2px)',
          }}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 3.5L18.5 13.5L12 14.5L15 20.5L12.5 21.5L9.5 15.5L5.5 18.5V3.5Z"
              fill="#FFFFFF"
              stroke="#10241D"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-label="Introduction Faktelio"
      aria-modal="true"
      className={`fixed inset-0 z-[999999] overflow-hidden flex items-center justify-center select-none transition-opacity duration-600 bg-[#071712] p-4 sm:p-6 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #123A2C 0%, #0D2B21 50%, #071712 95%)',
      }}
    >
      {/* Éclairage Studio & Atmosphère Océanique Faktelio */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft top mint studio spotlight */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] lg:w-[1300px] h-[500px] sm:h-[650px] rounded-full opacity-35 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(169,189,188,0.32) 0%, rgba(33,92,70,0.28) 45%, transparent 75%)',
          }}
        />

        {/* Studio glossy floor reflection */}
        <div className="absolute bottom-0 left-0 right-0 h-[44vh] bg-gradient-to-t from-[#071712] via-[#091F18]/85 to-transparent pointer-events-none" />

        {/* Ambient mint rim light */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[92vw] max-w-[1240px] h-[1px] bg-gradient-to-r from-transparent via-[#A9BDBC]/30 to-transparent blur-xs" />
      </div>

      {/* Skip button (discret, élégant, accessible au clic et tactile) */}
      <button
        type="button"
        onClick={() => {
          clearAllTimeouts();
          setIsExiting(true);
          window.setTimeout(() => {
            setShouldRender(false);
            onComplete?.();
          }, 350);
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[1000000] flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-semibold text-[#D9E7E3] hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer active:scale-95 touch-manipulation"
        title="Passer l'introduction (Touche Échap)"
      >
        <span>Passer</span>
        <span className="hidden sm:inline text-[10px] text-[#A9BDBC]/80 px-1 py-0.5 rounded bg-black/30">Échap</span>
        <X className="w-3.5 h-3.5 ml-0.5 opacity-80" />
      </button>

      {/* ==============================================================
          1. VERSION MOBILE & TABLETTE (< 1024px)
          Châssis ultrabook moderne photoréaliste, parfaitement proportionné,
          garantissant 100% de lisibilité sans débordement ni texte microscopique
         ============================================================== */}
      <div
        className={`relative lg:hidden w-[min(92vw,440px)] md:w-[min(88vw,640px)] transition-all duration-800 ease-out will-change-transform ${
          isZooming
            ? 'scale-[1.8] opacity-0 transition-all duration-650 ease-in'
            : scene >= 1
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0'
        }`}
        style={{
          transformOrigin: '50% 45%',
        }}
      >
        {/* Écran & Capot de l'ordinateur portable */}
        <div className="relative w-full aspect-[16/10.5] sm:aspect-[16/10] rounded-t-xl sm:rounded-t-2xl rounded-b-md p-1.5 sm:p-2.5 bg-gradient-to-b from-[#1A3E31] via-[#0E261E] to-[#071712] border border-[#215C46]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(33,92,70,0.25)] flex flex-col">
          {/* Bezel supérieur avec capteur webcam et diode discrète */}
          <div className="relative shrink-0 h-2.5 sm:h-3 flex items-center justify-center -mt-0.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#05130E] border border-white/20 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#10B981]/70" />
            </div>
          </div>

          {/* L'Écran interactif haute-résolution */}
          <div className="relative flex-1 w-full rounded-md sm:rounded-lg overflow-hidden bg-[#0A1D16] shadow-inner border border-white/5">
            {/* Reflet de vitre / bezel */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
            {renderScreenContent(true)}
          </div>
        </div>

        {/* Châssis inférieur / Charnière & Clavier de l'ordinateur */}
        <div className="relative w-[102%] -mx-[1%] h-2.5 sm:h-3.5 rounded-b-xl bg-gradient-to-b from-[#18382D] via-[#0C221A] to-[#06140F] border-t border-[#A9BDBC]/20 border-b border-black/90 shadow-[0_12px_24px_rgba(0,0,0,0.9)] flex items-center justify-center">
          {/* Encoche d'ouverture du capot */}
          <div className="w-12 sm:w-16 h-1 rounded-full bg-[#05130E] border-t border-white/10" />
        </div>

        {/* Reflet d'ambiance sous le châssis */}
        <div className="w-4/5 mx-auto h-4 bg-[#215C46]/25 blur-lg rounded-full -mt-0.5" />
      </div>

      {/* ==============================================================
          2. VERSION ORDINATEUR (>= 1024px)
          Rendu grand écran validé conservé à l'identique avec laptop_intro.jpg
         ============================================================== */}
      <div
        className={`hidden lg:block relative w-[90vw] md:w-[86vw] max-w-[1040px] aspect-[1376/768] transition-all duration-800 ease-out will-change-transform ${
          isZooming
            ? 'scale-[2.4] opacity-0 transition-all duration-650 ease-in'
            : scene >= 1
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0'
        }`}
        style={{
          transformOrigin: '50% 42%',
        }}
      >
        {/* Châssis métallique photoréaliste de l'ordinateur portable */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <img
            src="/images/laptop_intro.jpg"
            alt="Faktelio Ordinateur Portable"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-contain filter drop-shadow-[0_35px_65px_rgba(7,23,18,0.95)] transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Châssis de secours pur CSS si l'image prend un instant */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[72%] h-[68%] rounded-2xl bg-gradient-to-b from-[#1A382E] via-[#0E261E] to-[#071611] border border-[#215C46]/40 shadow-2xl p-3 flex flex-col items-center justify-center">
                <div className="w-full h-full rounded-xl bg-[#091B15] border border-[#A9BDBC]/20 flex items-center justify-center">
                  <FaktelioLogo size="lg" variant="white" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* L'ÉCRAN INTERACTIF DE L'ORDINATEUR (Coordonnées exactes sur l'image 1376x768) */}
        <div
          className="absolute overflow-hidden rounded-[6px] bg-[#0A1D16] shadow-inner"
          style={{
            left: '27.98%',
            top: '17.06%',
            width: '44.02%',
            height: '48.82%',
          }}
        >
          {/* Reflet de vitre / bezel */}
          <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent" />
          {renderScreenContent(false)}
        </div>
      </div>
    </div>
  );
}
