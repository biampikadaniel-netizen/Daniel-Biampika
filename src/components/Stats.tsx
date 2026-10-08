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
    <div className="bg-[rgba(169,189,188,0.08)] backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-[rgba(217,231,227,0.20)] shadow-[0_20px_60px_rgba(13,43,33,0.3)] hover:shadow-[0_24px_70px_rgba(33,92,70,0.35)] hover:-translate-y-1.5 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-[#215C46]/40 text-[#D9E7E3] group-hover:bg-[#215C46] group-hover:text-white flex items-center justify-center mb-4 transition-colors duration-300 border border-[rgba(217,231,227,0.2)]">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl sm:text-4xl font-extrabold text-[#F7FAF8] tracking-tight mb-1.5">
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
      <p className="text-base font-bold text-[#D9E7E3]">{label}</p>
      <p className="text-xs text-[#A9BDBC] mt-1 leading-relaxed">{sublabel}</p>
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
      className="py-16 lg:py-20 bg-[#0D2B21] text-white relative overflow-hidden border-y border-[#123A2C]"
    >
      {/* Subtle Oceanic Glow */}
      <div
        className="pointer-events-none absolute -top-40 right-10 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(33,92,70,0.6) 0%, rgba(169,189,188,0.2) 60%, transparent 80%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#215C46]/50 border border-[#A9BDBC]/30 text-[#D9E7E3] text-xs font-extrabold uppercase tracking-wider mb-3">
            Performance &amp; Simplicité FAKTELIO
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F7FAF8] tracking-tight">
            Tout ce dont vous avez besoin pour gérer votre activité
          </h2>
          <p className="text-sm sm:text-base text-[#A9BDBC] mt-3">
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
