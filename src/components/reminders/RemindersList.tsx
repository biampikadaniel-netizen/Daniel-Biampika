import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { invoicesStorage, settingsStorage } from '../../services/storage';
import type { Invoice } from '../../types';
import {
  BellRing,
  MessageSquareShare,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
} from 'lucide-react';

interface RemindersListProps {
  onViewInvoice: (invoice: Invoice) => void;
}

export function RemindersList({ onViewInvoice }: RemindersListProps) {
  const { currentUser } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  if (!currentUser) return null;

  const settings = settingsStorage.getSettings(currentUser.id);
  const allInvoices = invoicesStorage.getAll(currentUser.id);

  // Unpaid invoices
  const unpaidInvoices = allInvoices
    .filter((inv) => inv.status !== 'paid' && inv.remainingAmount > 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const filtered = unpaidInvoices.filter((inv) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchClient = inv.clientName.toLowerCase().includes(q);
      const matchNum = inv.number.toLowerCase().includes(q);
      if (!matchClient && !matchNum) return false;
    }
    return true;
  });

  const generateMessage = (inv: Invoice) => {
    const amount = inv.remainingAmount.toLocaleString('fr-FR');
    const dueDateFormatted = new Date(inv.dueDate).toLocaleDateString('fr-FR');
    const isLate = new Date(inv.dueDate).getTime() < Date.now();

    if (isLate) {
      return `Bonjour ${inv.clientName},\n\nSauf erreur de notre part, votre facture N° *${inv.number}* d'un montant de *${amount} FCFA* émise par *${settings.name}* est arrivée à échéance le ${dueDateFormatted} et reste impayée.\n\nNous vous remercions de bien vouloir régulariser ce montant dans les plus brefs délais par Mobile Money ou virement.\n\nRestant à votre disposition,\n*${settings.name}* — Tél : ${settings.phone || currentUser.phone}`;
    }

    return `Bonjour ${inv.clientName},\n\nNous vous rappelons que votre facture N° *${inv.number}* d'un montant de *${amount} FCFA* émise par *${settings.name}* arrive à échéance le ${dueDateFormatted}.\n\nMerci de procéder à son règlement avant cette date.\n\nBien cordialement,\n*${settings.name}* — Tél : ${settings.phone || currentUser.phone}`;
  };

  const handleCopyMessage = (inv: Invoice) => {
    const text = generateMessage(inv);
    navigator.clipboard.writeText(text);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendWhatsApp = (inv: Invoice) => {
    const phone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(generateMessage(inv));
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const totalOutstanding = unpaidInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);
  const overdueCount = unpaidInvoices.filter(
    (inv) => new Date(inv.dueDate).getTime() < Date.now()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Centre de Relances WhatsApp
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Récupérez vos impayés 3x plus vite grâce aux relances directes WhatsApp pré-rédigées.
          </p>
        </div>
      </div>

      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total en attente de paiement
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {totalOutstanding.toLocaleString('fr-FR')}{' '}
            <span className="text-sm font-semibold text-slate-500">FCFA</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {unpaidInvoices.length} facture{unpaidInvoices.length > 1 ? 's' : ''} en attente
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200/80 shadow-xs bg-red-50/20">
          <span className="text-xs font-bold uppercase tracking-wider text-red-700">
            Factures en retard critique
          </span>
          <p className="text-2xl font-black text-red-600 mt-2">{overdueCount}</p>
          <p className="text-[11px] text-red-600/80 mt-0.5">Échéance dépassée</p>
        </div>

        <div className="bg-gradient-to-tr from-emerald-600 to-green-600 p-5 rounded-2xl text-white shadow-md">
          <div className="flex items-center gap-2">
            <MessageSquareShare className="w-5 h-5 text-emerald-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Efficacité WhatsApp
            </span>
          </div>
          <p className="text-sm font-bold mt-2">92% de taux d'ouverture</p>
          <p className="text-[11px] text-emerald-100 mt-0.5">
            Les relances WhatsApp sont lues en moyenne en moins de 15 minutes.
          </p>
        </div>
      </div>

      {/* Invoices List to Remind */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Factures à relancer ({filtered.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher client ou facture..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucun impayé à relancer !</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Félicitations, toutes vos factures sont à jour ou ont été réglées.
            </p>
          </div>
        ) : (
          <div className="space-y-3 border-t border-slate-100 pt-3">
            {filtered.map((inv) => {
              const now = Date.now();
              const dueTime = new Date(inv.dueDate).getTime();
              const diffDays = Math.floor((now - dueTime) / (1000 * 60 * 60 * 24));
              const isOverdue = diffDays > 0;

              return (
                <div
                  key={inv.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                    isOverdue
                      ? 'bg-red-50/40 border-red-200 hover:border-red-300'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{inv.number}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isOverdue ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isOverdue ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            Retard de {diffDays} jour{diffDays > 1 ? 's' : ''}
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Échéance le {new Date(inv.dueDate).toLocaleDateString('fr-FR')}
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{inv.clientName}</h3>
                    <p className="text-xs text-slate-500">
                      Tél (WhatsApp) : <span className="font-semibold text-slate-700">{inv.clientPhone}</span>
                      {inv.clientCompany && ` • ${inv.clientCompany}`}
                    </p>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Reste à recouvrer
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {inv.remainingAmount.toLocaleString('fr-FR')}{' '}
                        <span className="text-xs font-medium text-slate-500">FCFA</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyMessage(inv)}
                        title="Copier le message pour SMS ou Email"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shadow-xs transition-colors"
                      >
                        {copiedId === inv.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-500" />
                            <span>Copier texte</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSendWhatsApp(inv)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 cursor-pointer transition-transform hover:-translate-y-0.5"
                      >
                        <MessageSquareShare className="w-4 h-4" />
                        <span>Relancer sur WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
