import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, AlertTriangle, CheckCircle2, ExternalLink, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA, formatDateFr } from '../../services/storage';
import { Invoice } from '../../types';

export function RemindersList() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setInvoices(workspaceService.getInvoices(user.id));
  }, [user]);

  if (!user) return null;

  const unpaidInvoices = invoices.filter((i) => i.remainingAmount > 0 && i.status !== 'draft');

  const buildWhatsAppMessage = (inv: Invoice) => {
    const docLink = `https://app.faktelio.com/doc/${inv.number}`;
    return `Bonjour ${inv.clientName},\n\nSauf erreur de notre part, la facture *${inv.number}* émise par *${user.companyName}* présente un solde à régler :\n\n• Client : ${inv.clientName}\n• N° Facture : *${inv.number}*\n• Montant restant : *${formatFCFA(inv.remainingAmount)}* (sur ${formatFCFA(inv.totalTtc)})\n• Date d'échéance : ${formatDateFr(inv.dueDate)}\n• Lien du document : ${docLink}\n\nVous pouvez effectuer le règlement par Mobile Money (Wave / Orange Money) ou virement bancaire.\n\nMerci pour votre confiance !`;
  };

  const handleSendWhatsApp = (inv: Invoice) => {
    const text = buildWhatsAppMessage(inv);
    const cleanPhone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = (inv: Invoice) => {
    navigator.clipboard.writeText(buildWhatsAppMessage(inv));
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-extrabold uppercase tracking-wider mb-2">
            <MessageCircle className="w-3.5 h-3.5" />
            Relances Automatiques WhatsApp
          </span>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Relances Clients sur WhatsApp
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            FAKTELIO prépare automatiquement vos messages avec le nom du client, le numéro de facture, le montant, la date d&apos;échéance et le lien du document.
          </p>
        </div>
      </div>

      {unpaidInvoices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E2E8F0] text-center">
          <CheckCircle2 className="w-12 h-12 text-[#16A34A] mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-[#101828]">
            {invoices.length === 0 ? 'Aucune facture impayée à relancer' : 'Toutes vos factures sont réglées !'}
          </h2>
          <p className="text-sm text-[#526581] max-w-md mx-auto mt-1">
            {invoices.length === 0
              ? 'Vos factures en attente de paiement apparaîtront ici automatiquement avec un message WhatsApp pré-rempli pour vos clients.'
              : 'Aucune facture en attente ou en retard ne nécessite de relance WhatsApp pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {unpaidInvoices.map((inv) => {
            const isLate = inv.status === 'late';
            const docLink = `https://app.faktelio.com/doc/${inv.number}`;
            return (
              <div
                key={inv.id}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[#1E4F91]">{inv.number}</span>
                        {isLate ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FEE2E2] text-[#DC2626]">
                            <AlertTriangle className="w-3 h-3" /> EN RETARD
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FEF3C7] text-[#B45309]">
                            <Clock className="w-3 h-3" /> EN ATTENTE
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-extrabold text-[#101828] mt-1">{inv.clientName}</p>
                      <p className="text-xs text-[#526581]">
                        {inv.clientCompany ? `${inv.clientCompany} • ` : ''}
                        {inv.clientPhone || 'Téléphone non renseigné'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-[#526581] uppercase block">
                        Reste à payer
                      </span>
                      <span className="text-lg font-extrabold text-[#F47B20]">
                        {formatFCFA(inv.remainingAmount)}
                      </span>
                      <span className="text-[11px] text-[#526581] block">
                        Échéance : {formatDateFr(inv.dueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Pre-filled WhatsApp Message Preview */}
                  <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#101828] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-[#15803D] pb-1 border-b border-[#BBF7D0]">
                      <span>Message WhatsApp pré-rempli par FAKTELIO</span>
                      <span>Prêt à envoyer</span>
                    </div>
                    <p>
                      Bonjour <strong>{inv.clientName}</strong>,
                    </p>
                    <p>
                      Votre facture <strong>{inv.number}</strong> d&apos;un montant restant de{' '}
                      <strong>{formatFCFA(inv.remainingAmount)}</strong> (échéance le{' '}
                      <strong>{formatDateFr(inv.dueDate)}</strong>) est en attente de règlement.
                    </p>
                    <p className="text-[#1E4F91] underline break-all">
                      Document : {docLink}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F5F7FA]">
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(inv)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0] text-xs font-bold text-[#101828] transition-colors cursor-pointer"
                  >
                    {copiedId === inv.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                        Message copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copier le texte
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(inv)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Relancer sur WhatsApp
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
