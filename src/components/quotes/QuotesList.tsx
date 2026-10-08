import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ArrowRightLeft,
  MessageCircle,
  Trash2,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { workspaceService, formatFCFA, formatDateFr } from '../../services/storage';
import { Quote, QuoteStatus } from '../../types';
import { QuoteModal } from './QuoteModal';

const statusLabels: Record<QuoteStatus, { label: string; badge: string }> = {
  draft: { label: 'Brouillon', badge: 'bg-[#F5F7FA] text-[#526581]' },
  sent: { label: 'Envoyé', badge: 'bg-[#E0F2FE] text-[#0369A1]' },
  accepted: { label: 'Accepté', badge: 'bg-[#DCFCE7] text-[#15803D]' },
  rejected: { label: 'Refusé', badge: 'bg-[#FEE2E2] text-[#DC2626]' },
  expired: { label: 'Expiré', badge: 'bg-[#FEF3C7] text-[#B45309]' },
};

export function QuotesList({ onConverted }: { onConverted?: () => void }) {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | QuoteStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [convertedBanner, setConvertedBanner] = useState<string | null>(null);

  const loadQuotes = () => {
    if (!user) return;
    setQuotes(workspaceService.getQuotes(user.id));
  };

  useEffect(() => {
    loadQuotes();
  }, [user]);

  if (!user) return null;

  const filtered = quotes.filter((q) => {
    const matchesSearch =
      q.number.toLowerCase().includes(search.toLowerCase()) ||
      q.clientName.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && q.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = (quote: Quote, nextStatus: QuoteStatus) => {
    workspaceService.saveQuote(user.id, {
      ...quote,
      status: nextStatus,
    });
    loadQuotes();
  };

  const handleConvertToInvoice = (quote: Quote) => {
    const createdInvoice = workspaceService.convertQuoteToInvoice(user.id, quote.id);
    if (createdInvoice) {
      loadQuotes();
      onConverted?.();
      setConvertedBanner(
        `Le devis ${quote.number} a été transformé en facture ${createdInvoice.number} (${formatFCFA(createdInvoice.totalTtc)}) avec reprise intégrale des lignes !`
      );
    }
  };

  const handleWhatsAppQuote = (quote: Quote) => {
    const msg = `Bonjour ${quote.clientName},\n\nVoici votre devis *${quote.number}* préparé sur FAKTELIO par *${user.companyName}* :\n- Montant Total TTC : *${formatFCFA(quote.totalTtc)}*\n- Valable jusqu'au : ${formatDateFr(quote.expiryDate)}\n\nConfirmez-nous votre accord par retour de message pour lancer la prestation.`;
    const cleanPhone = (quote.clientPhone || '').replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Gestion des Devis &amp; Conversion en Facture
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Créez vos propositions commerciales et transformez tout devis accepté en facture en 1 clic.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Nouveau Devis
        </button>
      </div>

      {convertedBanner && (
        <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 text-[#15803D] text-xs sm:text-sm font-bold flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {convertedBanner}
          </span>
          <button
            onClick={() => navigate('/invoices')}
            className="px-3.5 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold cursor-pointer"
          >
            Voir la facture générée →
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#526581] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un devis par numéro ou client..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E8F0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'Tous' },
              { id: 'draft', label: 'Brouillon' },
              { id: 'sent', label: 'Envoyé' },
              { id: 'accepted', label: 'Accepté' },
              { id: 'rejected', label: 'Refusé' },
              { id: 'expired', label: 'Expiré' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-[#1E4F91] text-white'
                  : 'bg-[#F5F7FA] text-[#526581] hover:text-[#101828]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {quotes.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <FileText className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-[#101828]">
              Vous n&apos;avez encore aucun devis.
            </h3>
            <p className="text-xs text-[#526581] max-w-sm mx-auto mt-1 mb-5">
              Créez votre premier devis pour vos clients et transformez-le en facture en 1 clic dès qu&apos;il est accepté.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Créer mon premier devis
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-sm font-bold text-[#101828]">Aucun devis ne correspond à votre recherche.</p>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
              className="mt-2 text-xs font-bold text-[#1E4F91] hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[11px] font-bold text-[#526581] uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="py-3.5 px-5">N° Devis</th>
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-5">Dates</th>
                <th className="py-3.5 px-5">Montant TTC</th>
                <th className="py-3.5 px-5">Statut</th>
                <th className="py-3.5 px-5 text-right">Conversion &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {filtered.map((q) => {
                const st = statusLabels[q.status];
                return (
                  <tr key={q.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                    <td className="py-3.5 px-5 font-extrabold text-[#1E4F91]">{q.number}</td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#101828]">{q.clientName}</div>
                      {q.clientCompany && (
                        <div className="text-xs text-[#526581]">{q.clientCompany}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-[#526581]">
                      <div>Émis : {formatDateFr(q.issueDate)}</div>
                      <div>Expire : {formatDateFr(q.expiryDate)}</div>
                    </td>
                    <td className="py-3.5 px-5 font-extrabold text-[#101828]">
                      {formatFCFA(q.totalTtc)}
                    </td>
                    <td className="py-3.5 px-5">
                      <select
                        value={q.status}
                        onChange={(e) => handleStatusChange(q, e.target.value as QuoteStatus)}
                        className={`px-2.5 py-1 rounded-full text-xs font-extrabold border-0 cursor-pointer ${st.badge}`}
                      >
                        <option value="draft">Brouillon</option>
                        <option value="sent">Envoyé</option>
                        <option value="accepted">Accepté</option>
                        <option value="rejected">Refusé</option>
                        <option value="expired">Expiré</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {/* Section 15 Requirement: "Transformer en facture" button */}
                        <button
                          onClick={() => handleConvertToInvoice(q)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            q.status === 'accepted'
                              ? 'bg-[#F47B20] hover:bg-[#FF7A21] text-white shadow-xs'
                              : 'bg-[#1E4F91]/10 hover:bg-[#1E4F91] text-[#1E4F91] hover:text-white'
                          }`}
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          Transformer en facture
                        </button>

                        <button
                          onClick={() => handleWhatsAppQuote(q)}
                          title="Envoyer sur WhatsApp"
                          className="p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#15803D] hover:text-white transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            workspaceService.deleteQuote(user.id, q.id);
                            loadQuotes();
                          }}
                          title="Supprimer"
                          className="p-2 rounded-lg bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {modalOpen && (
        <QuoteModal
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            loadQuotes();
          }}
        />
      )}
    </div>
  );
}
