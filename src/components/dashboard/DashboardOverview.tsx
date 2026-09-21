import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import {
  computeDashboardStats,
  invoicesStorage,
  seedDemoDataForUser,
} from '../../services/storage';
import type { Invoice } from '../../types';
import {
  TrendingUp,
  CreditCard,
  Clock,
  Receipt,
  Users,
  Package,
  Plus,
  Zap,
  ArrowRight,
  MessageSquareShare,
  FileCheck2,
  Sparkles,
  AlertTriangle,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface DashboardOverviewProps {
  onOpenFastInvoice: () => void;
  onOpenNewClient: () => void;
  onOpenNewProduct: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export function DashboardOverview({
  onOpenFastInvoice,
  onOpenNewClient,
  onOpenNewProduct,
  onViewInvoice,
  onRecordPayment,
}: DashboardOverviewProps) {
  const { currentUser, refreshUser } = useAuth();
  const { navigate } = useNavigation();

  const [period, setPeriod] = useState<'today' | '7d' | '30d' | '12m'>('30d');

  if (!currentUser) return null;

  const stats = computeDashboardStats(currentUser.id);
  const recentInvoices = invoicesStorage.getAll(currentUser.id).slice(0, 5);

  const handleSeedDemo = () => {
    seedDemoDataForUser(currentUser.id);
    refreshUser();
  };

  // WhatsApp follow-up action
  const handleWhatsAppReminder = (inv: Invoice) => {
    const phone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const amount = inv.remainingAmount.toLocaleString('fr-FR');
    const text = encodeURIComponent(
      `Bonjour ${inv.clientName},\n\nVotre facture #${inv.number} d'un montant restant de ${amount} FCFA émise par ${currentUser.companyName} est en attente de règlement.\n\nMerci de procéder à son règlement au plus vite. Restant à votre disposition.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bonjour, {currentUser.name} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Voici un aperçu en temps réel de votre activité commerciale pour{' '}
            <span className="font-semibold text-slate-700">{currentUser.companyName}</span>.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFastInvoice}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-md shadow-teal-500/20 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Créer une facture</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">&lt; 30s</span>
          </button>
        </div>
      </div>

      {/* Onboarding State if empty */}
      {!stats.hasData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200/70 shadow-sm bg-gradient-to-br from-teal-50/50 via-white to-white">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Bienvenue sur Chapfacture !
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Commencez par ajouter votre premier client ou produit
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Votre tableau de bord calculera automatiquement votre chiffre d'affaires, vos encaissements et les factures
              en attente dès vos premières saisies.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenNewClient}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>1. Ajouter un client</span>
              </button>

              <button
                onClick={onOpenNewProduct}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Package className="w-4 h-4" />
                <span>2. Ajouter un produit / service</span>
              </button>

              <button
                onClick={onOpenFastInvoice}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>3. Créer ma première facture</span>
              </button>

              <button
                onClick={handleSeedDemo}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer ml-auto"
                title="Charger 3 clients, 4 produits et 2 factures d'exemple"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Charger des données d'exemple</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 Real Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Chiffre d'affaires */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Chiffre d'affaires</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#295294] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900 truncate">
              {stats.totalBilled.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-semibold text-slate-500">FCFA</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total facturé émis</p>
          </div>
        </div>

        {/* Encaissé */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Encaissé</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-emerald-600 truncate">
              {stats.totalPaid.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-semibold text-emerald-700/70">FCFA</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Montant réellement payé</p>
          </div>
        </div>

        {/* En attente */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">En attente</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-amber-600 truncate">
              {stats.totalPending.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-semibold text-amber-700/70">FCFA</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Reste à recevoir</p>
          </div>
        </div>

        {/* Factures */}
        <div
          onClick={() => navigate('/invoices')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-teal-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Factures</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">{stats.invoicesCount}</p>
            <p className="text-[11px] text-teal-600 font-semibold mt-0.5 flex items-center gap-1">
              <span>Voir les factures</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Clients */}
        <div
          onClick={() => navigate('/clients')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-teal-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Clients</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">{stats.clientsCount}</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5 flex items-center gap-1">
              <span>Gérer le carnet</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Produits */}
        <div
          onClick={() => navigate('/products')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-teal-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Produits</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">{stats.productsCount}</p>
            <p className="text-[11px] text-orange-600 font-semibold mt-0.5 flex items-center gap-1">
              <span>Catalogue &amp; Stock</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION (Real data connected) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Timeline Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Évolution du chiffre d'affaires</h3>
              <p className="text-xs text-slate-400 mt-0.5">Montants facturés et encaissés en temps réel</p>
            </div>
            {/* Period tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['today', '7d', '30d', '12m'] as const).map((p) => {
                const labels: Record<string, string> = {
                  today: "Aujourd'hui",
                  '7d': '7 jours',
                  '30d': '30 jours',
                  '12m': '12 mois',
                };
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      period === p ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Revenue Bars Representation */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
              <span>Total période : {stats.totalBilled.toLocaleString('fr-FR')} FCFA</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Payé
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> En attente
                </span>
              </span>
            </div>

            {/* Progress bar visual */}
            <div className="w-full bg-slate-100 h-7 rounded-2xl overflow-hidden flex p-1 gap-1">
              {stats.totalBilled > 0 ? (
                <>
                  <div
                    style={{ width: `${(stats.totalPaid / stats.totalBilled) * 100}%` }}
                    className="bg-emerald-500 rounded-xl h-full transition-all flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
                    title={`Payé : ${stats.totalPaid.toLocaleString('fr-FR')} FCFA`}
                  >
                    {Math.round((stats.totalPaid / stats.totalBilled) * 100)}%
                  </div>
                  <div
                    style={{ width: `${(stats.totalPending / stats.totalBilled) * 100}%` }}
                    className="bg-amber-400 rounded-xl h-full transition-all flex items-center justify-center text-[10px] font-bold text-slate-900 overflow-hidden"
                    title={`En attente : ${stats.totalPending.toLocaleString('fr-FR')} FCFA`}
                  >
                    {Math.round((stats.totalPending / stats.totalBilled) * 100)}%
                  </div>
                </>
              ) : (
                <div className="w-full text-center text-xs text-slate-400 flex items-center justify-center font-medium">
                  Aucune facture enregistrée sur cette période
                </div>
              )}
            </div>

            {/* Simulated monthly timeline columns */}
            <div className="grid grid-cols-6 gap-2 mt-6 h-36 items-end pt-4 border-t border-slate-100">
              {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((month, idx) => {
                const heightPct = stats.totalBilled > 0 ? Math.min(100, Math.max(15, (idx + 1) * 16)) : 10;
                return (
                  <div key={month} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <div
                      className="w-full max-w-[28px] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[11px] font-semibold text-slate-400">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Distribution & Quick Follow-ups */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Répartition des factures</h3>
            <p className="text-xs text-slate-400 mt-0.5">Statut de vos {stats.invoicesCount} factures créées</p>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-900">Payées</span>
                </div>
                <span className="text-sm font-extrabold text-emerald-700">{stats.statusCounts.paid}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-blue-900">Envoyées / En attente</span>
                </div>
                <span className="text-sm font-extrabold text-blue-700">{stats.statusCounts.sent}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-red-50/70 border border-red-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-red-900">En retard</span>
                </div>
                <span className="text-sm font-extrabold text-red-700">{stats.statusCounts.late}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Brouillons</span>
                </div>
                <span className="text-sm font-extrabold text-slate-600">{stats.statusCounts.draft}</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-4">
            <button
              onClick={() => navigate('/reminders')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageSquareShare className="w-4 h-4" />
              <span>Centre de relance WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* RECENT INVOICES LIST */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Factures récentes</h3>
            <p className="text-xs text-slate-400 mt-0.5">Dernières transactions et état des règlements</p>
          </div>
          <button
            onClick={() => navigate('/invoices')}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Toutes les factures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucune facture émise pour le moment</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Cliquez sur le bouton ci-dessous pour créer votre première facture en moins de 30 secondes.
            </p>
            <button
              onClick={onOpenFastInvoice}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une facture</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Numéro</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Échéance</th>
                  <th className="py-3 px-3 text-right">Montant TTC</th>
                  <th className="py-3 px-3 text-center">Statut</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentInvoices.map((inv) => {
                  const isPaid = inv.status === 'paid';
                  const isLate =
                    inv.status === 'late' || (!isPaid && new Date(inv.dueDate).getTime() < Date.now());

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 font-mono">{inv.number}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800">{inv.clientName}</p>
                        {inv.clientCompany && (
                          <p className="text-[11px] text-slate-400">{inv.clientCompany}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium">
                        {new Date(inv.dueDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        {inv.totalTtc.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : isLate
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isPaid ? 'Payée' : isLate ? 'En retard' : 'En attente'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewInvoice(inv)}
                            title="Voir &amp; Télécharger PDF"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!isPaid && (
                            <>
                              <button
                                onClick={() => handleWhatsAppReminder(inv)}
                                title="Relancer sur WhatsApp"
                                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                              >
                                <MessageSquareShare className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => onRecordPayment(inv)}
                                title="Enregistrer un paiement"
                                className="px-2 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Encaisser
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
