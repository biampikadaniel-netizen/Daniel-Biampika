import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Invoice, PaymentMethod } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA } from '../../services/storage';

export function PaymentModal({
  invoice,
  onClose,
  onSuccess,
  onPaymentSaved,
}: {
  invoice: Invoice;
  onClose: () => void;
  onSuccess?: () => void;
  onPaymentSaved?: () => void;
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
    onSuccess?.();
    onPaymentSaved?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D2B21]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#D9E7E3] overflow-hidden">
        <div className="px-6 py-4 bg-[#0D2B21] text-white flex items-center justify-between border-b border-[#123A2C]">
          <h2 className="text-base font-extrabold">
            Encaisser sur {invoice.number}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/15 cursor-pointer text-[#A9BDBC] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#D9E7E3] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#4A635A]">Client :</span>
              <strong className="text-[#10241D]">{invoice.clientName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A635A]">Reste à payer :</span>
              <strong className="text-[#215C46]">{formatFCFA(invoice.remainingAmount)}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#10241D] mb-1">
              Montant reçu (FCFA) *
            </label>
            <input
              type="number"
              required
              min={1}
              max={invoice.remainingAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46] text-sm font-extrabold text-[#215C46]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#10241D] mb-1">
              Mode de règlement *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46] text-sm font-semibold text-[#10241D]"
            >
              <option value="mobile_money">Mobile Money (Wave / Orange Money / MTN)</option>
              <option value="bank_transfer">Virement bancaire</option>
              <option value="cash">Espèces</option>
              <option value="card">Carte bancaire</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Date</label>
              <input
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46] text-xs text-[#10241D]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Référence TX</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: WAVE-9821"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46] text-xs text-[#10241D]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D9E7E3] text-xs font-bold text-[#4A635A] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-xs font-extrabold shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D9E7E3]" />
              Valider le paiement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
