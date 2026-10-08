import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Download,
  Upload,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  FileText,
  FileCheck2,
  Wallet,
  StickyNote,
  History,
  User,
  X,
  CheckCircle2,
  Save,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA, formatDateFr } from '../../services/storage';
import { Client, Invoice, Quote, Payment } from '../../types';
import { ClientModal } from './ClientModal';

type ClientFicheTab = 'info' | 'history' | 'invoices' | 'quotes' | 'payments' | 'notes';

export function ClientsList() {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.id || '';

  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'with_invoices' | 'vip'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [ficheTab, setFicheTab] = useState<ClientFicheTab>('info');
  const [crmNoteDraft, setCrmNoteDraft] = useState('');
  const [noteSavedBanner, setNoteSavedBanner] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const loadAll = () => {
    if (!companyId) return;
    const cList = workspaceService.getClients(companyId);
    setClients(cList);
    setInvoices(workspaceService.getInvoices(companyId));
    setQuotes(workspaceService.getQuotes(companyId));
    setPayments(workspaceService.getPayments(companyId));
    if (selectedClient) {
      const updated = cList.find((c) => c.id === selectedClient.id);
      if (updated) {
        setSelectedClient(updated);
        setCrmNoteDraft(updated.notes || '');
      }
    }
  };

  useEffect(() => {
    loadAll();
  }, [companyId]);

  if (!user) return null;

  const getClientStats = (clientId: string) => {
    const clientInvoices = invoices.filter((i) => i.clientId === clientId);
    const clientQuotes = quotes.filter((q) => q.clientId === clientId);
    const clientPayments = payments.filter((p) => p.clientId === clientId);
    const totalBilled = clientInvoices.reduce((s, i) => s + (Number(i.totalTtc) || 0), 0);

    const dates = [
      ...clientInvoices.map((i) => i.createdAt),
      ...clientQuotes.map((q) => q.createdAt),
      ...clientPayments.map((p) => p.createdAt),
    ];
    const lastActivityTs = dates.length > 0 ? Math.max(...dates) : null;

    return {
      invoicesCount: clientInvoices.length,
      quotesCount: clientQuotes.length,
      paymentsCount: clientPayments.length,
      totalBilled,
      lastActivity: lastActivityTs
        ? new Date(lastActivityTs).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'Aucune transaction',
      clientInvoices,
      clientQuotes,
      clientPayments,
    };
  };

  const filteredClients = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    const stats = getClientStats(c.id);
    if (filterType === 'with_invoices') return stats.invoicesCount > 0;
    if (filterType === 'vip') return stats.totalBilled >= 500000;
    return true;
  });

  const handleExportCsv = () => {
    if (clients.length === 0) return;
    const headers = [
      'Nom',
      'Entreprise',
      'Telephone',
      'Email',
      'Adresse',
      'Ville',
      'Pays',
      'Nombre de factures',
      'Montant total FCFA',
    ];
    const rows = clients.map((c) => {
      const st = getClientStats(c.id);
      return [
        `"${c.name}"`,
        `"${c.company || ''}"`,
        `"${c.phone}"`,
        `"${c.email || ''}"`,
        `"${c.address || ''}"`,
        `"${c.city || ''}"`,
        `"${c.country || ''}"`,
        st.invoicesCount,
        st.totalBilled,
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clients_faktelio_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = csvInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed = lines.map((line) => {
      const parts = line.split(';');
      return {
        name: parts[0] || '',
        company: parts[1] || '',
        email: parts[2] || '',
        phone: parts[3] || '',
        address: parts[4] || '',
        city: parts[5] || 'Abidjan',
      };
    });
    const count = workspaceService.importClients(companyId, parsed);
    setImportModalOpen(false);
    setCsvInput('');
    setNotificationMsg(`${count} client(s) importé(s) avec succès.`);
    loadAll();
  };

  const handleOpenFiche = (client: Client, initialTab: ClientFicheTab = 'info') => {
    setSelectedClient(client);
    setCrmNoteDraft(client.notes || '');
    setFicheTab(initialTab);
    setNoteSavedBanner(false);
  };

  const handleSaveCrmNotes = () => {
    if (!selectedClient) return;
    workspaceService.saveClient(companyId, {
      ...selectedClient,
      notes: crmNoteDraft,
    });
    setNoteSavedBanner(true);
    setTimeout(() => setNoteSavedBanner(false), 3000);
    loadAll();
  };

  const confirmDeleteClient = () => {
    if (!deletingClient) return;
    workspaceService.deleteClient(companyId, deletingClient.id);
    if (selectedClient?.id === deletingClient.id) setSelectedClient(null);
    setDeletingClient(null);
    setNotificationMsg('Client supprimé avec succès.');
    loadAll();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Clients &amp; CRM
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Centralisez vos contacts, coordonnées, historique des factures et notes commerciales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0]/70 text-[#101828] text-xs font-bold border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#1E4F91]" />
            Importer
          </button>

          {clients.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E2E8F0]/70 text-[#101828] text-xs font-bold border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#1E4F91]" />
              Exporter ({clients.length})
            </button>
          )}

          <button
            onClick={() => {
              setEditingClient(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Nouveau client
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#16A34A]/30 text-[#15803D] text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {notificationMsg}
          </span>
          <button onClick={() => setNotificationMsg(null)} className="text-xs underline cursor-pointer">
            Fermer
          </button>
        </div>
      )}

      {/* Search & Filters */}
      {clients.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#526581] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, entreprise, téléphone ou email..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E4F91]"
            />
          </div>

          <div className="flex items-center gap-2">
            {(
              [
                { id: 'all', label: `Tous (${clients.length})` },
                { id: 'with_invoices', label: 'Clients facturés' },
                { id: 'vip', label: 'Clients VIP (+500k)' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[#1E4F91] text-white'
                    : 'bg-[#F5F7FA] text-[#526581] hover:text-[#101828]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table or Empty State */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {clients.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Users className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-[#101828]">
              Vous n&apos;avez encore aucun client.
            </h3>
            <p className="text-xs text-[#526581] max-w-sm mx-auto mt-1 mb-5">
              Ajoutez les coordonnées de vos clients pour commencer à leur éditer des devis et des factures.
            </p>
            <button
              onClick={() => {
                setEditingClient(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              + Ajouter mon premier client
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-sm font-bold text-[#101828]">Aucun client ne correspond à votre recherche.</p>
            <button
              onClick={() => {
                setSearch('');
                setFilterType('all');
              }}
              className="mt-2 text-xs font-bold text-[#1E4F91] hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FA] text-[11px] font-bold text-[#526581] uppercase tracking-wider border-b border-[#E2E8F0]">
                  <th className="py-3.5 px-5">Nom</th>
                  <th className="py-3.5 px-5">Téléphone</th>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5 text-center">Nombre de factures</th>
                  <th className="py-3.5 px-5">Montant total</th>
                  <th className="py-3.5 px-5">Dernière activité</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm">
                {filteredClients
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((client) => {
                  const stats = getClientStats(client.id);
                  return (
                    <tr key={client.id} className="hover:bg-[#F5F7FA]/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => handleOpenFiche(client, 'info')}
                          className="text-left group cursor-pointer"
                        >
                          <div className="font-extrabold text-[#101828] group-hover:text-[#1E4F91]">
                            {client.name}
                          </div>
                          {client.company && (
                            <div className="text-xs text-[#526581]">{client.company}</div>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-xs font-semibold text-[#101828]">
                        {client.phone || '—'}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-[#526581]">
                        {client.email || '—'}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#1E4F91]/10 text-[#1E4F91]">
                          {stats.invoicesCount}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-extrabold text-[#101828]">
                        {formatFCFA(stats.totalBilled)}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-[#526581]">
                        {stats.lastActivity}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenFiche(client, 'info')}
                            title="Ouvrir la fiche CRM complète"
                            className="px-2.5 py-1.5 rounded-lg bg-[#1E4F91]/10 hover:bg-[#1E4F91] text-[#1E4F91] hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Fiche
                          </button>
                          <button
                            onClick={() => {
                              setEditingClient(client);
                              setModalOpen(true);
                            }}
                            title="Modifier"
                            className="p-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#526581] hover:text-[#101828] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingClient(client)}
                            title="Supprimer"
                            className="p-1.5 rounded-lg bg-[#FEE2E2]/60 hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer"
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

          {filteredClients.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#526581]">
              <span>
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
                {Math.min(currentPage * itemsPerPage, filteredClients.length)} sur{' '}
                {filteredClients.length} clients
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#101828] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F7FA] cursor-pointer"
                >
                  Précédent
                </button>
                {Array.from({ length: Math.ceil(filteredClients.length / itemsPerPage) }, (_, idx) => (
                  <button
                    key={idx + 1}
                    type="button"
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg font-bold cursor-pointer ${
                      currentPage === idx + 1
                        ? 'bg-[#1E4F91] text-white'
                        : 'border border-[#E2E8F0] bg-white text-[#101828] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= Math.ceil(filteredClients.length / itemsPerPage)}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#101828] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5F7FA] cursor-pointer"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>

      {/* Confirmation Modal before Deleting Client */}
      {deletingClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-3 text-[#DC2626]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-[#101828]">Confirmer la suppression</h3>
            </div>
            <p className="text-xs text-[#526581] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer le client <strong>{deletingClient.name}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingClient(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#526581] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDeleteClient}
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-extrabold hover:bg-[#B91C1C] cursor-pointer"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fiche Client Complète */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto">
            {/* Header */}
            <div className="p-6 bg-[#1E4F91] text-white flex items-start justify-between gap-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                  Fiche Client CRM
                </span>
                <h2 className="text-xl font-extrabold">{selectedClient.name}</h2>
                {selectedClient.company && (
                  <p className="text-xs text-white/85 font-medium">{selectedClient.company}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 6 Tabs */}
            <div className="px-6 pt-3 bg-[#F5F7FA] border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto">
              {(
                [
                  { id: 'info', label: 'Informations', icon: User },
                  { id: 'history', label: 'Historique', icon: History },
                  { id: 'invoices', label: 'Factures', icon: FileText },
                  { id: 'quotes', label: 'Devis', icon: FileCheck2 },
                  { id: 'payments', label: 'Paiements', icon: Wallet },
                  { id: 'notes', label: 'Notes', icon: StickyNote },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = ficheTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFicheTab(tab.id)}
                    className={`px-3.5 py-2.5 text-xs font-extrabold rounded-t-xl inline-flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white text-[#1E4F91] border-[#F47B20]'
                        : 'text-[#526581] border-transparent hover:text-[#101828]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="p-6 max-h-[65vh] overflow-y-auto">
              {(() => {
                const st = getClientStats(selectedClient.id);

                if (ficheTab === 'info') {
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                          <p className="text-[11px] font-bold text-[#526581] uppercase">Chiffre d&apos;affaires</p>
                          <p className="text-lg font-extrabold text-[#1E4F91] mt-1">
                            {formatFCFA(st.totalBilled)}
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                          <p className="text-[11px] font-bold text-[#526581] uppercase">Factures &amp; Devis</p>
                          <p className="text-lg font-extrabold text-[#101828] mt-1">
                            {st.invoicesCount} factures • {st.quotesCount} devis
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                          <p className="text-[11px] font-bold text-[#526581] uppercase">Dernière activité</p>
                          <p className="text-sm font-extrabold text-[#101828] mt-1">
                            {st.lastActivity}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm">
                        <div className="p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                          <div className="flex items-center gap-2 text-[#526581]">
                            <Phone className="w-4 h-4 text-[#1E4F91]" />
                            <span className="font-bold text-[#101828]">{selectedClient.phone || 'Non renseigné'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#526581]">
                            <Mail className="w-4 h-4 text-[#1E4F91]" />
                            <span>{selectedClient.email || 'Non renseigné'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#526581]">
                            <MapPin className="w-4 h-4 text-[#1E4F91]" />
                            <span>
                              {selectedClient.address ? `${selectedClient.address}, ` : ''}{selectedClient.city || 'Abidjan'} ({selectedClient.country || "Côte d'Ivoire"})
                            </span>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                          <p className="text-xs font-extrabold uppercase text-[#526581] mb-1">
                            Notes CRM enregistrées
                          </p>
                          <p className="text-xs text-[#101828] leading-relaxed">
                            {selectedClient.notes || 'Aucune note particulière sur ce client.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (ficheTab === 'history') {
                  return (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-[#526581] uppercase">
                        Chronologie des opérations avec {selectedClient.name}
                      </p>
                      {st.clientInvoices.length === 0 && st.clientQuotes.length === 0 ? (
                        <p className="text-sm text-[#526581] py-4 text-center">Aucun document pour le moment.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {st.clientInvoices.map((inv) => (
                            <div
                              key={inv.id}
                              className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-extrabold text-[#1E4F91]">
                                  Facture {inv.number}
                                </span>
                                <span className="text-[#526581] ml-2">
                                  Émise le {formatDateFr(inv.issueDate)}
                                </span>
                              </div>
                              <span className="font-extrabold text-[#101828]">
                                {formatFCFA(inv.totalTtc)}
                              </span>
                            </div>
                          ))}
                          {st.clientQuotes.map((quo) => (
                            <div
                              key={quo.id}
                              className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-extrabold text-[#F47B20]">
                                  Devis {quo.number}
                                </span>
                                <span className="text-[#526581] ml-2">
                                  Émis le {formatDateFr(quo.issueDate)}
                                </span>
                              </div>
                              <span className="font-extrabold text-[#101828]">
                                {formatFCFA(quo.totalTtc)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                if (ficheTab === 'invoices') {
                  return (
                    <div className="space-y-2.5">
                      {st.clientInvoices.length === 0 ? (
                        <p className="text-sm text-[#526581] text-center py-4">Aucune facture pour ce client.</p>
                      ) : (
                        st.clientInvoices.map((inv) => (
                          <div
                            key={inv.id}
                            className="p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-extrabold text-[#1E4F91]">{inv.number}</p>
                              <p className="text-[#526581]">Échéance : {formatDateFr(inv.dueDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-extrabold text-[#101828]">{formatFCFA(inv.totalTtc)}</p>
                              <p className="text-[11px] text-[#526581]">
                                Reste : {formatFCFA(inv.remainingAmount)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                }

                if (ficheTab === 'quotes') {
                  return (
                    <div className="space-y-2.5">
                      {st.clientQuotes.length === 0 ? (
                        <p className="text-sm text-[#526581] text-center py-4">Aucun devis pour ce client.</p>
                      ) : (
                        st.clientQuotes.map((q) => (
                          <div
                            key={q.id}
                            className="p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-extrabold text-[#101828]">{q.number}</p>
                              <p className="text-[#526581]">Validité : {formatDateFr(q.expiryDate)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-extrabold text-[#1E4F91]">{formatFCFA(q.totalTtc)}</p>
                              <span className="text-[10px] font-bold uppercase text-[#F47B20]">
                                {q.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                }

                if (ficheTab === 'payments') {
                  return (
                    <div className="space-y-2.5">
                      {st.clientPayments.length === 0 ? (
                        <p className="text-sm text-[#526581] text-center py-4">Aucun règlement enregistré pour ce client.</p>
                      ) : (
                        st.clientPayments.map((p) => (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs"
                          >
                            <div>
                              <p className="font-extrabold text-[#15803D]">
                                +{formatFCFA(p.amount)} ({p.invoiceNumber})
                              </p>
                              <p className="text-[#526581]">Réf : {p.reference || '—'}</p>
                            </div>
                            <span className="text-[#526581]">{formatDateFr(p.paidAt)}</span>
                          </div>
                        ))
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold uppercase text-[#101828]">
                      Notes commerciales &amp; préférences du client
                    </label>
                    <textarea
                      rows={4}
                      value={crmNoteDraft}
                      onChange={(e) => setCrmNoteDraft(e.target.value)}
                      placeholder="Ajoutez vos observations..."
                      className="w-full p-3.5 rounded-xl border border-[#E2E8F0] text-sm text-[#101828] focus:outline-none focus:border-[#1E4F91]"
                    />
                    <div className="flex items-center justify-between">
                      {noteSavedBanner ? (
                        <span className="text-xs font-bold text-[#15803D] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Notes enregistrées !
                        </span>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={handleSaveCrmNotes}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1E4F91] text-white text-xs font-bold cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Enregistrer la note
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Import Clients Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2E8F0] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#101828]">
                Importer des clients (Format CSV)
              </h3>
              <button
                onClick={() => setImportModalOpen(false)}
                className="p-1.5 rounded-lg text-[#526581] hover:text-[#101828]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#526581]">
              Collez vos lignes au format :{' '}
              <code className="bg-[#F5F7FA] px-1.5 py-0.5 rounded font-mono text-[#1E4F91]">
                Nom;Entreprise;Email;Téléphone;Adresse;Ville
              </code>
            </p>
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <textarea
                rows={4}
                required
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="Exemple : Jean Dupont;Dupont SARL;jean@dupont.ci;+225 07 10 20 30 40;Zone 4;Abidjan"
                className="w-full p-3 rounded-xl border border-[#E2E8F0] text-xs font-mono text-[#101828]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#526581]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F47B20] text-white text-xs font-extrabold cursor-pointer"
                >
                  Importer dans FAKTELIO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            setNotificationMsg(editingClient ? 'Client mis à jour.' : 'Nouveau client créé avec succès.');
            loadAll();
          }}
        />
      )}
    </div>
  );
}
