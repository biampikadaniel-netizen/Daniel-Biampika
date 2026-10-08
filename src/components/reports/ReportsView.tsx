import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  PackageCheck,
  Download,
  Wallet,
  FileText,
  Inbox,
  Plus,
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

  const companyId = user?.companyId || user?.id || '';

  useEffect(() => {
    if (!companyId) return;
    setInvoices(workspaceService.getInvoices(companyId));
    setClients(workspaceService.getClients(companyId));
    setProducts(workspaceService.getProducts(companyId));
    setPayments(workspaceService.getPayments(companyId));
  }, [companyId]);

  if (!user) return null;

  const totalRevenue = invoices.reduce((s, i) => s + (Number(i.totalTtc) || 0), 0);
  const totalPaid = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const totalPending = invoices.reduce((s, i) => s + (Number(i.remainingAmount) || 0), 0);

  // Real Best Clients Ranking
  const clientRevenueMap = new Map<string, { id: string; name: string; company?: string; count: number; amount: number }>();
  invoices.forEach((inv) => {
    const existing = clientRevenueMap.get(inv.clientId) || {
      id: inv.clientId,
      name: inv.clientName,
      company: inv.clientCompany,
      count: 0,
      amount: 0,
    };
    existing.count += 1;
    existing.amount += Number(inv.totalTtc) || 0;
    clientRevenueMap.set(inv.clientId, existing);
  });
  const topClients = Array.from(clientRevenueMap.values()).sort((a, b) => b.amount - a.amount);

  // Real Top Selling Products/Services Ranking
  const productSalesMap = new Map<string, { name: string; qty: number; revenue: number }>();
  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const key = item.productId || item.description;
      const existing = productSalesMap.get(key) || {
        name: item.description,
        qty: 0,
        revenue: 0,
      };
      existing.qty += Number(item.quantity) || 0;
      existing.revenue += Number(item.totalHt) || 0;
      productSalesMap.set(key, existing);
    });
  });
  const topProducts = Array.from(productSalesMap.values()).sort((a, b) => b.revenue - a.revenue);

  // Real Monthly Evolution calculated from actual invoice dates & payment dates
  const currentYear = new Date().getFullYear();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const monthlyEvolution = monthNames.map((month, idx) => {
    let ca = 0;
    let encaisse = 0;

    invoices.forEach((inv) => {
      if (inv.issueDate) {
        const d = new Date(inv.issueDate);
        if (!isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === idx) {
          ca += Number(inv.totalTtc) || 0;
        }
      }
    });

    payments.forEach((pay) => {
      if (pay.paidAt) {
        const d = new Date(pay.paidAt);
        if (!isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === idx) {
          encaisse += Number(pay.amount) || 0;
        }
      }
    });

    return { month, ca, encaisse };
  });

  const hasAnyData = totalRevenue > 0 || totalPaid > 0;
  const maxMonthVal = Math.max(...monthlyEvolution.map((m) => Math.max(m.ca, m.encaisse)), 1);

  const handleExportReport = () => {
    const headers = ['Mois', 'Chiffre d Affaires TTC FCFA', 'Montant Encaisse FCFA'];
    const rows = monthlyEvolution.map((m) => `"${m.month}";${m.ca};${m.encaisse}`);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `rapport_financier_faktelio_${currentYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Analyses &amp; Rapports Financiers
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Chiffre d&apos;affaires, ventes réelles, encaissements et palmarès des ventes de votre entreprise.
          </p>
        </div>

        {hasAnyData && (
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E4F91] hover:bg-[#163C70] text-white text-xs font-bold cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter le rapport CSV ({currentYear})
          </button>
        )}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#526581] uppercase">Chiffre d&apos;affaires</span>
            <TrendingUp className="w-4 h-4 text-[#1E4F91]" />
          </div>
          <p className="text-xl font-extrabold text-[#101828]">{formatFCFA(totalRevenue)}</p>
          <p className="text-[11px] text-[#526581] mt-1">{invoices.length} facture(s)</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#526581] uppercase">Paiements encaissés</span>
            <Wallet className="w-4 h-4 text-[#16A34A]" />
          </div>
          <p className="text-xl font-extrabold text-[#15803D]">{formatFCFA(totalPaid)}</p>
          <p className="text-[11px] text-[#526581] mt-1">{payments.length} règlement(s)</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#526581] uppercase">Reste à recouvrer</span>
            <BarChart3 className="w-4 h-4 text-[#F47B20]" />
          </div>
          <p className="text-xl font-extrabold text-[#F47B20]">{formatFCFA(totalPending)}</p>
          <p className="text-[11px] text-[#526581] mt-1">
            {invoices.filter((i) => i.remainingAmount > 0).length} en attente
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#526581] uppercase">Base clients &amp; catalogue</span>
            <FileText className="w-4 h-4 text-[#1E4F91]" />
          </div>
          <p className="text-xl font-extrabold text-[#101828]">
            {clients.length} client(s) • {products.length} article(s)
          </p>
          <p className="text-[11px] text-[#526581] mt-1">Actifs dans votre entreprise</p>
        </div>
      </div>

      {!hasAnyData ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E2E8F0] text-center">
          <Inbox className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-[#101828]">Pas encore de données</h2>
          <p className="text-sm text-[#526581] max-w-md mx-auto mt-1 mb-6">
            Créez votre première facture pour commencer à suivre votre activité et générer des graphiques financiers réels.
          </p>
          <button
            onClick={() => navigate('/billing')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer ma première facture
          </button>
        </div>
      ) : (
        <>
          {/* Monthly Evolution Comparative Chart */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-base font-extrabold text-[#101828]">
                  Évolution mensuelle ({currentYear}) : Ventes vs Encaissements
                </h2>
                <p className="text-xs text-[#526581]">
                  Calculé strictement depuis vos vraies factures et paiements enregistrés
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 text-[#1E4F91]">
                  <span className="w-3 h-3 rounded-xs bg-[#1E4F91]" /> Facturé TTC
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#F47B20]">
                  <span className="w-3 h-3 rounded-xs bg-[#F47B20]" /> Encaissé
                </span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-end h-52 pt-6 px-2 border-b border-[#E2E8F0]">
              {monthlyEvolution.map((m) => {
                const hCa = m.ca > 0 ? Math.max(10, Math.round((m.ca / maxMonthVal) * 100)) : 3;
                const hEnc = m.encaisse > 0 ? Math.max(10, Math.round((m.encaisse / maxMonthVal) * 100)) : 3;
                return (
                  <div key={m.month} className="flex flex-col items-center h-full justify-end gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${hCa}%` }}
                        className={`w-3 sm:w-5 rounded-t-md transition-all ${
                          m.ca > 0 ? 'bg-[#1E4F91]' : 'bg-[#E2E8F0]'
                        }`}
                        title={`Facturé en ${m.month} : ${formatFCFA(m.ca)}`}
                      />
                      <div
                        style={{ height: `${hEnc}%` }}
                        className={`w-3 sm:w-5 rounded-t-md transition-all ${
                          m.encaisse > 0 ? 'bg-[#F47B20]' : 'bg-[#CBD5E1]'
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
                  <p className="text-[10px] sm:text-xs font-bold text-[#101828] truncate">
                    {m.month.slice(0, 3)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Best Clients & Top Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meilleurs clients */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#F47B20]" />
                <h2 className="text-base font-extrabold text-[#101828]">Meilleurs clients</h2>
              </div>
              {topClients.length === 0 ? (
                <p className="text-xs text-[#526581] py-4 text-center">
                  Aucun client facturé pour l&apos;instant.
                </p>
              ) : (
                <div className="space-y-3">
                  {topClients.slice(0, 5).map((c, idx) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#1E4F91] text-white text-xs font-extrabold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-extrabold text-[#101828]">{c.name}</p>
                          <p className="text-xs text-[#526581]">
                            {c.company ? `${c.company} • ` : ''}
                            {c.count} facture(s)
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#1E4F91]">
                        {formatFCFA(c.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Produits les plus vendus */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <PackageCheck className="w-5 h-5 text-[#1E4F91]" />
                <h2 className="text-base font-extrabold text-[#101828]">
                  Produits &amp; Services les plus vendus
                </h2>
              </div>
              {topProducts.length === 0 ? (
                <p className="text-xs text-[#526581] py-4 text-center">
                  Aucun article facturé pour l&apos;instant.
                </p>
              ) : (
                <div className="space-y-3">
                  {topProducts.slice(0, 5).map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#F47B20] text-white text-xs font-extrabold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-extrabold text-[#101828]">{p.name}</p>
                          <p className="text-xs text-[#526581]">{p.qty} unité(s) facturée(s)</p>
                        </div>
                      </div>
                      <span className="text-sm font-extrabold text-[#101828]">
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
