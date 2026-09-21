import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { invoicesStorage, paymentsStorage, clientsStorage, productsStorage } from '../../services/storage';
import {
  BarChart3,
  Download,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle2,
  Users,
  Package,
} from 'lucide-react';

export function ReportsView() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const invoices = invoicesStorage.getAll(currentUser.id);
  const payments = paymentsStorage.getAll(currentUser.id);
  const clients = clientsStorage.getAll(currentUser.id);
  const products = productsStorage.getAll(currentUser.id);

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalTtc, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = Math.max(0, totalBilled - totalPaid);
  const recoveryRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 100;

  // Top clients by billed amount
  const clientMap: { [id: string]: { name: string; company?: string; total: number } } = {};
  invoices.forEach((inv) => {
    if (!clientMap[inv.clientId]) {
      clientMap[inv.clientId] = {
        name: inv.clientName,
        company: inv.clientCompany,
        total: 0,
      };
    }
    clientMap[inv.clientId].total += inv.totalTtc;
  });
  const topClients = Object.values(clientMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Top products by quantity sold
  const productMap: { [name: string]: { name: string; count: number; revenue: number } } = {};
  invoices.forEach((inv) => {
    inv.items.forEach((it) => {
      if (!productMap[it.description]) {
        productMap[it.description] = { name: it.description, count: 0, revenue: 0 };
      }
      productMap[it.description].count += it.quantity;
      productMap[it.description].revenue += it.quantity * it.unitPrice;
    });
  });
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // CSV Export
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Numero,Client,Date,Echeance,Total TTC,Paye,Reste,Statut\n';

    invoices.forEach((inv) => {
      const row = [
        inv.number,
        `"${inv.clientName.replace(/"/g, '""')}"`,
        inv.issueDate,
        inv.dueDate,
        inv.totalTtc,
        inv.paidAmount,
        inv.remainingAmount,
        inv.status,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rapport_factures_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rapports &amp; Statistiques
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Indicateurs clés de performance commerciale, recouvrement et ventes.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Chiffre d'affaires</span>
            <TrendingUp className="w-4 h-4 text-[#295294]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2 truncate">
            {totalBilled.toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-medium text-slate-500">FCFA</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{invoices.length} factures générées</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Montant Encaissé
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-2 truncate">
            {totalPaid.toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-medium text-slate-500">FCFA</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{payments.length} encaissements</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Montant en attente
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-2 truncate">
            {totalPending.toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-medium text-slate-500">FCFA</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Reste à recouvrer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Taux de recouvrement
            </span>
            <BarChart3 className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-teal-700 mt-2">{recoveryRate}%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, recoveryRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2 Comparison Tables: Top Clients & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Top 5 Meilleurs Clients
            </h2>
          </div>

          {topClients.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Aucune donnée disponible.</p>
          ) : (
            <div className="space-y-3 pt-2">
              {topClients.map((c, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                      {c.company && <p className="text-[10px] text-slate-400">{c.company}</p>}
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {c.total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              Top 5 Articles les plus vendus
            </h2>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Aucune vente enregistrée.</p>
          ) : (
            <div className="space-y-3 pt-2">
              {topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.count} unités vendues</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {p.revenue.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
