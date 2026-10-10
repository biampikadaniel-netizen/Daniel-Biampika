import React, { useState, useEffect } from 'react';

/**
 * The exact 30 concepts requested by the user, formatted into natural,
 * grammatically flawless French phrases that follow "Créez vos devis et factures".
 */
export const HERO_DYNAMIC_ITEMS = [
  'en quelques secondes.',
  'en quelques clics.',
  'en un instant.',
  'en toute simplicité.',
  'en toute sécurité.',
  'en quelques étapes.',
  'en toute rapidité.',
  'en toute efficacité.',
  'depuis votre téléphone.',
  'depuis votre ordinateur.',
  'pour votre activité.',
  'pour tous vos clients.',
  'et suivez vos devis.',
  'et gérez vos factures.',
  'et encaissez vos paiements.',
  'pour votre trésorerie.',
  'pour votre gestion.',
  'pour votre entreprise.',
  'pour votre commerce.',
  'pour votre activité freelance.',
  'dans votre quotidien.',
  'pour votre organisation.',
  'pour votre productivité.',
  'pour votre gestion commerciale.',
  'pour vos opérations.',
  'pour votre suivi client.',
  'pour vos revenus.',
  'pour vos transactions.',
  'pour votre business.',
  'pour votre croissance.',
];

export function DynamicHeroText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'entering' | 'visible' | 'exiting'>('visible');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    // Dynamic rotation: 2 seconds per item
    const timer = setInterval(() => {
      if (mediaQuery.matches) {
        setCurrentIndex((prev) => (prev + 1) % HERO_DYNAMIC_ITEMS.length);
        return;
      }

      // 1. Trigger graceful exit (550ms)
      setPhase('exiting');

      setTimeout(() => {
        // 2. Switch text item
        setCurrentIndex((prev) => (prev + 1) % HERO_DYNAMIC_ITEMS.length);
        setPhase('entering');

        // 3. Trigger entry transition to visible
        requestAnimationFrame(() => {
          setPhase('visible');
        });
      }, 550);
    }, 2000);

    return () => {
      clearInterval(timer);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const currentItem = HERO_DYNAMIC_ITEMS[currentIndex];

  // Dynamic styling following the exact parameters:
  // opacity: 0 -> 1, translateY(10px) -> translateY(0), exit opacity: 1 -> 0, translateY(0) -> translateY(-8px)
  const getInlineStyles = (): React.CSSProperties => {
    if (reducedMotion) {
      return { opacity: 1, transform: 'none' };
    }

    if (phase === 'entering') {
      return {
        opacity: 0,
        transform: 'translateY(10px)',
        transition: 'none',
      };
    }

    if (phase === 'visible') {
      return {
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }

    // phase === 'exiting'
    return {
      opacity: 0,
      transform: 'translateY(-8px)',
      transition: 'opacity 550ms cubic-bezier(0.4, 0, 0.2, 1), transform 550ms cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  return (
    <span
      className="inline-block relative min-h-[1.25em] align-baseline overflow-visible"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        style={getInlineStyles()}
        className="inline-block bg-gradient-to-r from-[#215C46] via-[#2F7358] to-[#123A2C] bg-clip-text text-transparent pb-1 will-change-[opacity,transform]"
      >
        {currentItem}
      </span>
    </span>
  );
}
