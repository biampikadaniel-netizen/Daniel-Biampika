import React, { useEffect, useRef, useState } from 'react';
import { Zap, Globe, FolderCheck, Sparkles } from 'lucide-react';

interface StatCardProps {
  prefix?: string;
  targetValue: number;
  suffix: string;
  displayOverride?: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
}

function AnimatedStatCard({
  prefix = '',
  targetValue,
  suffix,
  displayOverride,
  label,
  sublabel,
  icon: Icon,
  visible,
}: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(targetValue);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * targetValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [visible, targetValue]);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-[0_6px_24px_-6px_rgba(16,24,40,0.05)] hover:shadow-[0_14px_30px_-8px_rgba(30,79,145,0.12)] hover:-translate-y-1 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-[#1E4F91]/8 text-[#1E4F91] group-hover:bg-[#F47B20] group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl sm:text-4xl font-extrabold text-[#1E4F91] tracking-tight mb-1.5">
        {displayOverride ? (
          <span>{visible ? displayOverride : '0'}</span>
        ) : (
          <span>
            {prefix}
            {count}
            {suffix}
          </span>
        )}
      </div>
      <p className="text-base font-bold text-[#101828]">{label}</p>
      <p className="text-xs text-[#526581] mt-1 leading-relaxed">{sublabel}</p>
    </div>
  );
}

export function Stats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-20 bg-[#F5F7FA] border-y border-[#E2E8F0]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#1E4F91]/10 text-[#1E4F91] text-xs font-extrabold uppercase tracking-wider mb-3">
            Performance &amp; Simplicité FAKTELIO
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101828] tracking-tight">
            Tout ce dont vous avez besoin pour gérer votre activité
          </h2>
          <p className="text-sm sm:text-base text-[#526581] mt-3">
            Une plateforme pensée pour faire gagner du temps aux dirigeants, commerçants et équipes commerciales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedStatCard
            prefix="+"
            targetValue={30}
            suffix=" sec"
            label="Création rapide d'une facture"
            sublabel="Sélectionnez le client, les articles et générez votre PDF en quelques clics."
            icon={Zap}
            visible={visible}
          />
          <AnimatedStatCard
            targetValue={24}
            suffix="/7"
            displayOverride="24/7"
            label="Accès depuis n'importe où"
            sublabel="Disponible en permanence sur téléphone, tablette et ordinateur."
            icon={Globe}
            visible={visible}
          />
          <AnimatedStatCard
            targetValue={100}
            suffix=" %"
            label="Documents centralisés"
            sublabel="Devis, factures, clients, catalogue, paiements et stocks au même endroit."
            icon={FolderCheck}
            visible={visible}
          />
          <AnimatedStatCard
            targetValue={0}
            suffix=" FCFA"
            label="Pour commencer"
            sublabel="Démarrez gratuitement sans carte bancaire et évoluez à votre rythme."
            icon={Sparkles}
            visible={visible}
          />
        </div>
      </div>
    </section>
  );
}
