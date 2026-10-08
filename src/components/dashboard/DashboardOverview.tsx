import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  Plus,
  Eye,
  MessageCircle,
  Wallet,
  AlertTriangle,
  FileCheck2,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { workspaceService, formatFCFA, formatDateFr } from '../../services/storage';
import { Invoice, Client, Product, Payment } from '../../types';
import { InvoiceDetailModal } from '../invoices/InvoiceDetailModal';
import { PaymentModal } from '../payments/PaymentModal';

export function DashboardOverview({
  onOpenFastInvoice,
  refreshKey,
}: {
  onOpenFastInvoice: () => void;
  refreshKey: number;
}) {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const companyId = user?.companyId || user?.id || '';

  const reloadData = () => {
    if (!companyId) return;
    setInvoices(workspaceService.getInvoices(companyId));
    setClients(workspaceService.getClients(companyId));
    setProducts(workspaceService.getProducts(companyId));
    setPayments(workspaceService.getPayments(companyId));
  };

  useEffect(() => {
    reloadData();
  }, [companyId, refreshKey]);

  if (!user) return null;

  const firstName = user.name ? user.name.split(' ')[0] : 'Cher entrepreneur';

  // 100% Real Calculations from DB
  const totalRevenue = invoices.reduce((acc, i) => acc + (Number(i.totalTtc) || 0), 0);
  const totalCollected = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalPending = invoices.reduce((acc, i) => acc + (Number(i.remainingAmount) || 0), 0);

  const lowStockProducts = products.filter(
    (p) => p.type === 'product' && p.stock <= p.minStockAlert
  );

  // Real Monthly Revenue Chart Data calculated from actual invoices
  const currentYear = new Date().getFullYear();
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
  
  const monthlyRevenueMap = new Array(12).fill(0);
  invoices.forEach((inv) => {
    if (inv.issueDate) {
      const d = new Date(inv.issueDate);
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        monthlyRevenueMap[d.getMonth()] += Number(inv.totalTtc) || 0;
      }
    }
  });

  // Display the last 6 months window up to current month
  const currentMonthIdx = new Date().getMonth();
  const recent6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    recent6Months.push({
      month: monthNames[idx],
      amount: monthlyRevenueMap[idx] || 0,
    });
  }
  const maxMonth = Math.max(...recent6Months.map((m) => m.amount), 1);
  const hasMonthlyData = recent6Months.some((m) => m.amount > 0);

  // Real Payments Breakdown Data
  const mobileMoneyTotal = payments
    .filter((p) => p.paymentMethod === 'mobile_money')
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const bankTransferTotal = payments
    .filter((p) => p.paymentMethod === 'bank_transfer')
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const otherPaymentTotal = payments
    .filter((p) => p.paymentMethod !== 'mobile_money' && p.paymentMethod !== 'bank_transfer')
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const collectionRate = totalRevenue > 0 ? Math.min(100, Math.round((totalCollected / totalRevenue) * 100)) : 0;

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#DCFCE7] text-[#15803D]">
            PAYÉ
          </span>
        );
      case 'partial':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FEF3C7] text-[#B45309]">
            PARTIEL
          </span>
        );
      case 'late':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FEE2E2] text-[#DC2626]">
            EN RETARD
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#F5F7FA] text-[#526581]">
            BROUILLON
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#E0F2FE] text-[#0369A1]">
            EN ATTENTE
          </span>
        );
    }
  };

  const handleWhatsAppShare = (inv: Invoice) => {
    const cleanPhone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const message = `Bonjour ${inv.clientName},\n\nVeuillez trouver votre facture ${inv.number}.\n\nMontant : ${formatFCFA(inv.totalTtc)}\nReste à payer : ${formatFCFA(inv.remainingAmount)}\nDate d'échéance : ${formatDateFr(inv.dueDate)}\n\nMerci.\n\nFAKTELIO`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isEmptyWorkspace = invoices.length === 0 && clients.length === 0 && products.length === 0;

  return (
    <div className="space-y-6">
      {/* Header Banner — Exact Section 11 Greeting */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-sm text-[#526581] mt-1">
            Voici un aperçu de votre activité.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/quotes')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0]/70 text-[#101828] text-xs font-bold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-[#1E4F91]" />
            + Nouveau Devis
          </button>
          <button
            onClick={() => navigate('/billing')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E4F91] hover:bg-[#163C70] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Facturation complète
          </button>
          <button
            onClick={onOpenFastInvoice}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-[0_6px_18px_rgba(244,123,32,0.28)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Facture Express (+30s)
          </button>
        </div>
      </div>

      {/* Global Empty State Banner if brand new workspace */}
      {isEmptyWorkspace && (
        <div className="bg-gradient-to-r from-[#1E4F91]/5 via-[#F5F7FA] to-[#F47B20]/5 rounded-2xl p-6 border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-[#101828]">
              Bienvenue dans votre espace FAKTELIO !
            </h2>
            <p className="text-xs sm:text-sm text-[#526581]">
              Votre activité apparaîtra ici lorsque vous créerez votre première facture. Commencez par ajouter un client ou générer un document.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/clients')}
              className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#101828] hover:bg-[#F5F7FA] cursor-pointer"
            >
              + Ajouter mon premier client
            </button>
            <button
              onClick={onOpenFastInvoice}
              className="px-4 py-2 rounded-xl bg-[#F47B20] text-white text-xs font-extrabold hover:bg-[#FF7A21] cursor-pointer"
            >
              + Créer ma première facture
            </button>
          </div>
        </div>
      )}

      {/* 5 Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Chiffre d'affaires */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#526581] uppercase tracking-wider">
              Chiffre d&apos;affaires
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#1E4F91]/10 text-[#1E4F91] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828]">
            {formatFCFA(totalRevenue)}
          </div>
          <p className="text-[11px] text-[#526581] font-medium mt-1.5">
            {invoices.length === 0 ? 'Aucune facture émise' : `${invoices.length} facture(s) émise(s)`}
          </p>
        </div>

        {/* Card 2: Montant encaissé */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#526581] uppercase tracking-wider">
              Montant encaissé
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#15803D]">
            {formatFCFA(totalCollected)}
          </div>
          <p className="text-[11px] text-[#526581] mt-1.5">
            {totalRevenue > 0 ? `${collectionRate}% encaissé` : '0 paiement'}
          </p>
        </div>

        {/* Card 3: Montant en attente */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#526581] uppercase tracking-wider">
              Montant en attente
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#D97706]">
            {formatFCFA(totalPending)}
          </div>
          <p className="text-[11px] text-[#526581] mt-1.5">
            {totalPending > 0 ? (
              <button
                onClick={() => navigate('/reminders')}
                className="text-[#1E4F91] font-bold hover:underline cursor-pointer"
              >
                Relancer sur WhatsApp →
              </button>
            ) : (
              '0 impayé'
            )}
          </p>
        </div>

        {/* Card 4: Factures */}
        <div
          onClick={() => navigate('/invoices')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#526581] uppercase tracking-wider">
              Factures
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#1E4F91]/10 text-[#1E4F91] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828]">
            {invoices.length} {invoices.length <= 1 ? 'facture' : 'factures'}
          </div>
          <p className="text-[11px] text-[#526581] mt-1.5">
            {invoices.length === 0
              ? '0 facture enregistrée'
              : `${invoices.filter((i) => i.status === 'paid').length} payée(s) • ${
                  invoices.filter((i) => i.status !== 'paid').length
                } en cours`}
          </p>
        </div>

        {/* Card 5: Clients */}
        <div
          onClick={() => navigate('/clients')}
          className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#526581] uppercase tracking-wider">
              Clients
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#F47B20]/15 text-[#F47B20] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#101828]">
            {clients.length} {clients.length <= 1 ? 'client' : 'clients'}
          </div>
          <p className="text-[11px] text-[#1E4F91] font-semibold mt-1.5">
            {clients.length === 0 ? '+ Créer un client' : 'Gérer le CRM Clients →'}
          </p>
        </div>
      </div>

      {/* Real Low Stock Alert if any exists */}
      {lowStockProducts.length > 0 && (
        <div className="bg-[#FEF3C7]/60 border border-[#F59E0B]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#101828]">
                Alerte Stock : {lowStockProducts.length} produit(s) sous le seuil minimum
              </p>
              <p className="text-xs text-[#526581]">
                {lowStockProducts.map((p) => `${p.name} (${p.stock} restant(s))`).join(' • ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/stock')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#101828] hover:bg-[#F5F7FA] shrink-0 cursor-pointer"
          >
            Approvisionner le stock →
          </button>
        </div>
      )}

      {/* Charts Row: "Chiffre d'affaires mensuel" + "Paiements" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Chiffre d'affaires mensuel */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#101828]">
                  Chiffre d&apos;affaires mensuel
                </h2>
                <p className="text-xs text-[#526581]">
                  Évolution réelle calculée depuis vos factures ({currentYear})
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#1E4F91] bg-[#1E4F91]/10 px-2.5 py-1 rounded-lg">
                {currentYear}
              </span>
            </div>

            {!hasMonthlyData ? (
              <div className="py-12 px-4 text-center rounded-xl bg-[#F5F7FA] border border-dashed border-[#CBD5E1]">
                <Inbox className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#101828]">Pas encore de données</p>
                <p className="text-xs text-[#526581] max-w-sm mx-auto mt-1 mb-4">
                  Créez votre première facture pour commencer à suivre votre chiffre d&apos;affaires mois par mois.
                </p>
                <button
                  onClick={onOpenFastInvoice}
                  className="px-4 py-2 rounded-xl bg-[#1E4F91] text-white text-xs font-bold hover:bg-[#163C70] cursor-pointer"
                >
                  + Créer une facture
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-3 sm:gap-5 items-end h-44 pt-6 px-2 border-b border-[#E2E8F0]">
                  {recent6Months.map((d, i) => {
                    const heightPercent = d.amount > 0 ? Math.max(15, Math.round((d.amount / maxMonth) * 100)) : 4;
                    const isCurrent = i === recent6Months.length - 1;
                    return (
                      <div key={d.month} className="flex flex-col items-center gap-2 h-full justify-end">
                        {d.amount > 0 && (
                          <span className="text-[9px] font-bold text-[#526581] hidden sm:block truncate">
                            {formatFCFA(d.amount)}
                          </span>
                        )}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 ${
                            isCurrent
                              ? 'bg-[#F47B20]'
                              : d.amount > 0
                              ? 'bg-[#1E4F91]'
                              : 'bg-[#E2E8F0]'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-6 gap-3 sm:gap-5 text-center">
                  {recent6Months.map((d, i) => (
                    <span
                      key={d.month}
                      className={`text-xs font-bold ${
                        i === recent6Months.length - 1 ? 'text-[#F47B20]' : 'text-[#526581]'
                      }`}
                    >
                      {d.month}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#F5F7FA] flex items-center justify-between text-xs text-[#526581]">
            <span>Total facturé cette année : <strong className="text-[#101828]">{formatFCFA(totalRevenue)}</strong></span>
            <button
              onClick={() => navigate('/reports')}
              className="text-[#1E4F91] font-bold hover:underline cursor-pointer"
            >
              Rapports détaillés →
            </button>
          </div>
        </div>

        {/* Chart 2: Paiements */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#101828]">Paiements</h2>
                <p className="text-xs text-[#526581]">Répartition des encaissements réels</p>
              </div>
              <button
                onClick={() => navigate('/payments')}
                className="text-xs font-bold text-[#1E4F91] hover:underline cursor-pointer"
              >
                Historique →
              </button>
            </div>

            {payments.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-xl bg-[#F5F7FA] border border-dashed border-[#CBD5E1]">
                <Wallet className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <p className="text-sm font-bold text-[#101828]">Aucun paiement enregistré</p>
                <p className="text-xs text-[#526581] max-w-xs mx-auto mt-1 mb-4">
                  Lorsque vos clients effectuent un versement, enregistrez-le pour suivre vos encaissements.
                </p>
                {invoices.length > 0 && (
                  <button
                    onClick={() => navigate('/payments')}
                    className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] cursor-pointer"
                  >
                    + Enregistrer un paiement
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Real Collection Progress Bar */}
                <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-[#101828]">Taux d&apos;encaissement global</span>
                    <span className="text-[#16A34A] font-extrabold">{collectionRate}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#E2E8F0] overflow-hidden flex">
                    <div
                      className="bg-[#16A34A] h-full transition-all duration-500"
                      style={{ width: `${collectionRate}%` }}
                    />
                    <div
                      className="bg-[#F47B20] h-full transition-all duration-500"
                      style={{ width: `${100 - collectionRate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#526581] mt-2">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                      Encaissé : <strong className="text-[#101828]">{formatFCFA(totalCollected)}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F47B20]" />
                      Attente : <strong className="text-[#101828]">{formatFCFA(totalPending)}</strong>
                    </span>
                  </div>
                </div>

                {/* Real Breakdown by Payment Method */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#526581]">Mobile Money (Wave / Orange / MTN)</span>
                      <span className="font-extrabold text-[#101828]">{formatFCFA(mobileMoneyTotal)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F5F7FA] overflow-hidden">
                      <div
                        className="h-full bg-[#F47B20] rounded-full"
                        style={{
                          width: `${totalCollected > 0 ? Math.round((mobileMoneyTotal / totalCollected) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#526581]">Virement Bancaire</span>
                      <span className="font-extrabold text-[#101828]">{formatFCFA(bankTransferTotal)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F5F7FA] overflow-hidden">
                      <div
                        className="h-full bg-[#1E4F91] rounded-full"
                        style={{
                          width: `${totalCollected > 0 ? Math.round((bankTransferTotal / totalCollected) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-[#526581]">Espèces &amp; Autres</span>
                      <span className="font-extrabold text-[#101828]">{formatFCFA(otherPaymentTotal)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F5F7FA] overflow-hidden">
                      <div
                        className="h-full bg-[#16A34A] rounded-full"
                        style={{
                          width: `${totalCollected > 0 ? Math.round((otherPaymentTotal / totalCollected) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#526581]">{payments.length} règlement(s) enregistré(s)</span>
            <button
              onClick={() => navigate('/payments')}
              className="text-xs font-extrabold text-[#F47B20] hover:underline cursor-pointer"
            >
              Gérer les paiements →
            </button>
          </div>
        </div>
      </div>

      {/* Table: Factures récentes — Exact Columns: Numéro | Client | Date | Montant | Statut | Action */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#101828]">Factures récentes</h2>
            <p className="text-xs text-[#526581]">
              Vos factures réelles enregistrées dans votre entreprise
            </p>
          </div>
          {invoices.length > 0 && (
            <button
              onClick={() => navigate('/invoices')}
              className="text-xs font-bold text-[#1E4F91] hover:underline cursor-pointer"
            >
              Voir toutes les factures ({invoices.length}) →
            </button>
          )}
        </div>

        {invoices.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <FileText className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2.5" />
            <h3 className="text-base font-extrabold text-[#101828]">
              Vous n&apos;avez encore aucune facture.
            </h3>
            <p className="text-xs text-[#526581] max-w-sm mx-auto mt-1 mb-5">
              Créez votre première facture en quelques secondes avec notre studio de facturation.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onOpenFastInvoice}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Créer ma première facture
              </button>
              <button
                onClick={() => navigate('/billing')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E4F91]/10 text-[#1E4F91] hover:bg-[#1E4F91]/20 text-xs font-bold cursor-pointer"
              >
                Studio 5 étapes
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FA] text-[11px] font-bold text-[#526581] uppercase tracking-wider border-b border-[#E2E8F0]">
                  <th className="py-3.5 px-6">Numéro</th>
                  <th className="py-3.5 px-6">Client</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Montant</th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {invoices.slice(0, 6).map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                    <td className="py-3.5 px-6 font-extrabold text-[#1E4F91]">{inv.number}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#101828]">{inv.clientName}</div>
                      {inv.clientCompany && (
                        <div className="text-xs text-[#526581]">{inv.clientCompany}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-[#526581]">
                      <div>Émise : {formatDateFr(inv.issueDate)}</div>
                      <div>Échéance : {formatDateFr(inv.dueDate)}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-extrabold text-[#101828]">{formatFCFA(inv.totalTtc)}</div>
                      {inv.remainingAmount > 0 && (
                        <div className="text-[11px] text-[#D97706] font-semibold">
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
                          className="p-2 rounded-lg bg-[#F5F7FA] hover:bg-[#1E4F91] text-[#101828] hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {inv.remainingAmount > 0 && (
                          <button
                            onClick={() => setPaymentInvoice(inv)}
                            title="Enregistrer un paiement"
                            className="p-2 rounded-lg bg-[#DCFCE7] hover:bg-[#16A34A] text-[#15803D] hover:text-white transition-colors cursor-pointer"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleWhatsAppShare(inv)}
                          title="Partager / Relancer sur WhatsApp"
                          className="p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#15803D] hover:text-white transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onSuccess={() => {
            setPaymentInvoice(null);
            reloadData();
          }}
        />
      )}
    </div>
  );
}
