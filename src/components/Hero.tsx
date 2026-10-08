import React from 'react';
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F7FA]/80 via-white to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle institutional ambient glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(30,79,145,0.10) 0%, rgba(244,123,32,0.06) 50%, rgba(255,255,255,0) 75%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Hero Header Block */}
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E4F91]/8 border border-[#1E4F91]/15 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F47B20]" />
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#1E4F91]">
              LOGICIEL DE FACTURATION POUR PME, COMMERCANTS &amp; FREELANCES
            </span>
          </div>

          {/* Main H1 Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-[#101828] tracking-tight leading-[1.1] mb-6">
            Créez vos devis et factures <br className="hidden sm:inline" />
            en <span className="text-[#F47B20]">quelques secondes.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-[#526581] max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Faktelio simplifie votre facturation, vos clients, vos paiements et votre gestion
            commerciale depuis votre téléphone ou votre ordinateur.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-7">
            <button
              onClick={handlePrimaryAction}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-[#F47B20] hover:bg-[#FF7A21] rounded-xl shadow-[0_10px_25px_-5px_rgba(244,123,32,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(244,123,32,0.5)] hover:-translate-y-0.5 transition-all duration-250 cursor-pointer"
            >
              {user ? 'Accéder à mon Dashboard →' : 'Créer mon compte gratuitement →'}
            </button>

            <a
              href="#fonctionnalites"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-[#1E4F91] bg-white hover:bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl shadow-xs hover:border-[#1E4F91]/30 transition-all duration-200"
            >
              Voir les fonctionnalités
            </a>
          </div>

          {/* Reassurance Checks under Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#526581] mb-8">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A] stroke-[2.5]" />
              Sans carte bancaire
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A] stroke-[2.5]" />
              Démarrage gratuit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#16A34A] stroke-[2.5]" />
              Accessible partout
            </span>
          </div>

          {/* Visual Social Proof */}
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs mb-12">
            <div className="flex -space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1E4F91] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                KD
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F47B20] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                AT
              </div>
              <div className="w-8 h-8 rounded-full bg-[#2D5FA8] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                MK
              </div>
              <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                CN
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-[#F47B20]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#101828]">4.9/5</span>
              <span className="text-xs text-[#526581]">
                • Adopté par <strong className="text-[#101828]">+2 500 PME &amp; entrepreneurs</strong>
              </span>
            </div>
            <button
              onClick={handleDemoAction}
              className="text-xs font-bold text-[#1E4F91] hover:text-[#F47B20] underline underline-offset-2 cursor-pointer"
            >
              Tester la démo en 1 clic
            </button>
          </div>
        </div>

        {/* ==============================================================
            SECTION 6 : MOCKUP ORDINATEUR AVEC DASHBOARD FAKTELIO &
            FACTURES FLOTTANTES AU PREMIER PLAN
           ============================================================== */}
        <div className="relative max-w-[1140px] mx-auto pt-2 pb-10 sm:pb-16">
          {/* Ambient Backlight behind Laptop */}
          <div className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-[#1E4F91]/15 via-[#2D5FA8]/10 to-[#F47B20]/15 rounded-[36px] blur-2xl opacity-80" />

          {/* LAPTOP CHASSIS */}
          <div className="relative mx-auto max-w-[980px] z-10">
            {/* Laptop Screen Frame (Bezel) */}
            <div className="bg-[#0F172A] rounded-t-[24px] sm:rounded-t-[30px] p-2.5 sm:p-4 pb-3 sm:pb-4 shadow-[0_30px_80px_-15px_rgba(16,24,40,0.32)] border-[2px] border-[#334155]">
              {/* Top Camera Notch */}
              <div className="flex items-center justify-center mb-2">
                <div className="w-16 h-1.5 rounded-full bg-[#1E293B] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]/60" />
                </div>
              </div>

              {/* Screen Viewport — Real FAKTELIO Dashboard */}
              <div className="bg-[#F5F7FA] rounded-[14px] sm:rounded-[18px] overflow-hidden border border-[#E2E8F0] text-left">
                {/* Browser / App Top Bar */}
                <div className="bg-white border-b border-[#E2E8F0] px-3 sm:px-5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg px-3 py-1 text-[11px] font-medium text-[#526581]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>https://app.faktelio.com/dashboard</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                      ● Synchronisé Cloud 24/7
                    </span>
                    <button
                      onClick={handleDemoAction}
                      className="px-2.5 py-1 rounded-md bg-[#F47B20] text-white text-[10px] font-bold hover:bg-[#FF7A21] transition-colors cursor-pointer"
                    >
                      Ouvrir en plein écran →
                    </button>
                  </div>
                </div>

                {/* App Body inside Laptop Screen */}
                <div className="grid grid-cols-12 min-h-[380px] sm:min-h-[450px]">
                  {/* Left Sidebar inside Mockup */}
                  <div className="hidden md:flex md:col-span-3 lg:col-span-2 bg-[#1E4F91] text-white p-3.5 flex-col justify-between">
                    <div>
                      <div className="pb-3 mb-3 border-b border-white/15">
                        <FaktelioLogo variant="white" size="sm" />
                      </div>
                      <div className="space-y-1 text-[11px] font-semibold">
                        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#F47B20] text-white shadow-xs">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80">
                          <Users className="w-3.5 h-3.5" />
                          <span>Clients &amp; CRM</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Facturation</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Devis &amp; Factures</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80">
                          <Wallet className="w-3.5 h-3.5" />
                          <span>Paiements</span>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-white/80">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Relances WhatsApp</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 text-[10px]">
                      <p className="font-bold text-white">FAKTELIO PRO</p>
                      <p className="text-white/75 mt-0.5">Facturation &amp; Stock actifs</p>
                    </div>
                  </div>

                  {/* Main Dashboard Canvas inside Laptop */}
                  <div className="col-span-12 md:col-span-9 lg:col-span-10 p-4 sm:p-5 space-y-4 bg-[#F5F7FA]">
                    {/* Top Greeting Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="md:hidden">
                            <FaktelioLogo size="sm" />
                          </span>
                          <p className="text-xs sm:text-sm font-extrabold text-[#101828]">
                            Bonjour, Kouadio 👋 — Espace FAKTELIO
                          </p>
                        </div>
                        <p className="text-[11px] text-[#526581]">
                          Voici un aperçu en temps réel de votre activité commerciale.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#1E4F91]/10 text-[#1E4F91] text-[11px] font-bold">
                          + Nouveau Devis
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-[#F47B20] text-white text-[11px] font-bold shadow-xs">
                          + Nouvelle Facture
                        </span>
                      </div>
                    </div>

                    {/* KPI Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs">
                        <p className="text-[10px] font-bold uppercase text-[#526581]">
                          Chiffre d&apos;affaires
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#101828] mt-1">
                          4 702 300 FCFA
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#16A34A]">
                          +24.8% ce mois
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs">
                        <p className="text-[10px] font-bold uppercase text-[#526581]">
                          Montant encaissé
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#16A34A] mt-1">
                          2 907 200 FCFA
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#526581]">
                          Wave • OM • Banque
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs">
                        <p className="text-[10px] font-bold uppercase text-[#526581]">
                          Montant en attente
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#F47B20] mt-1">
                          1 795 100 FCFA
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-[#D97706]">
                          3 factures à suivre
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs">
                        <p className="text-[10px] font-bold uppercase text-[#526581]">
                          Clients &amp; Factures
                        </p>
                        <p className="text-sm sm:text-base font-extrabold text-[#1E4F91] mt-1">
                          48 Factures • 19 Clients
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-[#1E4F91]">
                          100% centralisé
                        </span>
                      </div>
                    </div>

                    {/* Chart & Recent Invoices inside Screen */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                      {/* Monthly Revenue Bar Chart */}
                      <div className="lg:col-span-5 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-[#101828]">
                            Chiffre d&apos;affaires mensuel
                          </p>
                          <span className="text-[10px] font-bold text-[#1E4F91] bg-[#1E4F91]/10 px-2 py-0.5 rounded">
                            2026
                          </span>
                        </div>
                        <div className="flex items-end justify-between gap-2 h-28 pt-4 px-1">
                          {[
                            { m: 'Avr', h: '45%', c: 'bg-[#1E4F91]/30' },
                            { m: 'Mai', h: '60%', c: 'bg-[#1E4F91]/45' },
                            { m: 'Juin', h: '52%', c: 'bg-[#1E4F91]/60' },
                            { m: 'Juil', h: '75%', c: 'bg-[#1E4F91]/80' },
                            { m: 'Août', h: '86%', c: 'bg-[#1E4F91]' },
                            { m: 'Sept', h: '100%', c: 'bg-[#F47B20]' },
                          ].map((bar) => (
                            <div key={bar.m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div
                                className={`w-full rounded-t-md ${bar.c} transition-all duration-500`}
                                style={{ height: bar.h }}
                              />
                              <span className="text-[9px] font-bold text-[#526581]">{bar.m}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Invoices Table inside Screen */}
                      <div className="lg:col-span-7 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-xs font-bold text-[#101828]">Factures récentes FAKTELIO</p>
                          <span className="text-[10px] font-semibold text-[#1E4F91]">Tout voir →</span>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#F5F7FA]">
                            <div>
                              <span className="font-bold text-[#101828]">FAC-2026-001</span>
                              <span className="text-[#526581] ml-2">Groupe Ivoire Distribution</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#101828]">1 522 200 FCFA</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#DCFCE7] text-[#15803D]">
                                PAYÉ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#F5F7FA]">
                            <div>
                              <span className="font-bold text-[#101828]">FAC-2026-002</span>
                              <span className="text-[#526581] ml-2">Cabinet Horizon Conseil</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#101828]">885 000 FCFA</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#DCFCE7] text-[#15803D]">
                                PAYÉ
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#F5F7FA]">
                            <div>
                              <span className="font-bold text-[#101828]">FAC-2026-003</span>
                              <span className="text-[#526581] ml-2">BTP &amp; Résidences Lagune</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#101828]">1 091 500 FCFA</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FEF3C7] text-[#B45309]">
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
            <div className="relative mx-auto w-[104%] -left-[2%] h-4 sm:h-5 bg-gradient-to-b from-[#CBD5E1] via-[#94A3B8] to-[#64748B] rounded-b-2xl shadow-[0_22px_50px_rgba(15,23,42,0.35)] flex items-start justify-center">
              <div className="w-24 sm:w-32 h-1.5 bg-[#475569] rounded-b-lg" />
            </div>
          </div>

          {/* ==============================================================
              FLOATING FOREGROUND INVOICE 1 (LEFT / FRONT) — FAKTELIO
             ============================================================== */}
          <div className="mt-6 lg:mt-0 lg:absolute lg:-bottom-6 lg:-left-4 xl:-left-8 z-20 w-full sm:w-[360px] mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_25px_60px_-12px_rgba(16,24,40,0.22)] p-4 sm:p-5 text-left animate-float-subtle">
            {/* Invoice Header */}
            <div className="flex items-start justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
              <div>
                <FaktelioLogo size="sm" />
                <p className="text-[10px] text-[#526581] mt-1">
                  Entreprise Kouassi &amp; Associés • Abidjan
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#DCFCE7] text-[#15803D]">
                  FACTURE PAYÉE
                </span>
                <p className="text-xs font-extrabold text-[#1E4F91] mt-1">N° FAC-2026-048</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex items-center justify-between text-[11px] bg-[#F5F7FA] rounded-xl p-2.5 mb-3">
              <div>
                <p className="text-[9px] font-bold uppercase text-[#526581]">Facturé à</p>
                <p className="font-bold text-[#101828]">Groupe Ivoire Distribution SARL</p>
                <p className="text-[10px] text-[#526581]">Cocody Riviera, Abidjan • +225 07 07 88 99 11</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
            </div>

            {/* Products Table on Floating Invoice */}
            <div className="space-y-1.5 text-[11px] mb-3">
              <div className="grid grid-cols-12 text-[9px] font-bold uppercase text-[#526581] pb-1 border-b border-[#E2E8F0]">
                <span className="col-span-6">Désignation</span>
                <span className="col-span-2 text-center">Qté</span>
                <span className="col-span-4 text-right">Total HT</span>
              </div>
              <div className="grid grid-cols-12 items-center py-1">
                <span className="col-span-6 font-semibold text-[#101828] truncate">
                  Terminal POS Tactile Pro
                </span>
                <span className="col-span-2 text-center text-[#526581]">2</span>
                <span className="col-span-4 text-right font-bold text-[#101828]">570 000 FCFA</span>
              </div>
              <div className="grid grid-cols-12 items-center py-1 border-t border-[#F5F7FA]">
                <span className="col-span-6 font-semibold text-[#101828] truncate">
                  Déploiement &amp; Support Cloud
                </span>
                <span className="col-span-2 text-center text-[#526581]">1</span>
                <span className="col-span-4 text-right font-bold text-[#101828]">150 000 FCFA</span>
              </div>
            </div>

            {/* Totals & Payment Conditions */}
            <div className="pt-2.5 border-t border-[#E2E8F0] space-y-1 text-[11px]">
              <div className="flex justify-between text-[#526581]">
                <span>Sous-total HT :</span>
                <span className="font-semibold text-[#101828]">720 000 FCFA</span>
              </div>
              <div className="flex justify-between text-[#526581]">
                <span>TVA (18%) :</span>
                <span className="font-semibold text-[#101828]">129 600 FCFA</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-[#E2E8F0]">
                <span className="font-extrabold text-[#1E4F91]">TOTAL TTC :</span>
                <span className="text-sm font-extrabold text-[#F47B20]">849 600 FCFA</span>
              </div>
              <p className="text-[9px] text-[#526581] pt-1">
                Conditions : Paiement Mobile Money (Wave / Orange Money) ou virement sous 15j.
              </p>
            </div>
          </div>

          {/* ==============================================================
              FLOATING FOREGROUND INVOICE 2 (RIGHT / FRONT) — FAKTELIO
             ============================================================== */}
          <div className="mt-4 lg:mt-0 lg:absolute lg:-bottom-4 lg:-right-4 xl:-right-8 z-20 w-full sm:w-[330px] mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_25px_60px_-12px_rgba(16,24,40,0.22)] p-4 text-left animate-float-delayed">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E2E8F0]">
              <FaktelioLogo size="sm" />
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FEF3C7] text-[#B45309]">
                DEVIS → FACTURE
              </span>
            </div>

            <div className="mb-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#101828]">Facture N° FAC-2026-049</span>
                <span className="text-[10px] font-semibold text-[#526581]">Échéance : 15 Oct</span>
              </div>
              <p className="text-[11px] font-semibold text-[#1E4F91] mt-0.5">
                Client : Cabinet Horizon Conseil
              </p>
            </div>

            <div className="bg-[#F5F7FA] rounded-xl p-2.5 space-y-1 text-[11px] mb-3">
              <div className="flex justify-between">
                <span className="text-[#526581]">1x Plateforme Web &amp; CRM</span>
                <span className="font-bold text-[#101828]">450 000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526581]">TVA (18%)</span>
                <span className="font-semibold text-[#101828]">81 000 FCFA</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E2E8F0] font-extrabold">
                <span className="text-[#101828]">Net à payer TTC</span>
                <span className="text-[#1E4F91]">531 000 FCFA</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-[#526581]">
                Certifié FAKTELIO PDF
              </span>
              <button
                onClick={handleDemoAction}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-[11px] font-bold shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
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
