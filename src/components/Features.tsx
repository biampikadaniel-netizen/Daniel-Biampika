import React, { useState } from 'react';
import {
  FileText,
  ArrowRightLeft,
  Users,
  Package,
  Boxes,
  Wallet,
  MessageCircle,
  LayoutDashboard,
  Palette,
  BarChart3,
  Check,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation, AppRoute } from '../context/NavigationContext';

interface FeatureItem {
  number: string;
  title: string;
  subtitle: string;
  bullets: string[];
  route: AppRoute;
  ctaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: 'blue' | 'orange' | 'green';
  whatsappSample?: {
    clientName: string;
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    link: string;
  };
}

const featuresList: FeatureItem[] = [
  {
    number: '01',
    title: 'Devis & factures',
    subtitle: 'Créer des devis et factures professionnels rapidement.',
    bullets: [
      'Calcul automatique HT, TVA, remise et Total TTC',
      'Numérotation séquentielle automatique (FAC-2026-001)',
      'Téléchargement PDF et impression A4 immédiate',
    ],
    route: '/billing',
    ctaLabel: 'Créer une facture',
    icon: FileText,
    accent: 'blue',
  },
  {
    number: '02',
    title: 'Devis → facture',
    subtitle: 'Transformer un devis accepté en facture en un clic.',
    bullets: [
      'Reprise automatique du client et des lignes produits',
      'Conservation des prix, quantités, remises et TVA',
      'Suivi des statuts : Brouillon, Envoyé, Accepté, Refusé, Expiré',
    ],
    route: '/quotes',
    ctaLabel: 'Tester la conversion Devis → Facture',
    icon: ArrowRightLeft,
    accent: 'orange',
  },
  {
    number: '03',
    title: 'Clients & CRM',
    subtitle: 'Centralisez toute la relation commerciale de vos clients.',
    bullets: [
      'Nom, téléphone, email, entreprise et adresse',
      'Historique complet des devis, factures et paiements',
      'Notes CRM personnalisées, import et export CSV',
    ],
    route: '/clients',
    ctaLabel: 'Ouvrir le CRM Clients',
    icon: Users,
    accent: 'blue',
  },
  {
    number: '04',
    title: 'Catalogue',
    subtitle: 'Gérez vos produits, prestations et tarifs sans erreur.',
    bullets: [
      'Produits physiques et services avec catégories',
      'Références, descriptions, prix unitaire et taux de TVA',
      'Actions rapides : Modifier, Dupliquer, Supprimer',
    ],
    route: '/products',
    ctaLabel: 'Gérer le catalogue',
    icon: Package,
    accent: 'blue',
  },
  {
    number: '05',
    title: 'Gestion de stock',
    subtitle: 'Suivez votre stock disponible et évitez toute rupture.',
    bullets: [
      'Stock disponible en temps réel et seuil minimum d’alerte',
      'Entrées et sorties manuelles ou liées aux factures',
      'Historique complet et horodaté des mouvements',
    ],
    route: '/stock',
    ctaLabel: 'Contrôler les stocks',
    icon: Boxes,
    accent: 'orange',
  },
  {
    number: '06',
    title: 'Paiements',
    subtitle: 'Suivez chaque règlement et solde restant en temps réel.',
    bullets: [
      'Statuts : Payé, Partiellement payé, Impayé, En attente',
      'Modes : Espèces, Mobile Money (Wave, Orange, MTN), Virement, Carte',
      'Mise à jour automatique du reste à payer sur la facture',
    ],
    route: '/payments',
    ctaLabel: 'Suivre les paiements',
    icon: Wallet,
    accent: 'green',
  },
  {
    number: '07',
    title: 'Relances WhatsApp',
    subtitle: 'Préparez automatiquement vos messages de relance client.',
    bullets: [
      'Intègre automatiquement nom client, N° facture, montant et échéance',
      'Lien direct vers le document et message personnalisable',
      'Envoi instantané en 1 clic vers WhatsApp Web ou Mobile',
    ],
    route: '/reminders',
    ctaLabel: 'Relancer sur WhatsApp',
    icon: MessageCircle,
    accent: 'green',
    whatsappSample: {
      clientName: 'Clinique Perle (Clarisse N’Guessan)',
      invoiceNumber: 'FAC-2026-004',
      amount: '672 600 FCFA',
      dueDate: '10/09/2026',
      link: 'https://app.faktelio.com/doc/FAC-2026-004',
    },
  },
  {
    number: '08',
    title: 'Tableau de bord',
    subtitle: 'Pilotez votre activité avec des indicateurs clairs.',
    bullets: [
      'Chiffre d’affaires, montant encaissé et montant en attente',
      'Nombre total de factures, devis et clients actifs',
      'Évolution mensuelle et alertes opérationnelles',
    ],
    route: '/dashboard',
    ctaLabel: 'Voir le tableau de bord',
    icon: LayoutDashboard,
    accent: 'blue',
  },
  {
    number: '09',
    title: 'Documents personnalisés',
    subtitle: 'Des factures et devis à l’image de votre entreprise.',
    bullets: [
      'Logo sur mesure, couleurs de marque et coordonnées',
      'Signature, cachet officiel et mentions légales (NIF / RCCM)',
      'Conditions de paiement et coordonnées bancaires / Mobile Money',
    ],
    route: '/settings',
    ctaLabel: 'Personnaliser mes documents',
    icon: Palette,
    accent: 'orange',
  },
  {
    number: '10',
    title: 'Analyses',
    subtitle: 'Analysez vos performances commerciales en détail.',
    bullets: [
      'Graphiques chiffre d’affaires, ventes, paiements et factures',
      'Évolution mensuelle comparative',
      'Classement des meilleurs clients et produits les plus vendus',
    ],
    route: '/reports',
    ctaLabel: 'Explorer les analyses',
    icon: BarChart3,
    accent: 'blue',
  },
];

export function Features() {
  const { user, loginDemo } = useAuth();
  const { navigate } = useNavigation();
  const [whatsappPreviewOpen, setWhatsappPreviewOpen] = useState(false);

  const handleOpenFeature = (route: AppRoute) => {
    if (!user) {
      loginDemo();
    }
    navigate(route);
  };

  const triggerWhatsAppDemo = () => {
    const message = `Bonjour Clarisse N’Guessan (Clinique Perle),\n\nSauf erreur de notre part, la facture N° FAC-2026-004 d'un montant de 672 600 FCFA (échéance le 10/09/2026) reste en attente de règlement.\n\nLien du document FAKTELIO : https://app.faktelio.com/doc/FAC-2026-004\n\nMerci de votre diligence.\nCordialement,\nEntreprise Kouassi & Associés`;
    const url = `https://wa.me/2250102498877?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="fonctionnalites" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E4F91]/8 border border-[#1E4F91]/15 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F47B20]" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#1E4F91]">
              10 Modules Connectés FAKTELIO
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#101828] tracking-tight leading-tight mb-4">
            Toutes les fonctionnalités pour facturer, encaisser et développer votre entreprise
          </h2>
          <p className="text-base sm:text-lg text-[#526581]">
            Chaque carte ci-dessous correspond à un module réel et interactif de votre plateforme FAKTELIO. Cliquez sur n&apos;importe quelle fonctionnalité pour l&apos;utiliser directement.
          </p>
        </div>

        {/* 10 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {featuresList.map((feature) => {
            const Icon = feature.icon;
            const isWhatsAppCard = Boolean(feature.whatsappSample);

            const badgeColors =
              feature.accent === 'orange'
                ? 'bg-[#F47B20]/10 text-[#F47B20]'
                : feature.accent === 'green'
                ? 'bg-[#16A34A]/10 text-[#16A34A]'
                : 'bg-[#1E4F91]/10 text-[#1E4F91]';

            return (
              <div
                key={feature.number}
                className={`group rounded-2xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                  isWhatsAppCard
                    ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white via-white to-[#F0FDF4] border-[#BBF7D0] shadow-[0_10px_30px_-10px_rgba(22,163,74,0.14)]'
                    : 'bg-white border-[#E2E8F0] shadow-[0_4px_20px_-4px_rgba(16,24,40,0.05)] hover:shadow-[0_16px_36px_-10px_rgba(30,79,145,0.14)] hover:border-[#1E4F91]/30 hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badgeColors}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold tracking-widest text-[#526581]/60 bg-[#F5F7FA] px-3 py-1 rounded-full border border-[#E2E8F0]">
                      FONCTIONNALITÉ {feature.number}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-extrabold text-[#101828] mb-2 group-hover:text-[#1E4F91] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#526581] leading-relaxed mb-5">
                    {feature.subtitle}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 mb-6">
                    {feature.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#101828]">
                        <span className="w-4 h-4 rounded-full bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Special Interactive WhatsApp Preview Block inside Feature 7 */}
                  {feature.whatsappSample && (
                    <div className="mb-6 rounded-xl bg-white border border-[#DCFCE7] p-4 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D]">
                          Aperçu automatique du message WhatsApp
                        </span>
                        <button
                          type="button"
                          onClick={() => setWhatsappPreviewOpen(!whatsappPreviewOpen)}
                          className="text-[11px] font-bold text-[#1E4F91] hover:underline cursor-pointer"
                        >
                          {whatsappPreviewOpen ? 'Masquer détails' : 'Voir le modèle complet'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3 bg-[#F5F7FA] p-2.5 rounded-lg">
                        <div>
                          <span className="text-[10px] text-[#526581] block">Client</span>
                          <strong className="text-[#101828]">Clinique Perle</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#526581] block">N° Facture</span>
                          <strong className="text-[#1E4F91]">{feature.whatsappSample.invoiceNumber}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#526581] block">Montant</span>
                          <strong className="text-[#F47B20]">{feature.whatsappSample.amount}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#526581] block">Échéance</span>
                          <strong className="text-[#101828]">{feature.whatsappSample.dueDate}</strong>
                        </div>
                      </div>
                      {whatsappPreviewOpen && (
                        <div className="text-xs text-[#101828] bg-[#DCFCE7]/40 p-3 rounded-lg border border-[#BBF7D0] mb-3 font-mono leading-relaxed">
                          &ldquo;Bonjour Clarisse N’Guessan, votre facture <strong>FAC-2026-004</strong> d&apos;un montant de <strong>672 600 FCFA</strong> arrivée à échéance le <strong>10/09/2026</strong> est disponible ici : <span className="underline text-[#1E4F91]">https://app.faktelio.com/doc/FAC-2026-004</span>&rdquo;
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={triggerWhatsAppDemo}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Relancer sur WhatsApp
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenFeature('/reminders')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E4F91]/10 hover:bg-[#1E4F91]/15 text-[#1E4F91] text-xs font-bold transition-colors cursor-pointer"
                        >
                          Ouvrir le module Relances →
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Link */}
                <div className="pt-4 border-t border-[#F5F7FA] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenFeature(feature.route)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E4F91] group-hover:text-[#F47B20] transition-colors cursor-pointer"
                  >
                    <span>{feature.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <span className="text-[11px] font-semibold text-[#526581]">FAKTELIO SaaS</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
