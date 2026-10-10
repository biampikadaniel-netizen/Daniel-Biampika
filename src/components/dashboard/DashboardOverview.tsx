import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  FileText,
  Users,
  Plus,
  ArrowRight,
  Eye,
  Wallet,
  CreditCard,
  FilePlus2,
  Zap,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { workspaceService } from '../../services/storage';
import { Invoice, Client, Product, Payment } from '../../types';
import { InvoiceDetailModal } from '../invoices/InvoiceDetailModal';
import { PaymentModal } from '../payments/PaymentModal';
import { Button } from '../common/Button';

interface DashboardOverviewProps {
  onOpenFastInvoice: () => void;
  refreshKey?: number;
}

const monthNames = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc',
];

export function DashboardOverview({
  onOpenFastInvoice,
  refreshKey = 0,
}: DashboardOverviewProps) {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const loadData = () => {
    if (!user) return;
    setInvoices(workspaceService.getInvoices(user.id));
    setClients(workspaceService.getClients(user.id));
    setProducts(workspaceService.getProducts(user.id));
    setPayments(workspaceService.getPayments(user.id));
  };

  useEffect(() => {
    loadData();
  }, [user, refreshKey]);

  if (!user) return null;

  // Real KPI Calculations (Computed strictly from stored data)
  const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.totalTtc) || 0), 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  const totalPending = invoices.reduce((sum, inv) => sum + (Number(inv.remainingAmount) || 0), 0);
  const collectionRate = totalRevenue > 0 ? Math.min(100, Math.round((totalCollected / totalRevenue) * 100)) : 0;

  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const pendingInvoices = invoices.filter((i) => i.status !== 'paid');

  // Real Monthly Revenue Breakdown for calendar year
  const currentYear = new Date().getFullYear();
  const monthlyRevenueMap: Record<number, number> = {};
  invoices.forEach((inv) => {
    const d = new Date(inv.issueDate);
    if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
      const monthIdx = d.getMonth();
      monthlyRevenueMap[monthIdx] = (monthlyRevenueMap[monthIdx] || 0) + (Number(inv.totalTtc) || 0);
    }
  });

  // Display 6 months window ending with the active current month (e.g. Mai -> Oct)
  const currentMonthIdx = new Date().getMonth();
  const recent6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    recent6Months.push({
      month: monthNames[idx],
      amount: monthlyRevenueMap[idx] || 0,
    });
  }

  // Calculate highest revenue ceiling for chart Y-axis (200 000 minimum or scale up)
  const highestTurnover = Math.max(...recent6Months.map((m) => m.amount), totalRevenue, 1);
  const yAxisMax = highestTurnover > 200000 ? Math.ceil(highestTurnover / 50000) * 50000 : 200000;
  const yAxisStep = yAxisMax / 4;
  const yAxisLevels = [
    yAxisMax,
    yAxisStep * 3,
    yAxisStep * 2,
    yAxisStep,
    0,
  ];

  const formatFCFA = (amount: number) => {
    return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
  };

  const formatDateFr = (iso: string) => {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EAF5F1] text-[#0E7051] border border-[#D9E7E3]">
            PAYÉ
          </span>
        );
      case 'partial':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            PARTIEL
          </span>
        );
      case 'late':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
            EN RETARD
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gray-100 text-gray-600">
            BROUILLON
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FEF6EE] text-[#D97706] border border-[#FDE68A]">
            EN ATTENTE
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* ==============================================================
          ROW 1: WELCOME BANNER & TOP ACTION BUTTONS
          Exact match to reference image
         ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0E1A16] tracking-tight flex items-center gap-2">
            Bonjour, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Voici un aperçu en temps réel de votre activité commerciale FAKTELIO.
          </p>
        </div>

        {/* Action Buttons Group with 3D tactile buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Button: Facturation */}
          <Button
            variant="secondary"
            size="md"
            shape="capsule"
            onClick={() => navigate('/billing')}
            icon={<FilePlus2 className="w-4 h-4 text-[#215C46]" />}
          >
            Facturation
          </Button>

          {/* Button: + Nouvelle Facture */}
          <Button
            variant="primary"
            size="md"
            shape="capsule"
            onClick={onOpenFastInvoice}
            icon={<Plus className="w-4 h-4" />}
          >
            Nouvelle Facture
          </Button>

          {/* Circular Bell Button with notification dot */}
          <button
            onClick={() => navigate('/reminders')}
            className="w-10 h-10 rounded-full btn-3d-secondary flex items-center justify-center text-gray-700 hover:text-[#215C46] relative cursor-pointer"
            title="Relances et alertes"
          >
            <Bell className="w-4 h-4" />
            <span className="w-4 h-4 rounded-full bg-[#0E7051] text-white text-[9px] font-black flex items-center justify-center absolute -top-1 -right-1 shadow-2xs">
              1
            </span>
          </button>

          {/* Button: ⚡ Facture Express (+30s) */}
          <Button
            variant="primary"
            size="md"
            shape="capsule"
            onClick={onOpenFastInvoice}
            icon={<Zap className="w-3.5 h-3.5 text-[#D9E7E3]" />}
          >
            Facture Express (+30s)
          </Button>
        </div>
      </div>

      {/* ==============================================================
          ROW 2: 5 KPI CARDS IN 5-COLUMN DESKTOP GRID
          Exact match to reference image
         ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 lg:gap-4">
        {/* CARD 1: CHIFFRE D'AFFAIRES */}
        <div className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                CHIFFRE D&apos;AFFAIRES
              </span>
              <div className="w-8 h-8 rounded-full bg-[#EAF5F1] text-[#0E7051] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-[#0E1A16] mt-3">
              {formatFCFA(totalRevenue)}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {invoices.length} facture(s) émise(s)
            </p>
          </div>

          <div className="mt-4">
            <span className="bg-[#EAF5F1] text-[#0E7051] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
              ↗ +12%
            </span>
          </div>
        </div>

        {/* CARD 2: MONTANT ENCAISSÉ */}
        <div className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                MONTANT ENCAISSÉ
              </span>
              <div className="w-8 h-8 rounded-full bg-[#EBF5FB] text-[#2980B9] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-[#0E1A16] mt-3">
              {formatFCFA(totalCollected)}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {collectionRate}% encaissé
            </p>
          </div>

          <div className="mt-4">
            <span className="bg-[#EBF5FB] text-[#2980B9] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
              ◎ {collectionRate}%
            </span>
          </div>
        </div>

        {/* CARD 3: MONTANT EN ATTENTE */}
        <div className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                MONTANT EN ATTENTE
              </span>
              <div className="w-8 h-8 rounded-full bg-[#FEF6EE] text-[#D97706] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-[#0E1A16] mt-3">
              {formatFCFA(totalPending)}
            </div>
            <button
              onClick={() => navigate('/reminders')}
              className="text-xs font-semibold text-[#0E5C44] hover:underline cursor-pointer mt-0.5 block text-left"
            >
              Relancer sur WhatsApp →
            </button>
          </div>

          <div className="mt-4">
            <span className="bg-[#FEF6EE] text-[#D97706] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              En attente
            </span>
          </div>
        </div>

        {/* CARD 4: FACTURES */}
        <div
          onClick={() => navigate('/invoices')}
          className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                FACTURES
              </span>
              <div className="w-8 h-8 rounded-full bg-[#F4F3FF] text-[#6941C6] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-[#0E1A16] mt-3">
              {invoices.length} facture{invoices.length > 1 ? 's' : ''}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {paidInvoices.length} payé(s), {pendingInvoices.length} en cours
            </p>
          </div>

          <div className="mt-4">
            <span className="bg-[#F4F3FF] text-[#6941C6] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
              🔄 {pendingInvoices.length} en cours
            </span>
          </div>
        </div>

        {/* CARD 5: CLIENTS */}
        <div
          onClick={() => navigate('/clients')}
          className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                CLIENTS
              </span>
              <div className="w-8 h-8 rounded-full bg-[#EAF5F1] text-[#0E7051] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-[#0E1A16] mt-3">
              {clients.length} client{clients.length > 1 ? 's' : ''}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/clients');
              }}
              className="text-xs font-semibold text-[#0E5C44] hover:underline cursor-pointer mt-0.5 block text-left"
            >
              Gérer le CRM Clients →
            </button>
          </div>

          <div className="mt-4">
            <span className="bg-[#EAF5F1] text-[#0E7051] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0E7051]" />
              Actif
            </span>
          </div>
        </div>
      </div>

      {/* ==============================================================
          ROW 3: TWO-COLUMN CARDS:
          1. Chiffre d'affaires mensuel (Bar Chart)
          2. Paiements (Empty State / Breakdown)
          Exact match to reference image
         ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
        {/* LEFT COLUMN: CHIFFRE D'AFFAIRES MENSUEL (Bar Chart) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-[26px] p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#0E1A16]">
                  Chiffre d&apos;affaires mensuel
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Évolution réelle calculée depuis vos factures ({currentYear})
                </p>
              </div>

              {/* Year Selector Pill Button */}
              <div className="bg-[#EAF5F1] text-[#0E7051] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer">
                <span>{currentYear}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Custom Chart replicating reference layout */}
            <div className="relative pt-4 pb-2">
              <div className="flex">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-right pr-4 text-[11px] font-medium text-gray-400 select-none h-56 shrink-0 w-16">
                  {yAxisLevels.map((lvl) => (
                    <span key={lvl} className="leading-none">
                      {Math.round(lvl).toLocaleString('fr-FR')}
                    </span>
                  ))}
                </div>

                {/* Chart Grid Lines & Columns Container */}
                <div className="flex-1 relative h-56 flex flex-col justify-between">
                  {/* 4 Horizontal Light Grid Lines */}
                  <div className="absolute inset-x-0 top-0 border-b border-gray-100/90" />
                  <div className="absolute inset-x-0 top-1/4 border-b border-gray-100/90" />
                  <div className="absolute inset-x-0 top-2/4 border-b border-gray-100/90" />
                  <div className="absolute inset-x-0 top-3/4 border-b border-gray-100/90" />
                  <div className="absolute inset-x-0 bottom-0 border-b border-gray-200" />

                  {/* 6 Monthly Columns */}
                  <div className="absolute inset-0 grid grid-cols-6 items-end pb-0 px-2 sm:px-4">
                    {recent6Months.map((m, idx) => {
                      const isCurrentMonth = idx === recent6Months.length - 1;
                      const hasRevenue = m.amount > 0;
                      // Height ratio against top Y-axis value
                      const ratio = hasRevenue ? Math.min(0.95, Math.max(0.2, m.amount / yAxisMax)) : 0;
                      const heightPercent = hasRevenue ? Math.round(ratio * 100) : 0;

                      return (
                        <div
                          key={m.month}
                          className="flex flex-col items-center justify-end h-full relative group"
                        >
                          {/* If revenue exists on this month (e.g. Oct), display amount label above the pillar */}
                          {hasRevenue ? (
                            <div className="w-full flex flex-col items-center justify-end h-full">
                              <span className="text-[11px] font-black text-[#0E7051] mb-1.5 whitespace-nowrap animate-fade-in">
                                {formatFCFA(m.amount)}
                              </span>
                              <div
                                style={{ height: `${heightPercent}%` }}
                                className="w-10 sm:w-12 bg-[#0E7051] rounded-t-xl transition-all duration-500 shadow-xs"
                              />
                            </div>
                          ) : (
                            /* Soft mint baseline capsule for zero months */
                            <div className="w-full flex justify-center pb-0">
                              <div className="h-2 w-10 sm:w-12 bg-[#C2DDD4] rounded-full transition-all" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* X-Axis Month Labels */}
              <div className="flex pt-3 pl-16">
                <div className="w-full grid grid-cols-6 text-center px-2 sm:px-4">
                  {recent6Months.map((m, idx) => {
                    const isCurrentMonth = idx === recent6Months.length - 1;
                    return (
                      <span
                        key={m.month}
                        className={`text-xs ${
                          isCurrentMonth
                            ? 'font-black text-[#0E1A16]'
                            : 'font-semibold text-gray-500'
                        }`}
                      >
                        {m.month}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PAIEMENTS (Matching exact reference card) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-[26px] p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#0E1A16]">
                  Paiements
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Répartition des encaissements réels
                </p>
              </div>

              <button
                onClick={() => navigate('/payments')}
                className="text-xs font-bold text-[#0E7051] hover:underline cursor-pointer"
              >
                Historique →
              </button>
            </div>

            {/* Inner Content: Exact Empty State from Reference Image if no payments */}
            {payments.length === 0 ? (
              <div className="border border-dashed border-[#D9E7E3] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center my-2 sm:my-4 bg-transparent">
                {/* Mint Rounded Square Badge */}
                <div className="w-16 h-16 rounded-2xl bg-[#EAF5F1] text-[#0E7051] flex items-center justify-center mb-4 shadow-2xs">
                  <CreditCard className="w-8 h-8 text-[#0E7051]" />
                </div>

                <h3 className="text-base font-black text-[#0E1A16] mb-1.5">
                  Aucun paiement enregistré
                </h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6">
                  Lorsque vos clients effectuent un versement, enregistrez-le pour suivre vos encaissements.
                </p>

                <button
                  onClick={() => {
                    if (invoices.length > 0) {
                      setPaymentInvoice(invoices[0]);
                    } else {
                      navigate('/payments');
                    }
                  }}
                  className="bg-[#0E5C44] hover:bg-[#0B4D39] text-white text-xs font-bold px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Enregistrer un paiement
                </button>
              </div>
            ) : (
              /* When payments exist, show pristine progress breakdown */
              <div className="space-y-4 my-2">
                <div className="p-4 rounded-2xl bg-[#F8FAF9] border border-gray-100">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-[#0E1A16]">Taux d&apos;encaissement global</span>
                    <span className="text-[#0E7051] font-black">{collectionRate}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden flex">
                    <div
                      className="bg-[#0E7051] h-full transition-all duration-500"
                      style={{ width: `${collectionRate}%` }}
                    />
                    <div
                      className="bg-[#A9BDBC] h-full transition-all duration-500"
                      style={{ width: `${100 - collectionRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0E7051]" />
                      Encaissé : <strong className="text-[#0E1A16]">{formatFCFA(totalCollected)}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#A9BDBC]" />
                      Attente : <strong className="text-[#0E1A16]">{formatFCFA(totalPending)}</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (invoices.length > 0) {
                        setPaymentInvoice(invoices[0]);
                      } else {
                        navigate('/payments');
                      }
                    }}
                    className="w-full bg-[#0E5C44] hover:bg-[#0B4D39] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Enregistrer un nouveau paiement
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==============================================================
          FACTIRES RÉCENTES TABLE
          Preserving 100% of the functionalities & modals
         ============================================================== */}
      <div className="bg-white rounded-[26px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#0E1A16]">Factures récentes</h2>
            <p className="text-xs text-gray-400">
              Vos factures réelles enregistrées dans votre entreprise
            </p>
          </div>
          {invoices.length > 0 && (
            <button
              onClick={() => navigate('/invoices')}
              className="text-xs font-bold text-[#0E7051] hover:underline cursor-pointer"
            >
              Voir toutes les factures ({invoices.length}) →
            </button>
          )}
        </div>

        {invoices.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F1] text-[#0E7051] flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-[#0E1A16]">
              Aucune facture pour le moment
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-5">
              Créez votre première facture professionnelle pour générer votre premier PDF certifié et suivre vos encaissements.
            </p>
            <button
              onClick={onOpenFastInvoice}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E5C44] hover:bg-[#0B4D39] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Créer ma première facture
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-6">Numéro</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Montant</th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {invoices.slice(0, 6).map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-black text-[#0E7051]">{inv.number}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#0E1A16]">{inv.clientName}</div>
                      {inv.clientCompany && (
                        <div className="text-xs text-gray-400">{inv.clientCompany}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-gray-500">
                      <div>Émise : {formatDateFr(inv.issueDate)}</div>
                      <div>Échéance : {formatDateFr(inv.dueDate)}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-black text-[#0E1A16]">{formatFCFA(inv.totalTtc)}</div>
                      {inv.remainingAmount > 0 && (
                        <div className="text-[11px] text-[#0E7051] font-semibold">
                          Reste : {formatFCFA(inv.remainingAmount)}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-6">{getStatusBadge(inv.status)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          title="Voir et imprimer la facture PDF"
                          className="p-2 rounded-xl bg-gray-100 hover:bg-[#0E5C44] text-gray-700 hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {inv.remainingAmount > 0 && (
                          <button
                            onClick={() => setPaymentInvoice(inv)}
                            title="Enregistrer un paiement"
                            className="p-2 rounded-xl bg-[#EAF5F1] hover:bg-[#0E5C44] text-[#0E7051] hover:text-white transition-colors cursor-pointer"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal (PDF / Printable) */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => {
            loadData();
            setSelectedInvoice(null);
          }}
        />
      )}

      {/* Record Payment Modal */}
      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onPaymentSaved={() => {
            loadData();
            setPaymentInvoice(null);
          }}
        />
      )}
    </div>
  );
}
