import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Invoice, PaymentMethod } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA } from '../../services/storage';

export function PaymentModal({
  invoice,
  onClose,
  onSuccess,
}: {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(invoice.remainingAmount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile_money');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paidAt, setPaidAt] = useState(() => new Date().toISOString().split('T')[0]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    workspaceService.recordPayment(user.id, {
      invoiceId: invoice.id,
      amount: Number(amount) || 0,
      paymentMethod,
      reference,
      notes,
      paidAt,
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 bg-[#1E4F91] text-white flex items-center justify-between">
          <h2 className="text-base font-extrabold">
            Encaisser sur {invoice.number}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/15 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#526581]">Client :</span>
              <strong className="text-[#101828]">{invoice.clientName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#526581]">Reste à payer :</span>
              <strong className="text-[#F47B20]">{formatFCFA(invoice.remainingAmount)}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101828] mb-1">
              Montant reçu (FCFA) *
            </label>
            <input
              type="number"
              required
              min={1}
              max={invoice.remainingAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-extrabold text-[#15803D]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101828] mb-1">
              Mode de règlement *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold"
            >
              <option value="mobile_money">Mobile Money (Wave / Orange Money / MTN)</option>
              <option value="bank_transfer">Virement bancaire</option>
              <option value="cash">Espèces</option>
              <option value="card">Carte bancaire</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Date</label>
              <input
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Référence TX</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: WAVE-9821"
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#526581] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Valider le paiement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
