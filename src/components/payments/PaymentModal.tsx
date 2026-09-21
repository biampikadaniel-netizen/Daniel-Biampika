import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { invoicesStorage, paymentsStorage } from '../../services/storage';
import type { Invoice, PaymentMethod } from '../../types';
import { X, CreditCard, DollarSign, Calendar, Check, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onPaymentRecorded: () => void;
}

export function PaymentModal({
  isOpen,
  invoice,
  onClose,
  onPaymentRecorded,
}: PaymentModalProps) {
  const { currentUser } = useAuth();
  if (!isOpen || !currentUser) return null;

  const unpaidInvoices = invoicesStorage
    .getAll(currentUser.id)
    .filter((inv) => inv.status !== 'paid' && inv.remainingAmount > 0);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    invoice ? invoice.id : unpaidInvoices[0]?.id || ''
  );

  const currentInvoice =
    invoicesStorage.getById(currentUser.id, selectedInvoiceId) || invoice || unpaidInvoices[0];

  const [amount, setAmount] = useState<number>(currentInvoice ? currentInvoice.remainingAmount : 0);
  const [method, setMethod] = useState<PaymentMethod>('mobile_money');
  const [reference, setReference] = useState<string>('');
  const [paidAt, setPaidAt] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentInvoice) {
      setAmount(currentInvoice.remainingAmount);
    }
  }, [selectedInvoiceId, currentInvoice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentInvoice) {
      setError('Veuillez sélectionner une facture à encaisser.');
      return;
    }

    if (amount <= 0) {
      setError('Le montant doit être supérieur à 0 FCFA.');
      return;
    }

    if (amount > currentInvoice.remainingAmount) {
      setError(
        `Le montant dépasse le solde restant (${currentInvoice.remainingAmount.toLocaleString('fr-FR')} FCFA).`
      );
      return;
    }

    const res = paymentsStorage.recordPayment(currentUser.id, {
      invoiceId: currentInvoice.id,
      amount,
      paymentMethod: method,
      reference: reference.trim() || undefined,
      notes: notes.trim() || undefined,
      paidAt,
    });

    if (res) {
      onPaymentRecorded();
      onClose();
    } else {
      setError("Erreur lors de l'enregistrement du paiement.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Enregistrer un paiement</h3>
              <p className="text-xs text-slate-500">Mise à jour automatique de la facture et du CA</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Facture selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Facture concernée <span className="text-red-500">*</span>
            </label>
            {unpaidInvoices.length === 0 && !invoice ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                Toutes vos factures sont déjà payées !
              </p>
            ) : (
              <select
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none bg-white"
              >
                {unpaidInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.number} — {inv.clientName} (Reste: {inv.remainingAmount.toLocaleString('fr-FR')} FCFA)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Montant encaissé */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Montant reçu (FCFA) <span className="text-red-500">*</span>
              </label>
              {currentInvoice && (
                <button
                  type="button"
                  onClick={() => setAmount(currentInvoice.remainingAmount)}
                  className="text-[11px] font-bold text-teal-600 hover:underline"
                >
                  Régler la totalité ({currentInvoice.remainingAmount.toLocaleString('fr-FR')} FCFA)
                </button>
              )}
            </div>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-extrabold text-slate-900 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Mode de paiement */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mode de règlement
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none bg-white"
              >
                <option value="mobile_money">📱 Mobile Money (Wave, Orange, MTN, Moov)</option>
                <option value="cash">💵 Espèces (Cash)</option>
                <option value="bank_transfer">🏦 Virement bancaire</option>
                <option value="card">💳 Carte bancaire</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Date de paiement
              </label>
              <input
                type="date"
                required
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Reference transaction */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Référence / ID de transaction
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: WAVE-CI-88210 ou Chèque N° 00412"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!currentInvoice}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              Valider l'encaissement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
