import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clientsStorage, invoicesStorage, quotesStorage } from '../../services/storage';
import type { Client, Invoice } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Building2,
  MapPin,
  FileText,
  CreditCard,
  Edit2,
  Trash2,
  Eye,
  X,
  MessageSquareShare,
} from 'lucide-react';

interface ClientsListProps {
  onOpenNewClient: () => void;
  onEditClient: (client: Client) => void;
  onViewInvoice: (invoice: Invoice) => void;
}

export function ClientsList({ onOpenNewClient, onEditClient, onViewInvoice }: ClientsListProps) {
  const { currentUser, refreshUser } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedClientForDetail, setSelectedClientForDetail] = useState<Client | null>(null);

  if (!currentUser) return null;

  const allClients = clientsStorage.getAll(currentUser.id);
  const allInvoices = invoicesStorage.getAll(currentUser.id);
  const allQuotes = quotesStorage.getAll(currentUser.id);

  const filteredClients = allClients.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchCompany = (c.company || '').toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      if (!matchName && !matchCompany && !matchPhone) return false;
    }
    return true;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous supprimer le client ${name} ?`)) {
      clientsStorage.delete(currentUser.id, id);
      refreshUser();
      if (selectedClientForDetail?.id === id) {
        setSelectedClientForDetail(null);
      }
    }
  };

  const getClientStats = (clientId: string) => {
    const clientInvoices = allInvoices.filter((inv) => inv.clientId === clientId);
    const totalBilled = clientInvoices.reduce((sum, inv) => sum + inv.totalTtc, 0);
    const totalPaid = clientInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const remaining = Math.max(0, totalBilled - totalPaid);
    return { totalBilled, totalPaid, remaining, invoicesCount: clientInvoices.length };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Clients</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez votre portefeuille clients, leur historique de facturation et leurs coordonnées.
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un client</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} enregistré
            {filteredClients.length > 1 ? 's' : ''}
          </p>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, entreprise, tél..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucun client trouvé</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Ajoutez vos clients pour commencer à leur facturer des prestations ou produits.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3 text-right">Total Facturé</th>
                  <th className="py-3 px-3 text-right">Encaissé</th>
                  <th className="py-3 px-3 text-right">Reste à payer</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((client) => {
                  const stats = getClientStats(client.id);

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => setSelectedClientForDetail(client)}
                          className="font-bold text-slate-900 hover:text-purple-600 hover:underline text-left cursor-pointer block"
                        >
                          {client.name}
                        </button>
                        {client.company && (
                          <span className="text-[11px] text-slate-400 font-medium block">
                            {client.company}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-700">{client.phone}</p>
                          {client.email && <p className="text-[11px] text-slate-400">{client.email}</p>}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        {stats.totalBilled.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-emerald-600">
                        {stats.totalPaid.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-amber-600">
                        {stats.remaining.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedClientForDetail(client)}
                            title="Voir la fiche détaillée & historique"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditClient(client)}
                            title="Modifier les coordonnées"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(client.id, client.name)}
                            title="Supprimer le client"
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

      {/* CLIENT DETAIL DRAWER / MODAL */}
      {selectedClientForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Fiche Client
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedClientForDetail.name}
                </h3>
                {selectedClientForDetail.company && (
                  <p className="text-sm font-semibold text-slate-500">
                    {selectedClientForDetail.company}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedClientForDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Overview for this client */}
            {(() => {
              const s = getClientStats(selectedClientForDetail.id);
              const clientInvoices = allInvoices.filter(
                (i) => i.clientId === selectedClientForDetail.id
              );
              const clientQuotes = allQuotes.filter((q) => q.clientId === selectedClientForDetail.id);

              return (
                <div className="mt-5 space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Total Facturé</span>
                      <p className="text-base font-extrabold text-slate-900 mt-1">
                        {s.totalBilled.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Encaissé</span>
                      <p className="text-base font-extrabold text-emerald-700 mt-1">
                        {s.totalPaid.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-800 uppercase">Reste dû</span>
                      <p className="text-base font-extrabold text-amber-700 mt-1">
                        {s.remaining.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{selectedClientForDetail.phone}</span>
                    </div>
                    {selectedClientForDetail.email && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{selectedClientForDetail.email}</span>
                      </div>
                    )}
                    {(selectedClientForDetail.address || selectedClientForDetail.city) && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          {selectedClientForDetail.address}{' '}
                          {selectedClientForDetail.city && `(${selectedClientForDetail.city})`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Invoices History */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Historique des factures ({clientInvoices.length})
                    </h4>
                    {clientInvoices.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Aucune facture émise pour ce client.</p>
                    ) : (
                      <div className="space-y-2">
                        {clientInvoices.map((inv) => (
                          <div
                            key={inv.id}
                            className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                          >
                            <div>
                              <p className="font-bold text-slate-900">{inv.number}</p>
                              <p className="text-[10px] text-slate-400">
                                Émise le {new Date(inv.issueDate).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">
                                {inv.totalTtc.toLocaleString('fr-FR')} FCFA
                              </p>
                              <button
                                onClick={() => {
                                  setSelectedClientForDetail(null);
                                  onViewInvoice(inv);
                                }}
                                className="text-[11px] font-bold text-teal-600 hover:underline"
                              >
                                Voir facture
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedClientForDetail(null)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
