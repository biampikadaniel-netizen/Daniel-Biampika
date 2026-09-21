import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { settingsStorage } from '../../services/storage';
import type { Invoice } from '../../types';
import {
  X,
  Printer,
  Download,
  MessageSquareShare,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onRecordPayment: (invoice: Invoice) => void;
}

export function InvoiceDetailModal({ invoice, onClose, onRecordPayment }: InvoiceDetailModalProps) {
  const { currentUser } = useAuth();
  if (!invoice || !currentUser) return null;

  const settings = settingsStorage.getSettings(currentUser.id);
  const isPaid = invoice.status === 'paid' || invoice.remainingAmount <= 0;
  const isLate =
    invoice.status === 'late' || (!isPaid && new Date(invoice.dueDate).getTime() < Date.now());

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const phone = (invoice.clientPhone || '').replace(/[^0-9]/g, '');
    const amount = invoice.totalTtc.toLocaleString('fr-FR');
    const remaining = invoice.remainingAmount.toLocaleString('fr-FR');

    let text = `Bonjour ${invoice.clientName},\n\nVoici votre facture #${invoice.number} d'un montant de ${amount} FCFA émise par *${settings.name}*.\n`;
    if (isPaid) {
      text += `Cette facture a été intégralement réglée avec succès. Merci pour votre fidélité !\n`;
    } else {
      text += `Reste à régler : *${remaining} FCFA* avant le ${new Date(invoice.dueDate).toLocaleDateString(
        'fr-FR'
      )}.\nMerci de procéder à son règlement.\n`;
    }
    if (settings.phone) {
      text += `Contact : ${settings.phone}`;
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:m-0 print:w-full">
        {/* Modal Toolbar (Hidden during print) */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aperçu Facture</span>
            <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-mono text-xs font-bold">
              {invoice.number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <MessageSquareShare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {!isPaid && (
              <button
                onClick={() => {
                  onRecordPayment(invoice);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Encaisser</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="p-8 sm:p-10 overflow-y-auto bg-white print:p-8 text-slate-800 space-y-8">
          {/* Header Row: Company Info & Invoice Info */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <img src="/icon.svg" alt="Logo" className="w-8 h-8 object-contain" />
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{settings.name}</h2>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                {settings.address}
                {settings.city && `, ${settings.city}`}
                <br />
                Tél : {settings.phone || currentUser.phone}
                <br />
                Email : {settings.email || currentUser.email}
                {settings.taxNumber && (
                  <>
                    <br />
                    NIF / RCCM : {settings.taxNumber}
                  </>
                )}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block">
                <span className="text-2xl sm:text-3xl font-black text-[#295294] tracking-tight uppercase block">
                  FACTURE
                </span>
                <span className="font-mono text-sm font-bold text-slate-600 mt-1 block">
                  N° {invoice.number}
                </span>

                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isLate
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {isPaid ? 'PAYÉE' : isLate ? 'EN RETARD' : 'EN ATTENTE DE PAIEMENT'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Client & Date Meta Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Facturé à :
              </span>
              <p className="font-extrabold text-slate-900 text-sm">{invoice.clientName}</p>
              {invoice.clientCompany && (
                <p className="text-xs font-semibold text-slate-600">{invoice.clientCompany}</p>
              )}
              {invoice.clientAddress && <p className="text-xs text-slate-500 mt-0.5">{invoice.clientAddress}</p>}
              {invoice.clientPhone && <p className="text-xs text-slate-500 mt-0.5">Tél : {invoice.clientPhone}</p>}
              {invoice.clientEmail && <p className="text-xs text-slate-500">{invoice.clientEmail}</p>}
            </div>

            <div className="space-y-1.5 text-xs sm:text-right">
              <div>
                <span className="text-slate-400 font-medium">Date d'émission : </span>
                <span className="font-bold text-slate-800">
                  {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Date d'échéance : </span>
                <span className="font-bold text-slate-800">
                  {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Mode de paiement : </span>
                <span className="font-bold text-slate-800">{invoice.paymentMethod || 'Virement / Mobile Money'}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-2.5 px-2">Désignation</th>
                  <th className="py-2.5 px-2 text-center">Qté</th>
                  <th className="py-2.5 px-2 text-right">Prix Unitaire</th>
                  <th className="py-2.5 px-2 text-center">TVA</th>
                  <th className="py-2.5 px-2 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="py-3 px-2 text-right font-medium text-slate-700">
                      {item.unitPrice.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3 px-2 text-center text-slate-500">{item.vatRate}%</td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900">
                      {(item.quantity * item.unitPrice).toLocaleString('fr-FR')} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Totals */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 max-w-sm space-y-1">
              {invoice.notes && (
                <div>
                  <span className="font-bold text-slate-700">Notes : </span>
                  <p className="mt-0.5 italic">{invoice.notes}</p>
                </div>
              )}
              <div className="pt-2">
                <span className="font-bold text-slate-700">Conditions : </span>
                <p className="mt-0.5">{invoice.terms || settings.paymentTerms}</p>
              </div>
            </div>

            <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total HT :</span>
                <span className="font-bold text-slate-900">
                  {invoice.subtotalHt.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              {invoice.discountRate > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Remise ({invoice.discountRate}%) :</span>
                  <span className="font-bold">
                    -{Math.round((invoice.subtotalHt * invoice.discountRate) / 100).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>TVA :</span>
                <span className="font-bold text-slate-900">{invoice.totalVat.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total TTC :</span>
                <span className="text-[#295294]">{invoice.totalTtc.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-emerald-700 pt-1">
                <span>Déjà réglé :</span>
                <span className="font-bold">{(invoice.paidAmount || 0).toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-amber-700 font-extrabold text-sm pt-1 border-t border-dashed border-slate-300">
                <span>Reste à payer :</span>
                <span>{invoice.remainingAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>

          {/* Stamp / Signature Box */}
          <div className="pt-6 flex justify-end">
            <div className="w-48 text-center border border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-6">
                Cachet &amp; Signature
              </span>
              <div className="h-10 flex items-center justify-center">
                <span className="text-xs font-serif italic text-teal-800 font-bold border-b border-teal-800 pb-1">
                  {settings.name}
                </span>
              </div>
            </div>
          </div>

          {/* Footer legal note */}
          <div className="text-center pt-6 border-t border-slate-100 text-[10px] text-slate-400">
            Facture générée numériquement par Chapfacture — Document conforme aux normes commerciales en vigueur.
          </div>
        </div>
      </div>
    </div>
  );
}
