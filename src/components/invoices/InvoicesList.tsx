import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Eye,
  Wallet,
  MessageCircle,
  Trash2,
  FilePlus2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { workspaceService, formatFCFA, formatDateFr } from '../../services/storage';
import { Invoice, InvoiceStatus } from '../../types';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { PaymentModal } from '../payments/PaymentModal';

export function InvoicesList({
  onOpenFastInvoice,
  refreshKey,
}: {
  onOpenFastInvoice: () => void;
  refreshKey?: number;
}) {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const loadInvoices = () => {
    if (!user) return;
    setInvoices(workspaceService.getInvoices(user.id));
  };

  useEffect(() => {
    loadInvoices();
  }, [user, refreshKey]);

  if (!user) return null;

  const filtered = invoices.filter((i) => {
    const q = search.toLowerCase();
    const matchesSearch =
      i.number.toLowerCase().includes(q) ||
      i.clientName.toLowerCase().includes(q) ||
      (i.clientCompany || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#DCFCE7] text-[#15803D]">
            PAYÉ
          </span>
        );
      case 'partial':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FEF3C7] text-[#B45309]">
            PARTIEL
          </span>
        );
      case 'late':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FEE2E2] text-[#DC2626]">
            EN RETARD
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#F5F7FA] text-[#526581]">
            BROUILLON
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#E0F2FE] text-[#0369A1]">
            EN ATTENTE
          </span>
        );
    }
  };

  const handleWhatsApp = (inv: Invoice) => {
    const msg = `Bonjour ${inv.clientName},\n\nVoici votre facture *${inv.number}* émise sur FAKTELIO par *${user.companyName}* :\n- Montant Total TTC : ${formatFCFA(inv.totalTtc)}\n- Reste à payer : *${formatFCFA(inv.remainingAmount)}*\n- Échéance : ${formatDateFr(inv.dueDate)}\n\nMerci pour votre confiance !`;
    const cleanPhone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Factures FAKTELIO
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Consultez, téléchargez en PDF, encaissez et partagez vos factures sur WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/billing')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E4F91] hover:bg-[#163C70] text-white text-xs font-extrabold transition-colors cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            Studio Facturation (5 étapes)
          </button>
          <button
            onClick={onOpenFastInvoice}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Facture Express (+30s)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#526581] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par numéro ou nom du client..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E8F0]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'all', label: 'Toutes' },
              { id: 'paid', label: 'Payées' },
              { id: 'sent', label: 'En attente' },
              { id: 'partial', label: 'Partielles' },
              { id: 'late', label: 'En retard' },
              { id: 'draft', label: 'Brouillons' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-[#1E4F91] text-white'
                  : 'bg-[#F5F7FA] text-[#526581] hover:text-[#101828]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {invoices.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Eye className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-[#101828]">
              Vous n&apos;avez encore aucune facture.
            </h3>
            <p className="text-xs text-[#526581] max-w-sm mx-auto mt-1 mb-5">
              Créez votre première facture en quelques secondes avec le studio de facturation ou la création express.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenFastInvoice}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Facture Express (+30s)
              </button>
              <button
                onClick={() => navigate('/billing')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E4F91] hover:bg-[#163C70] text-white text-xs font-extrabold cursor-pointer"
              >
                <FilePlus2 className="w-4 h-4" />
                Studio Facturation complet
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-sm font-bold text-[#101828]">Aucune facture ne correspond à votre recherche.</p>
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
                <th className="py-3.5 px-5">Numéro</th>
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-5">Date / Échéance</th>
                <th className="py-3.5 px-5">Montant TTC</th>
                <th className="py-3.5 px-5">Reste à payer</th>
                <th className="py-3.5 px-5">Statut</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                  <td className="py-3.5 px-5 font-extrabold text-[#1E4F91]">{inv.number}</td>
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-[#101828]">{inv.clientName}</div>
                    {inv.clientCompany && (
                      <div className="text-xs text-[#526581]">{inv.clientCompany}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-xs text-[#526581]">
                    <div>Émise : {formatDateFr(inv.issueDate)}</div>
                    <div>Échéance : {formatDateFr(inv.dueDate)}</div>
                  </td>
                  <td className="py-3.5 px-5 font-extrabold text-[#101828]">
                    {formatFCFA(inv.totalTtc)}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#F47B20]">
                    {formatFCFA(inv.remainingAmount)}
                  </td>
                  <td className="py-3.5 px-5">{getStatusBadge(inv.status)}</td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        title="Aperçu & Télécharger PDF"
                        className="p-2 rounded-lg bg-[#F5F7FA] hover:bg-[#1E4F91] text-[#101828] hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {inv.remainingAmount > 0 && (
                        <button
                          onClick={() => setPaymentInvoice(inv)}
                          title="Enregistrer un règlement"
                          className="p-2 rounded-lg bg-[#DCFCE7] hover:bg-[#16A34A] text-[#15803D] hover:text-white transition-colors cursor-pointer"
                        >
                          <Wallet className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleWhatsApp(inv)}
                        title="Partager sur WhatsApp"
                        className="p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#15803D] hover:text-white transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          workspaceService.deleteInvoice(user.id, inv.id);
                          loadInvoices();
                        }}
                        title="Supprimer"
                        className="p-2 rounded-lg bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {paymentInvoice && (
        <PaymentModal
          invoice={paymentInvoice}
          onClose={() => setPaymentInvoice(null)}
          onSuccess={() => {
            setPaymentInvoice(null);
            loadInvoices();
          }}
        />
      )}
    </div>
  );
}
