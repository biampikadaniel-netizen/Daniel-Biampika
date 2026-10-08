import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Wallet,
  FileText,
  BarChart3,
  Award,
  PackageCheck,
  Download,
  Plus,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { workspaceService, formatFCFA } from '../../services/storage';
import { Invoice, Client, Product, Payment } from '../../types';

export function ReportsView() {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (user) {
      setInvoices(workspaceService.getInvoices(user.id));
      setClients(workspaceService.getClients(user.id));
      setProducts(workspaceService.getProducts(user.id));
      setPayments(workspaceService.getPayments(user.id));
    }
  }, [user]);

  if (!user) return null;

  const currentYear = new Date().getFullYear();

  // 1. Total Metrics strictly computed from real records
  const totalRevenue = invoices.reduce((s, i) => s + (Number(i.totalTtc) || 0), 0);
  const totalPaid = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const totalPending = invoices.reduce((s, i) => s + (Number(i.remainingAmount) || 0), 0);

  // 2. Real Monthly Comparison Data (12 months of current year)
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const monthlyEvolution = monthNames.map((month, idx) => {
    const ca = invoices
      .filter((inv) => {
        const d = new Date(inv.issueDate);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === idx;
      })
      .reduce((s, inv) => s + (Number(inv.totalTtc) || 0), 0);

    const encaisse = payments
      .filter((pay) => {
        const d = new Date(pay.paidAt);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === idx;
      })
      .reduce((s, pay) => s + (Number(pay.amount) || 0), 0);

    return { month, ca, encaisse };
  });

  const maxMonthVal = Math.max(
    ...monthlyEvolution.map((m) => Math.max(m.ca, m.encaisse)),
    1
  );

  // 3. Meilleurs clients classés par chiffre d'affaires réel
  const clientRevenueMap: Record<string, { name: string; company?: string; amount: number; count: number }> = {};
  invoices.forEach((inv) => {
    if (!clientRevenueMap[inv.clientId]) {
      clientRevenueMap[inv.clientId] = {
        name: inv.clientName,
        company: inv.clientCompany,
        amount: 0,
        count: 0,
      };
    }
    clientRevenueMap[inv.clientId].amount += Number(inv.totalTtc) || 0;
    clientRevenueMap[inv.clientId].count += 1;
  });

  const topClients = Object.entries(clientRevenueMap)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.amount - a.amount);

  // 4. Produits / Services les plus vendus
  const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const key = item.productId || item.description;
      if (!productSalesMap[key]) {
        productSalesMap[key] = {
          name: item.description,
          qty: 0,
          revenue: 0,
        };
      }
      productSalesMap[key].qty += Number(item.quantity) || 0;
      productSalesMap[key].revenue += Number(item.totalHt) || 0;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

  const hasAnyData = invoices.length > 0 || payments.length > 0;

  const handleExportReport = () => {
    const csvContent =
      'Mois;Chiffre d’affaires facturé TTC;Montant encaissé\n' +
      monthlyEvolution.map((m) => `${m.month};${m.ca};${m.encaisse}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FAKTELIO_Rapport_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D9E7E3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#10241D] tracking-tight">
            Analyses &amp; Rapports Financiers
          </h1>
          <p className="text-xs sm:text-sm text-[#4A635A] mt-0.5">
            Chiffre d&apos;affaires, ventes réelles, encaissements et palmarès des ventes de votre entreprise.
          </p>
        </div>

        {hasAnyData && (
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#215C46] hover:bg-[#1A4937] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-[#D9E7E3]" />
            Exporter le rapport CSV ({currentYear})
          </button>
        )}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D9E7E3] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4A635A] uppercase">Chiffre d&apos;affaires</span>
            <TrendingUp className="w-4 h-4 text-[#215C46]" />
          </div>
          <p className="text-xl font-extrabold text-[#10241D]">{formatFCFA(totalRevenue)}</p>
          <p className="text-[11px] text-[#4A635A] mt-1">{invoices.length} facture(s)</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#D9E7E3] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4A635A] uppercase">Paiements encaissés</span>
            <Wallet className="w-4 h-4 text-[#215C46]" />
          </div>
          <p className="text-xl font-extrabold text-[#215C46]">{formatFCFA(totalPaid)}</p>
          <p className="text-[11px] text-[#4A635A] mt-1">{payments.length} règlement(s)</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#D9E7E3] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4A635A] uppercase">Reste à recouvrer</span>
            <BarChart3 className="w-4 h-4 text-[#123A2C]" />
          </div>
          <p className="text-xl font-extrabold text-[#123A2C]">{formatFCFA(totalPending)}</p>
          <p className="text-[11px] text-[#4A635A] mt-1">
            {invoices.filter((i) => i.remainingAmount > 0).length} en attente
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#D9E7E3] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4A635A] uppercase">Base clients &amp; catalogue</span>
            <FileText className="w-4 h-4 text-[#215C46]" />
          </div>
          <p className="text-xl font-extrabold text-[#10241D]">
            {clients.length} client(s) • {products.length} article(s)
          </p>
          <p className="text-[11px] text-[#4A635A] mt-1">Actifs dans votre entreprise</p>
        </div>
      </div>

      {!hasAnyData ? (
        <div className="bg-white rounded-2xl p-12 border border-[#D9E7E3] text-center shadow-xs">
          <Inbox className="w-12 h-12 text-[#A9BDBC] mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-[#10241D]">Pas encore de données</h2>
          <p className="text-sm text-[#4A635A] max-w-md mx-auto mt-1 mb-6">
            Créez votre première facture pour commencer à suivre votre activité et générer des graphiques financiers réels.
          </p>
          <button
            onClick={() => navigate('/billing')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D9E7E3]" />
            Créer ma première facture
          </button>
        </div>
      ) : (
        <>
          {/* Monthly Evolution Comparative Chart — Oceanic Green & Translucent Mint */}
          <div className="bg-white rounded-2xl p-6 border border-[#D9E7E3] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-base font-extrabold text-[#10241D]">
                  Évolution mensuelle ({currentYear}) : Ventes vs Encaissements
                </h2>
                <p className="text-xs text-[#4A635A]">
                  Calculé strictement depuis vos vraies factures et paiements enregistrés
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 text-[#215C46]">
                  <span className="w-3 h-3 rounded-xs bg-[#215C46]" /> Facturé TTC
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#123A2C]">
                  <span className="w-3 h-3 rounded-xs bg-[#A9BDBC]" /> Encaissé
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-end h-52 pt-6 px-2 border-b border-[#D9E7E3]">
              {monthlyEvolution.map((m) => {
                const hCa = m.ca > 0 ? Math.max(10, Math.round((m.ca / maxMonthVal) * 100)) : 3;
                const hEnc = m.encaisse > 0 ? Math.max(10, Math.round((m.encaisse / maxMonthVal) * 100)) : 3;
                return (
                  <div key={m.month} className="flex flex-col items-center h-full justify-end gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${hCa}%` }}
                        className={`w-3 sm:w-5 rounded-t-md transition-all duration-500 ${
                          m.ca > 0 ? 'bg-[#215C46]' : 'bg-[#D9E7E3]/60'
                        }`}
                        title={`Facturé en ${m.month} : ${formatFCFA(m.ca)}`}
                      />
                      <div
                        style={{ height: `${hEnc}%` }}
                        className={`w-3 sm:w-5 rounded-t-md transition-all duration-500 ${
                          m.encaisse > 0 ? 'bg-[#A9BDBC]' : 'bg-[#D9E7E3]/30'
                        }`}
                        title={`Encaissé en ${m.month} : ${formatFCFA(m.encaisse)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-12 gap-2 sm:gap-4 pt-2.5 text-center">
              {monthlyEvolution.map((m) => (
                <div key={m.month}>
                  <p className="text-[10px] sm:text-xs font-bold text-[#10241D] truncate">
                    {m.month.slice(0, 3)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Clients & Top Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meilleurs clients */}
            <div className="bg-white rounded-2xl p-6 border border-[#D9E7E3] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#215C46]" />
                <h2 className="text-base font-extrabold text-[#10241D]">Meilleurs clients</h2>
              </div>
              {topClients.length === 0 ? (
                <p className="text-xs text-[#4A635A] py-4 text-center">
                  Aucun client facturé pour l&apos;instant.
                </p>
              ) : (
                <div className="space-y-3">
                  {topClients.slice(0, 5).map((c, idx) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#D9E7E3] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#215C46] text-white text-xs font-extrabold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-extrabold text-[#10241D]">{c.name}</p>
                          <p className="text-xs text-[#4A635A]">
                            {c.company ? `${c.company} • ` : ''}
                            {c.count} facture(s)
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#215C46]">
                        {formatFCFA(c.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Produits les plus vendus */}
            <div className="bg-white rounded-2xl p-6 border border-[#D9E7E3] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <PackageCheck className="w-5 h-5 text-[#123A2C]" />
                <h2 className="text-base font-extrabold text-[#10241D]">
                  Produits &amp; Services les plus vendus
                </h2>
              </div>
              {topProducts.length === 0 ? (
                <p className="text-xs text-[#4A635A] py-4 text-center">
                  Aucun article facturé pour l&apos;instant.
                </p>
              ) : (
                <div className="space-y-3">
                  {topProducts.slice(0, 5).map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#D9E7E3] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#123A2C] text-white text-xs font-extrabold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-extrabold text-[#10241D]">{p.name}</p>
                          <p className="text-xs text-[#4A635A]">{p.qty} unité(s) facturée(s)</p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#10241D]">
                        {formatFCFA(p.revenue)} HT
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
