import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { invoicesStorage } from '../../services/storage';
import type { Invoice, InvoiceStatus } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquareShare,
  CreditCard,
  Trash2,
  Calendar,
  AlertCircle,
  Copy,
  Zap,
} from 'lucide-react';

interface InvoicesListProps {
  onOpenFastInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export function InvoicesList({
  onOpenFastInvoice,
  onViewInvoice,
  onRecordPayment,
}: InvoicesListProps) {
  const { currentUser, refreshUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!currentUser) return null;

  const allInvoices = invoicesStorage.getAll(currentUser.id);

  // Filtered invoices
  const filteredInvoices = allInvoices.filter((inv) => {
    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'late') {
        const isLate =
          inv.status === 'late' ||
          (inv.status !== 'paid' && new Date(inv.dueDate).getTime() < Date.now());
        if (!isLate) return false;
      } else if (inv.status !== filterStatus) {
        return false;
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = inv.number.toLowerCase().includes(q);
      const matchClient = inv.clientName.toLowerCase().includes(q);
      const matchCompany = (inv.clientCompany || '').toLowerCase().includes(q);
      if (!matchNumber && !matchClient && !matchCompany) return false;
    }

    return true;
  });

  const handleDelete = (id: string, number: string) => {
    if (window.confirm(`Confirmez-vous la suppression de la facture ${number} ?`)) {
      invoicesStorage.delete(currentUser.id, id);
      refreshUser();
    }
  };

  const handleDuplicate = (inv: Invoice) => {
    const nextNumber = invoicesStorage.getNextNumber(currentUser.id);
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const duplicated = invoicesStorage.add(currentUser.id, {
      number: nextNumber,
      clientId: inv.clientId,
      clientName: inv.clientName,
      clientEmail: inv.clientEmail,
      clientPhone: inv.clientPhone,
      clientCompany: inv.clientCompany,
      clientAddress: inv.clientAddress,
      issueDate: today,
      dueDate: due,
      items: inv.items.map((it) => ({
        ...it,
        id: 'line_' + Math.random().toString(36).substring(2, 7),
      })),
      subtotalHt: inv.subtotalHt,
      totalVat: inv.totalVat,
      discountRate: inv.discountRate,
      totalTtc: inv.totalTtc,
      paidAmount: 0,
      remainingAmount: inv.totalTtc,
      status: 'draft',
      notes: inv.notes,
      terms: inv.terms,
    });

    refreshUser();
    onViewInvoice(duplicated);
  };

  const handleWhatsAppReminder = (inv: Invoice) => {
    const phone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const amount = inv.remainingAmount.toLocaleString('fr-FR');
    const text = encodeURIComponent(
      `Bonjour ${inv.clientName},\n\nVotre facture #${inv.number} d'un montant de ${amount} FCFA émise par ${currentUser.companyName} est en attente de règlement.\n\nMerci de procéder à son règlement au plus vite.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Factures</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos factures émises, suivez les encaissements et les relances clients.
          </p>
        </div>

        <button
          onClick={onOpenFastInvoice}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-md shadow-teal-500/20 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>Nouvelle facture (⚡ &lt; 30s)</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-2xl">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'sent', label: 'Envoyées' },
              { id: 'paid', label: 'Payées' },
              { id: 'late', label: 'En retard' },
              { id: 'draft', label: 'Brouillons' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° ou client..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Table of Invoices */}
        {filteredInvoices.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucune facture trouvée</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {allInvoices.length === 0
                ? 'Créez votre première facture en moins de 30 secondes.'
                : 'Aucune facture ne correspond à vos critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Numéro</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Échéance</th>
                  <th className="py-3 px-3 text-right">Montant TTC</th>
                  <th className="py-3 px-3 text-right">Reste</th>
                  <th className="py-3 px-3 text-center">Statut</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'paid' || inv.remainingAmount <= 0;
                  const isLate =
                    inv.status === 'late' ||
                    (!isPaid && new Date(inv.dueDate).getTime() < Date.now());

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900 font-mono">
                        <button
                          onClick={() => onViewInvoice(inv)}
                          className="hover:text-teal-600 hover:underline cursor-pointer"
                        >
                          {inv.number}
                        </button>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800">{inv.clientName}</p>
                        {inv.clientCompany && (
                          <p className="text-[11px] text-slate-400">{inv.clientCompany}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {new Date(inv.issueDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {new Date(inv.dueDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        {inv.totalTtc.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-amber-700">
                        {inv.remainingAmount.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-center">
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
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewInvoice(inv)}
                            title="Voir &amp; Imprimer PDF"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleWhatsAppReminder(inv)}
                            title="Relancer / Envoyer sur WhatsApp"
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          >
                            <MessageSquareShare className="w-4 h-4" />
                          </button>

                          {!isPaid && (
                            <button
                              onClick={() => onRecordPayment(inv)}
                              title="Enregistrer un paiement"
                              className="px-2 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Encaisser
                            </button>
                          )}

                          <button
                            onClick={() => handleDuplicate(inv)}
                            title="Dupliquer la facture"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(inv.id, inv.number)}
                            title="Supprimer la facture"
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
