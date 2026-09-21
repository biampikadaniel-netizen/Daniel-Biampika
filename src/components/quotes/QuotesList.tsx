import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { quotesStorage } from '../../services/storage';
import type { Quote, Invoice } from '../../types';
import {
  FileText,
  Plus,
  Search,
  ArrowRight,
  MessageSquareShare,
  Trash2,
  CheckCircle2,
  Zap,
  Check,
} from 'lucide-react';

interface QuotesListProps {
  onOpenNewQuote: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
}

export function QuotesList({ onOpenNewQuote, onInvoiceCreated }: QuotesListProps) {
  const { currentUser, refreshUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!currentUser) return null;

  const allQuotes = quotesStorage.getAll(currentUser.id);

  const filteredQuotes = allQuotes.filter((q) => {
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchNum = q.number.toLowerCase().includes(query);
      const matchName = q.clientName.toLowerCase().includes(query);
      if (!matchNum && !matchName) return false;
    }
    return true;
  });

  const handleConvertToInvoice = (quote: Quote) => {
    const invoice = quotesStorage.convertToInvoice(currentUser.id, quote.id);
    if (invoice) {
      refreshUser();
      onInvoiceCreated(invoice);
    }
  };

  const handleDelete = (id: string, num: string) => {
    if (window.confirm(`Supprimer le devis ${num} ?`)) {
      quotesStorage.delete(currentUser.id, id);
      refreshUser();
    }
  };

  const handleWhatsAppSend = (q: Quote) => {
    const phone = (q.clientPhone || '').replace(/[^0-9]/g, '');
    const amount = q.totalTtc.toLocaleString('fr-FR');
    const text = encodeURIComponent(
      `Bonjour ${q.clientName},\n\nVeuillez trouver notre devis #${q.number} d'un montant de ${amount} FCFA émis par ${currentUser.companyName}.\n\nRestant à votre écoute pour toute précision.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Devis</h1>
          <p className="text-sm text-slate-500 mt-1">
            Établissez des devis professionnels et convertissez-les en factures en 1 clic.
          </p>
        </div>

        <button
          onClick={onOpenNewQuote}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#295294] hover:bg-[#1f3f72] shadow-md shadow-blue-900/20 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un devis</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-2xl">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'sent', label: 'Envoyés' },
              { id: 'accepted', label: 'Acceptés' },
              { id: 'draft', label: 'Brouillons' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par N° ou client..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucun devis trouvé</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Créez votre proposition commerciale et transformez-la en facture dès que le client valide.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Numéro</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Émission</th>
                  <th className="py-3 px-3">Validité</th>
                  <th className="py-3 px-3 text-right">Montant TTC</th>
                  <th className="py-3 px-3 text-center">Statut</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredQuotes.map((q) => {
                  const isAccepted = q.status === 'accepted';

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900 font-mono">{q.number}</td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800">{q.clientName}</p>
                        {q.clientCompany && <p className="text-[11px] text-slate-400">{q.clientCompany}</p>}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {new Date(q.issueDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {new Date(q.expiryDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        {q.totalTtc.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isAccepted ? 'Accepté / Facturé' : q.status === 'rejected' ? 'Refusé' : 'Envoyé'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Transform to Invoice */}
                          {!isAccepted ? (
                            <button
                              onClick={() => handleConvertToInvoice(q)}
                              title="Transformer immédiatement en facture"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                              <span>Transformer en facture</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Facturé
                            </span>
                          )}

                          <button
                            onClick={() => handleWhatsAppSend(q)}
                            title="Envoyer sur WhatsApp"
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                          >
                            <MessageSquareShare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(q.id, q.number)}
                            title="Supprimer le devis"
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
