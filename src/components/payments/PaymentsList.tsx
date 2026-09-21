import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { paymentsStorage, invoicesStorage } from '../../services/storage';
import type { Payment, Invoice } from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Calendar,
  Smartphone,
  Banknote,
  Building,
  Eye,
} from 'lucide-react';

interface PaymentsListProps {
  onOpenRecordPayment: () => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export function PaymentsList({ onOpenRecordPayment, onViewInvoice }: PaymentsListProps) {
  const { currentUser, refreshUser } = useAuth();
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!currentUser) return null;

  const payments = paymentsStorage.getAll(currentUser.id);
  const invoices = invoicesStorage.getAll(currentUser.id);

  const filtered = payments.filter((p) => {
    if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchClient = (p.clientName || '').toLowerCase().includes(q);
      const matchInv = (p.invoiceNumber || '').toLowerCase().includes(q);
      const matchRef = (p.reference || '').toLowerCase().includes(q);
      if (!matchClient && !matchInv && !matchRef) return false;
    }
    return true;
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous annuler cet encaissement ? Le solde de la facture sera réajusté.')) {
      paymentsStorage.delete(currentUser.id, id);
      refreshUser();
    }
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'mobile_money':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            <Smartphone className="w-3 h-3" /> Mobile Money
          </span>
        );
      case 'cash':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <Banknote className="w-3 h-3" /> Espèces
          </span>
        );
      case 'bank_transfer':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
            <Building className="w-3 h-3" /> Virement
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            <CreditCard className="w-3 h-3" /> Carte / Autre
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Paiements</h1>
          <p className="text-sm text-slate-500 mt-1">
            Journal de tous les encaissements perçus par Mobile Money, virement et espèces.
          </p>
        </div>

        <button
          onClick={onOpenRecordPayment}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un paiement</span>
        </button>
      </div>

      {/* Top Banner Total Collected */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Total des encaissements enregistrés
          </span>
          <p className="text-2xl sm:text-3xl font-black mt-1">
            {totalCollected.toLocaleString('fr-FR')}{' '}
            <span className="text-base font-medium text-emerald-200">FCFA</span>
          </p>
        </div>
        <div className="text-xs text-emerald-100 bg-white/10 px-4 py-2 rounded-2xl border border-white/15">
          {payments.length} transaction{payments.length > 1 ? 's' : ''} validée{payments.length > 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-2xl flex-wrap">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'mobile_money', label: 'Mobile Money' },
              { id: 'cash', label: 'Espèces' },
              { id: 'bank_transfer', label: 'Virement' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMethodFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  methodFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par client, facture ou réf..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucun paiement enregistré</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Dès qu'un client règle une facture, enregistrez le paiement ici pour solder la facture.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Facture liée</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3">Référence</th>
                  <th className="py-3 px-3 text-right">Montant</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => {
                  const linkedInvoice = invoices.find((inv) => inv.id === p.invoiceId);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 text-slate-500">
                        {new Date(p.paidAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{p.clientName}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-teal-700">
                        {linkedInvoice ? (
                          <button
                            onClick={() => onViewInvoice(linkedInvoice)}
                            className="hover:underline cursor-pointer"
                          >
                            {p.invoiceNumber}
                          </button>
                        ) : (
                          p.invoiceNumber
                        )}
                      </td>
                      <td className="py-3.5 px-3">{getMethodBadge(p.paymentMethod)}</td>
                      <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                        {p.reference || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-emerald-600 text-sm">
                        +{p.amount.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {linkedInvoice && (
                            <button
                              onClick={() => onViewInvoice(linkedInvoice)}
                              title="Voir la facture"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(p.id)}
                            title="Annuler ce paiement"
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 cursor-pointer"
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
