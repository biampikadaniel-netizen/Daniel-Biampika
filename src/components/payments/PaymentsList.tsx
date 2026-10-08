import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle2, Clock, AlertTriangle, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA, formatDateFr } from '../../services/storage';
import { Payment, Invoice } from '../../types';
import { PaymentModal } from './PaymentModal';

export function PaymentsList() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);

  const loadData = () => {
    if (!user) return;
    setPayments(workspaceService.getPayments(user.id));
    setInvoices(workspaceService.getInvoices(user.id));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!user) return null;

  const unpaidInvoices = invoices.filter((i) => i.remainingAmount > 0 && i.status !== 'draft');

  const methodLabels: Record<Payment['paymentMethod'], string> = {
    mobile_money: 'Mobile Money (Wave / Orange / MTN)',
    bank_transfer: 'Virement Bancaire',
    cash: 'Espèces',
    card: 'Carte Bancaire',
    other: 'Autre',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Suivi des Paiements &amp; Encaissements FAKTELIO
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Suivez l&apos;état de chaque facture : Payé, Partiellement payé, Impayé ou En attente.
          </p>
        </div>

        {unpaidInvoices.length > 0 && (
          <button
            onClick={() => setSelectedInvoiceForPayment(unpaidInvoices[0])}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Enregistrer un paiement
          </button>
        )}
      </div>

      {/* 4 Status Cards (Payé, Partiellement payé, Impayé / En retard, En attente) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-[#15803D]">Payé</span>
            <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
          </div>
          <p className="text-xl font-extrabold text-[#101828]">
            {invoices.filter((i) => i.status === 'paid').length} facture(s)
          </p>
          <p className="text-xs text-[#526581] mt-1">
            Total encaissé : {formatFCFA(invoices.reduce((s, i) => s + i.paidAmount, 0))}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-[#B45309]">
              Partiellement payé
            </span>
            <Wallet className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <p className="text-xl font-extrabold text-[#101828]">
            {invoices.filter((i) => i.status === 'partial').length} facture(s)
          </p>
          <p className="text-xs text-[#526581] mt-1">Acomptes enregistrés</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-[#DC2626]">
              Impayé / En retard
            </span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <p className="text-xl font-extrabold text-[#101828]">
            {invoices.filter((i) => i.status === 'late').length} facture(s)
          </p>
          <p className="text-xs text-[#526581] mt-1">Échéance dépassée</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold uppercase text-[#1E4F91]">En attente</span>
            <Clock className="w-4 h-4 text-[#1E4F91]" />
          </div>
          <p className="text-xl font-extrabold text-[#101828]">
            {invoices.filter((i) => i.status === 'sent').length} facture(s)
          </p>
          <p className="text-xs text-[#526581] mt-1">
            Reste global : {formatFCFA(invoices.reduce((s, i) => s + i.remainingAmount, 0))}
          </p>
        </div>
      </div>

      {/* Invoices awaiting payment */}
      {unpaidInvoices.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
          <h2 className="text-base font-extrabold text-[#101828]">
            Factures en attente d&apos;encaissement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unpaidInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-extrabold text-[#1E4F91]">
                    {inv.number} — {inv.clientName}
                  </p>
                  <p className="text-xs text-[#526581]">
                    Reste à régler : <strong className="text-[#F47B20]">{formatFCFA(inv.remainingAmount)}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInvoiceForPayment(inv)}
                  className="px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-extrabold cursor-pointer"
                >
                  Encaisser
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recorded Payments Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-extrabold text-[#101828]">
            Journal des paiements enregistrés ({payments.length})
          </h2>
        </div>
        {payments.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <Wallet className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2.5" />
            <h3 className="text-base font-extrabold text-[#101828]">
              Aucun paiement enregistré pour l&apos;instant.
            </h3>
            <p className="text-xs text-[#526581] max-w-sm mx-auto mt-1">
              Dès qu&apos;un client règle une facture, enregistrez son règlement pour mettre à jour vos encaissements et vos graphiques.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[11px] font-bold text-[#526581] uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5">N° Facture</th>
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-5">Mode de paiement</th>
                <th className="py-3.5 px-5">Référence</th>
                <th className="py-3.5 px-5 text-right">Montant encaissé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#F5F7FA]/60">
                  <td className="py-3.5 px-5 text-xs text-[#526581]">{formatDateFr(p.paidAt)}</td>
                  <td className="py-3.5 px-5 font-extrabold text-[#1E4F91]">{p.invoiceNumber}</td>
                  <td className="py-3.5 px-5 font-bold text-[#101828]">{p.clientName}</td>
                  <td className="py-3.5 px-5 text-xs font-semibold text-[#526581]">
                    {methodLabels[p.paymentMethod]}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-[#526581]">
                    {p.reference || '—'}
                  </td>
                  <td className="py-3.5 px-5 text-right font-extrabold text-[#15803D]">
                    +{formatFCFA(p.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

      {selectedInvoiceForPayment && (
        <PaymentModal
          invoice={selectedInvoiceForPayment}
          onClose={() => setSelectedInvoiceForPayment(null)}
          onSuccess={() => {
            setSelectedInvoiceForPayment(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
