import React, { useRef, useEffect, useState } from 'react';
import {
  Check,
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle2,
  FileText,
  Users,
  Wallet,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { FaktelioLogo } from './common/FaktelioLogo';

export function Hero() {
  const { user, loginDemo } = useAuth();
  const { navigate } = useNavigation();

  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll-driven video sync & micro-animation controller
  useEffect(() => {
    let animationFrameId: number;
    let targetTime = 0;

    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const heroHeight = rect.height;

      // Progress: 0 at top of hero, 1 when hero scrolls past
      const topOffset = rect.top;
      const totalScrollable = heroHeight;
      const rawProgress = -topOffset / (totalScrollable * 0.85);
      const clamped = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clamped);

      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration)) {
        targetTime = clamped * video.duration;
      }
    };

    // Smoothly interpolate currentTime via requestAnimationFrame for zero-lag scrubbing
    const renderLoop = () => {
      const video = videoRef.current;
      if (video && video.duration && !isNaN(video.duration)) {
        // Smooth lerp to target currentTime to prevent stutter
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          try {
            video.currentTime += diff * 0.25;
          } catch {
            // Browser scrubbing fallback
          }
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handlePrimaryAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleDemoAction = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-[#F7FAF8] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#D9E7E3]/60"
    >
      {/* ==============================================================
          SECTION 4 & 5: SCROLL-DRIVEN CINEMATIC OCEANIC VIDEO BACKGROUND
         ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="w-full h-full object-cover opacity-25 filter blur-[1px] transition-opacity duration-700"
        >
          <source src="/videos/hero-oceanic.mp4" type="video/mp4" />
          <source src="/videos/hero-oceanic.webm" type="video/webm" />
        </video>

        {/* Ambient Oceanic Glass & Light Overlays — ensures 100% legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAF8]/90 via-[#F7FAF8]/75 to-[#F7FAF8] pointer-events-none" />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full opacity-40 blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(33,92,70,0.22) 0%, rgba(169,189,188,0.18) 45%, rgba(247,250,248,0) 75%)',
          }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Hero Header Block */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge: scroll progress fade & slight translateY */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(169,189,188,0.18)] border border-[rgba(217,231,227,0.8)] backdrop-blur-md mb-6 shadow-xs transition-transform duration-150"
            style={{
              opacity: Math.max(0.2, 1 - scrollProgress * 0.9),
              transform: `translateY(${-scrollProgress * 12}px)`,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#215C46] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#123A2C]">
              LOGICIEL DE FACTURATION POUR PME, COMMERÇANTS &amp; FREELANCES
            </span>
          </div>

          {/* Main H1 Title: subtle translateY */}
          <h1
            className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-[#10241D] tracking-tight leading-[1.1] mb-6 transition-transform duration-150"
            style={{
              transform: `translateY(${scrollProgress * 10}px)`,
            }}
          >
            Créez vos devis et factures <br className="hidden sm:inline" />
            en{' '}
            <span className="bg-gradient-to-r from-[#215C46] via-[#2F7358] to-[#123A2C] bg-clip-text text-transparent">
              quelques secondes.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-[#4A635A] max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Faktelio simplifie votre facturation, vos clients, vos paiements et votre gestion
            commerciale depuis votre téléphone ou votre ordinateur.
          </p>

          {/* CTA Buttons: subtle scroll-driven response */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-7 transition-transform duration-150"
            style={{
              transform: `translateY(${-scrollProgress * 6}px)`,
            }}
          >
            <button
              onClick={handlePrimaryAction}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] rounded-xl shadow-[0_10px_30px_rgba(33,92,70,0.32)] hover:shadow-[0_14px_36px_rgba(33,92,70,0.42)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-250 cursor-pointer group"
            >
              {user ? 'Accéder à mon Dashboard →' : 'Créer mon compte gratuitement →'}
              <ArrowRight className="w-4 h-4 text-[#D9E7E3] transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <a
              href="#fonctionnalites"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-[#10241D] bg-white/90 hover:bg-white border border-[#D9E7E3] hover:border-[#215C46] rounded-xl shadow-xs transition-all duration-200 hover:-translate-y-0.5"
            >
              Voir les fonctionnalités
            </a>
          </div>

          {/* Reassurance Checks under Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#4A635A] mb-8">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#215C46] stroke-[2.5]" />
              Sans carte bancaire
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#215C46] stroke-[2.5]" />
              Démarrage gratuit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#215C46] stroke-[2.5]" />
              Accessible partout
            </span>
          </div>

          {/* Visual Social Proof with Oceanic Glass styling */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-[rgba(217,231,227,0.6)] shadow-xs mb-12">
            <div className="flex -space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#215C46] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                KD
              </div>
              <div className="w-8 h-8 rounded-full bg-[#123A2C] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                AT
              </div>
              <div className="w-8 h-8 rounded-full bg-[#3F7A65] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                MK
              </div>
              <div className="w-8 h-8 rounded-full bg-[#A9BDBC] text-[#0D2B21] text-xs font-bold flex items-center justify-center ring-2 ring-white">
                CN
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-[#215C46]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#10241D]">4.9/5</span>
              <span className="text-xs text-[#4A635A]">
                • Adopté par <strong className="text-[#10241D]">+2 500 PME &amp; entrepreneurs</strong>
              </span>
            </div>
            <button
              onClick={handleDemoAction}
              className="text-xs font-bold text-[#215C46] hover:text-[#123A2C] underline underline-offset-2 cursor-pointer transition-colors"
            >
              Tester la démo en 1 clic
            </button>
          </div>
        </div>

        {/* ==============================================================
            SECTION 6 : MOCKUP SAAS AVEC ZOOM PROGRESSIF (1 -> 1.05)
            ET PARALLAX LÉGER DES ÉLÉMENTS GLASS
           ============================================================== */}
        <div
          className="relative max-w-[1140px] mx-auto pt-2 pb-10 sm:pb-16 transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${1 + scrollProgress * 0.04})`,
          }}
        >
          {/* Ambient Oceanic Backlight behind Laptop */}
          <div className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-[#215C46]/20 via-[#123A2C]/10 to-[#A9BDBC]/20 rounded-[36px] blur-2xl opacity-75" />

          {/* LAPTOP CHASSIS */}
          <div className="relative mx-auto max-w-[980px] z-10">
            {/* Laptop Screen Frame (Bezel) */}
            <div className="bg-[#0D2B21] rounded-t-[24px] sm:rounded-t-[30px] p-2.5 sm:p-4 pb-3 sm:pb-4 shadow-[0_30px_80px_rgba(13,43,33,0.35)] border-[2px] border-[#123A2C]">
              {/* Top Camera Notch */}
              <div className="flex items-center justify-center mb-2">
                <div className="w-16 h-1.5 rounded-full bg-[#123A2C] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A9BDBC]/70" />
                </div>
              </div>

              {/* Screen Viewport — Real FAKTELIO Oceanic Dashboard */}
              <div className="bg-[#F7FAF8] rounded-[14px] sm:rounded-[18px] overflow-hidden border border-[#D9E7E3] text-left">
                {/* Browser / App Top Bar */}
                <div className="bg-white border-b border-[#D9E7E3] px-3 sm:px-5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#215C46]" />
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-[#F7FAF8] border border-[#D9E7E3] rounded-lg px-3 py-1 text-[11px] font-medium text-[#4A635A]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#215C46]" />
                      <span>https://app.faktelio.com/dashboard</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D9E7E3] text-[#123A2C]">
                      ● Synchronisé Cloud 24/7
                    </span>
                    <button
                      onClick={handleDemoAction}
                      className="px-2.5 py-1 rounded-md bg-[#215C46] text-white text-[10px] font-bold hover:bg-[#3F7A65] transition-colors cursor-pointer"
                    >
                      Ouvrir en plein écran →
                    </button>
                  </div>
                </div>

                {/* App Body inside Laptop Screen */}
                <div className="grid grid-cols-12 min-h-[380px] sm:min-h-[450px]">
                  {/* Left Sidebar inside Mockup */}
                  <div className="hidden md:flex md:col-span-3 lg:col-span-2 bg-[#123A2C] text-white p-3.5 flex-col justify-between">
                    <div>
                      <div className="pb-3 mb-3 border-b border-[#A9BDBC]/20">
                        <FaktelioLogo variant="white" size="sm" />
                      </div>
                      <div className="space-y-1 text-[11px] font-semibold">
                        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#215C46] text-white shadow-xs">
                          <TrendingUp className="w-3.5 h-3.5 text-[#D9E7E3]" />
                          <span>Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80 hover:text-white">
                          <Users className="w-3.5 h-3.5 text-[#A9BDBC]" />
                          <span>Clients &amp; CRM</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80 hover:text-white">
                          <FileText className="w-3.5 h-3.5 text-[#A9BDBC]" />
                          <span>Facturation</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80 hover:text-white">
                          <FileText className="w-3.5 h-3.5 text-[#A9BDBC]" />
                          <span>Devis &amp; Factures</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80 hover:text-white">
                          <Wallet className="w-3.5 h-3.5 text-[#A9BDBC]" />
                          <span>Paiements</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80 hover:text-white">
                          <MessageCircle className="w-3.5 h-3.5 text-[#A9BDBC]" />
                          <span>Relances WhatsApp</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-[10px]">
                      <p className="font-bold text-white">FAKTELIO PRO</p>
                      <p className="text-[#A9BDBC] mt-0.5">Facturation &amp; Stock actifs</p>
                    </div>
                  </div>

                  {/* Main Dashboard Canvas inside Laptop */}
                  <div className="col-span-12 md:col-span-9 lg:col-span-10 p-4 sm:p-5 space-y-4 bg-[#F7FAF8]">
                    {/* Top Greeting Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 p-3.5 rounded-xl border border-[#D9E7E3] shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="md:hidden">
                            <FaktelioLogo size="sm" />
                          </span>
                          <p className="text-xs sm:text-sm font-extrabold text-[#10241D]">
                            Bonjour, Kouadio 👋 — Espace FAKTELIO
                          </p>
                        </div>
                        <p className="text-[11px] text-[#4A635A]">
                          Voici un aperçu en temps réel de votre activité commerciale.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#215C46]/10 text-[#215C46] text-[11px] font-bold">
                          + Nouveau Devis
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-[#215C46] text-white text-[11px] font-bold shadow-xs">
                          + Nouvelle Facture
                        </span>
                      </div>
                    </div>

                    {/* KPI Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white/90 p-3 rounded-xl border border-[#D9E7E3] shadow-xs">
                        <p className="text-[10px] font-bold uppercase text-[#4A635A]">
                          Chiffre d&apos;affaires
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#10241D] mt-1">
                          4 702 300 FCFA
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#215C46]">
                          +24.8% ce mois
                        </span>
                      </div>
                      <div className="bg-white/90 p-3 rounded-xl border border-[#D9E7E3] shadow-xs">
                        <p className="text-[10px] font-bold uppercase text-[#4A635A]">
                          Montant encaissé
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#215C46] mt-1">
                          2 907 200 FCFA
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#4A635A]">
                          Wave • OM • Banque
                        </span>
                      </div>
                      <div className="bg-white/90 p-3 rounded-xl border border-[#D9E7E3] shadow-xs">
                        <p className="text-[10px] font-bold uppercase text-[#4A635A]">
                          Montant en attente
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#3F7A65] mt-1">
                          1 795 100 FCFA
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#123A2C]">
                          3 factures à suivre
                        </span>
                      </div>
                      <div className="bg-white/90 p-3 rounded-xl border border-[#D9E7E3] shadow-xs">
                        <p className="text-[10px] font-bold uppercase text-[#4A635A]">
                          Clients &amp; Factures
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#123A2C] mt-1">
                          48 Factures • 19 Clients
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#215C46]">
                          100% centralisé
                        </span>
                      </div>
                    </div>

                    {/* Chart & Recent Invoices inside Screen */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                      {/* Monthly Revenue Bar Chart */}
                      <div className="lg:col-span-5 bg-white p-3.5 rounded-xl border border-[#D9E7E3]">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-[#10241D]">
                            Chiffre d&apos;affaires mensuel
                          </p>
                          <span className="text-[10px] font-bold text-[#215C46] bg-[#215C46]/10 px-2 py-0.5 rounded">
                            2026
                          </span>
                        </div>
                        <div className="flex items-end justify-between gap-2 h-28 pt-4 px-1">
                          {[
                            { m: 'Avr', h: '45%', c: 'bg-[#A9BDBC]/60' },
                            { m: 'Mai', h: '60%', c: 'bg-[#A9BDBC]' },
                            { m: 'Juin', h: '52%', c: 'bg-[#3F7A65]/70' },
                            { m: 'Juil', h: '75%', c: 'bg-[#3F7A65]' },
                            { m: 'Août', h: '86%', c: 'bg-[#215C46]' },
                            { m: 'Sept', h: '100%', c: 'bg-[#123A2C]' },
                          ].map((bar) => (
                            <div key={bar.m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div
                                className={`w-full rounded-t-md ${bar.c} transition-all duration-500`}
                                style={{ height: bar.h }}
                              />
                              <span className="text-[9px] font-bold text-[#4A635A]">{bar.m}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Invoices Table inside Screen */}
                      <div className="lg:col-span-7 bg-white p-3.5 rounded-xl border border-[#D9E7E3]">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-xs font-bold text-[#10241D]">Factures récentes FAKTELIO</p>
                          <span className="text-[10px] font-semibold text-[#215C46]">Tout voir →</span>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#F7FAF8]">
                            <div>
                              <span className="font-bold text-[#10241D]">FAC-2026-001</span>
                              <span className="text-[#4A635A] ml-2">Groupe Ivoire Distribution</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#10241D]">1 522 200 FCFA</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#D9E7E3] text-[#123A2C]">
                                PAYÉ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#F7FAF8]">
                            <div>
                              <span className="font-bold text-[#10241D]">FAC-2026-002</span>
                              <span className="text-[#4A635A] ml-2">Cabinet Horizon Conseil</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#10241D]">885 000 FCFA</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#D9E7E3] text-[#123A2C]">
                                PAYÉ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#F7FAF8]">
                            <div>
                              <span className="font-bold text-[#10241D]">FAC-2026-003</span>
                              <span className="text-[#4A635A] ml-2">BTP &amp; Résidences Lagune</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#10241D]">1 091 500 FCFA</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FEF3C7] text-[#92400E]">
                                PARTIEL
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Metallic Base / Keyboard Deck Lip */}
            <div className="relative mx-auto w-[104%] -left-[2%] h-4 sm:h-5 bg-gradient-to-b from-[#A9BDBC] via-[#7E968E] to-[#4A635A] rounded-b-2xl shadow-[0_22px_50px_rgba(13,43,33,0.30)] flex items-start justify-center">
              <div className="w-24 sm:w-32 h-1.5 bg-[#123A2C] rounded-b-lg" />
            </div>
          </div>

          {/* ==============================================================
              FLOATING FOREGROUND INVOICE 1 (LEFT / FRONT) — GLASSMORPHISM PARALLAX
             ============================================================== */}
          <div
            className="mt-6 lg:mt-0 lg:absolute lg:-bottom-6 lg:-left-4 xl:-left-8 z-20 w-full sm:w-[360px] mx-auto bg-white/95 backdrop-blur-xl rounded-2xl border border-[rgba(217,231,227,0.8)] shadow-[0_20px_60px_rgba(13,43,33,0.18)] p-4 sm:p-5 text-left transition-transform duration-150"
            style={{
              transform: `translateY(${-scrollProgress * 22}px)`,
            }}
          >
            {/* Invoice Header */}
            <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#D9E7E3]">
              <div>
                <FaktelioLogo size="sm" />
                <p className="text-[10px] text-[#4A635A] mt-1">
                  Entreprise Kouassi &amp; Associés • Abidjan
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D9E7E3] text-[#123A2C]">
                  FACTURE PAYÉE
                </span>
                <p className="text-xs font-extrabold text-[#215C46] mt-1">N° FAC-2026-048</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex items-center justify-between text-[11px] bg-[#F7FAF8] rounded-xl p-2.5 mb-3 border border-[#D9E7E3]/60">
              <div>
                <p className="text-[9px] font-bold uppercase text-[#4A635A]">Facturé à</p>
                <p className="font-bold text-[#10241D]">Groupe Ivoire Distribution SARL</p>
                <p className="text-[10px] text-[#4A635A]">Cocody Riviera, Abidjan • +225 07 07 88 99 11</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#215C46] shrink-0" />
            </div>

            {/* Products Table on Floating Invoice */}
            <div className="space-y-1.5 text-[11px] mb-3">
              <div className="grid grid-cols-12 text-[9px] font-bold uppercase text-[#4A635A] pb-1 border-b border-[#D9E7E3]">
                <span className="col-span-6">Désignation</span>
                <span className="col-span-2 text-center">Qté</span>
                <span className="col-span-4 text-right">Total HT</span>
              </div>
              <div className="grid grid-cols-12 items-center py-1">
                <span className="col-span-6 font-semibold text-[#10241D] truncate">
                  Terminal POS Tactile Pro
                </span>
                <span className="col-span-2 text-center text-[#4A635A]">2</span>
                <span className="col-span-4 text-right font-bold text-[#10241D]">570 000 FCFA</span>
              </div>
              <div className="grid grid-cols-12 items-center py-1 border-t border-[#F7FAF8]">
                <span className="col-span-6 font-semibold text-[#10241D] truncate">
                  Déploiement &amp; Support Cloud
                </span>
                <span className="col-span-2 text-center text-[#4A635A]">1</span>
                <span className="col-span-4 text-right font-bold text-[#10241D]">150 000 FCFA</span>
              </div>
            </div>

            {/* Totals & Payment Conditions */}
            <div className="pt-2.5 border-t border-[#D9E7E3] space-y-1 text-[11px]">
              <div className="flex justify-between text-[#4A635A]">
                <span>Sous-total HT :</span>
                <span className="font-semibold text-[#10241D]">720 000 FCFA</span>
              </div>
              <div className="flex justify-between text-[#4A635A]">
                <span>TVA (18%) :</span>
                <span className="font-semibold text-[#10241D]">129 600 FCFA</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-[#D9E7E3]">
                <span className="font-extrabold text-[#123A2C]">TOTAL TTC :</span>
                <span className="text-sm font-extrabold text-[#215C46]">849 600 FCFA</span>
              </div>
              <p className="text-[9px] text-[#4A635A] pt-1">
                Conditions : Paiement Mobile Money (Wave / Orange Money) ou virement sous 15j.
              </p>
            </div>
          </div>

          {/* ==============================================================
              FLOATING FOREGROUND INVOICE 2 (RIGHT / FRONT) — GLASSMORPHISM PARALLAX
             ============================================================== */}
          <div
            className="mt-4 lg:mt-0 lg:absolute lg:-bottom-4 lg:-right-4 xl:-right-8 z-20 w-full sm:w-[330px] mx-auto bg-white/95 backdrop-blur-xl rounded-2xl border border-[rgba(217,231,227,0.8)] shadow-[0_20px_60px_rgba(13,43,33,0.18)] p-4 text-left transition-transform duration-150"
            style={{
              transform: `translateY(${-scrollProgress * 28}px)`,
            }}
          >
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#D9E7E3]">
              <FaktelioLogo size="sm" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D9E7E3] text-[#123A2C]">
                DEVIS → FACTURE
              </span>
            </div>

            <div className="mb-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#10241D]">Facture N° FAC-2026-049</span>
                <span className="text-[10px] font-semibold text-[#4A635A]">Échéance : 15 Oct</span>
              </div>
              <p className="text-[11px] font-semibold text-[#215C46] mt-0.5">
                Client : Cabinet Horizon Conseil
              </p>
            </div>

            <div className="bg-[#F7FAF8] rounded-xl p-2.5 space-y-1 text-[11px] mb-3 border border-[#D9E7E3]/60">
              <div className="flex justify-between">
                <span className="text-[#4A635A]">1x Plateforme Web &amp; CRM</span>
                <span className="font-bold text-[#10241D]">450 000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4A635A]">TVA (18%)</span>
                <span className="font-semibold text-[#10241D]">81 000 FCFA</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#D9E7E3] font-extrabold">
                <span className="text-[#10241D]">Net à payer TTC</span>
                <span className="text-[#215C46]">531 000 FCFA</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-[#4A635A]">
                Certifié FAKTELIO PDF
              </span>
              <button
                onClick={handleDemoAction}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-bold shadow-xs hover:bg-[#20ba59] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Envoyer sur WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
