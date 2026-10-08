import React from 'react';
import { X, Printer, MessageCircle, Download, CheckCircle2, Stamp } from 'lucide-react';
import { Invoice } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA, formatDateFr } from '../../services/storage';
import { FaktelioLogo } from '../common/FaktelioLogo';

export function InvoiceDetailModal({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) {
  const { user } = useAuth();
  if (!user) return null;

  const settings = workspaceService.getSettings(user.id);
  const accentColor = settings.accentColor || '#1E4F91';

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const msg = `Bonjour ${invoice.clientName},\n\nVeuillez trouver les informations de votre facture *${invoice.number}* émise par *${settings.name}* sur FAKTELIO :\n- Date d'émission : ${formatDateFr(invoice.issueDate)}\n- Date d'échéance : ${formatDateFr(invoice.dueDate)}\n- Montant Total TTC : *${formatFCFA(invoice.totalTtc)}*\n- Montant réglé : ${formatFCFA(invoice.paidAmount)}\n- Solde restant : *${formatFCFA(invoice.remainingAmount)}*\n\nModes de règlement : ${settings.paymentTerms}\n\nMerci pour votre confiance !`;
    const cleanPhone = (invoice.clientPhone || '').replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="px-6 py-4 bg-[#F5F7FA] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-extrabold text-[#101828]">
              Aperçu Facture {invoice.number}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1E4F91]/10 text-[#1E4F91]">
              Document Certifié FAKTELIO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Partager WhatsApp
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E4F91] hover:bg-[#163C70] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger PDF / Imprimer
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#526581] hover:text-[#101828] hover:bg-[#E2E8F0]/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 Invoice Document */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-white text-[#101828]" id="printable-invoice">
          {/* Top Header */}
          <div
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2"
            style={{ borderColor: accentColor }}
          >
            <div>
              <div className="mb-2">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.name}
                    className="h-12 object-contain mb-2"
                  />
                ) : (
                  <FaktelioLogo size="md" />
                )}
              </div>
              <p className="text-base font-extrabold text-[#101828]">{settings.name}</p>
              <div className="text-xs text-[#526581] mt-1.5 space-y-0.5">
                <p>
                  {settings.address}, {settings.city} — {settings.country}
                </p>
                <p>
                  Tél : {settings.phone} • Email : {settings.email}
                </p>
                {settings.taxNumber && <p>NIF / RCCM : {settings.taxNumber}</p>}
              </div>
            </div>

            <div className="sm:text-right">
              <div
                className="inline-block px-3.5 py-1 rounded-lg text-white text-xs font-extrabold uppercase tracking-widest mb-2"
                style={{ backgroundColor: accentColor }}
              >
                FACTURE
              </div>
              <p className="text-xl font-extrabold text-[#101828]">{invoice.number}</p>
              <p className="text-xs text-[#526581] mt-1">
                Date d&apos;émission : <strong>{formatDateFr(invoice.issueDate)}</strong>
              </p>
              <p className="text-xs text-[#526581]">
                Date d&apos;échéance : <strong>{formatDateFr(invoice.dueDate)}</strong>
              </p>
            </div>
          </div>

          {/* Client Box & Payment Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#526581] mb-1">
                Facturé à :
              </p>
              <p className="text-sm font-extrabold text-[#101828]">{invoice.clientName}</p>
              {invoice.clientCompany && (
                <p className="text-xs font-semibold text-[#1E4F91]">{invoice.clientCompany}</p>
              )}
              {invoice.clientAddress && (
                <p className="text-xs text-[#526581] mt-1">{invoice.clientAddress}</p>
              )}
              {invoice.clientPhone && (
                <p className="text-xs text-[#526581]">Tél : {invoice.clientPhone}</p>
              )}
              {invoice.clientEmail && (
                <p className="text-xs text-[#526581]">Email : {invoice.clientEmail}</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#526581]">Statut du règlement</span>
                {invoice.remainingAmount === 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#DCFCE7] text-[#15803D]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAYÉE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#FEF3C7] text-[#B45309]">
                    RESTE À PAYER
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-baseline justify-between">
                <span className="text-xs text-[#526581]">Solde restant :</span>
                <span className="text-lg font-extrabold text-[#F47B20]">
                  {formatFCFA(invoice.remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="text-white text-[11px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: accentColor }}
                >
                  <th className="py-3 px-4">Désignation</th>
                  <th className="py-3 px-4 text-center">Qté</th>
                  <th className="py-3 px-4 text-right">Prix Unitaire HT</th>
                  <th className="py-3 px-4 text-center">TVA</th>
                  <th className="py-3 px-4 text-right">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs sm:text-sm">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3.5 px-4 font-semibold text-[#101828]">
                      {item.description}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#526581]">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right text-[#526581]">
                      {formatFCFA(item.unitPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#526581]">{item.vatRate}%</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#101828]">
                      {formatFCFA(item.totalHt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Totals + Signature/Stamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div className="space-y-3 text-xs text-[#526581]">
              <div>
                <p className="font-bold text-[#101828] uppercase tracking-wider mb-1">
                  Conditions &amp; Moyens de paiement
                </p>
                <p>{invoice.terms || settings.paymentTerms}</p>
                {settings.bankDetails && <p className="mt-1 font-medium">{settings.bankDetails}</p>}
              </div>
              {invoice.notes && (
                <div>
                  <p className="font-bold text-[#101828] uppercase tracking-wider mb-1">Notes</p>
                  <p>{invoice.notes}</p>
                </div>
              )}

              {/* Official Signature / Cachet Box */}
              <div className="pt-3">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#1E4F91]/40 bg-[#F5F7FA]">
                  <Stamp className="w-4 h-4 text-[#1E4F91]" />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-[#1E4F91]">
                      Cachet &amp; Signature Entreprise
                    </p>
                    <p className="text-xs font-bold text-[#101828]">
                      {settings.signatureText || settings.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F7FA] p-5 rounded-xl border border-[#E2E8F0] space-y-2.5 text-sm">
              <div className="flex justify-between text-[#526581]">
                <span>Sous-total HT</span>
                <span className="font-bold text-[#101828]">{formatFCFA(invoice.subtotalHt)}</span>
              </div>
              {invoice.discountRate > 0 && (
                <div className="flex justify-between text-[#15803D]">
                  <span>Remise ({invoice.discountRate}%)</span>
                  <span>
                    -{formatFCFA(Math.round((invoice.subtotalHt * invoice.discountRate) / 100))}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#526581]">
                <span>Total TVA</span>
                <span className="font-bold text-[#101828]">{formatFCFA(invoice.totalVat)}</span>
              </div>
              <div className="pt-2.5 border-t border-[#E2E8F0] flex justify-between text-base font-extrabold text-[#1E4F91]">
                <span>TOTAL TTC</span>
                <span>{formatFCFA(invoice.totalTtc)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#15803D] font-bold">
                <span>Montant déjà payé</span>
                <span>{formatFCFA(invoice.paidAmount)}</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between text-sm font-extrabold text-[#F47B20]">
                <span>Net à payer</span>
                <span>{formatFCFA(invoice.remainingAmount)}</span>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#526581]">
            <span>
              Document généré électroniquement via <strong>FAKTELIO</strong> (www.faktelio.com)
            </span>
            <span>Merci pour votre confiance !</span>
          </div>
        </div>
      </div>
    </div>
  );
}
