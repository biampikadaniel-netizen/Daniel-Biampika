import React, { useState, useEffect } from 'react';
import {
  FilePlus2,
  UserPlus,
  Plus,
  Trash2,
  Eye,
  Download,
  Send,
  MessageCircle,
  Save,
  CheckCircle2,
  Calculator,
  Calendar,
  Percent,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { workspaceService, formatFCFA, uid } from '../../services/storage';
import { Client, Product, LineItem, Invoice } from '../../types';
import { InvoiceDetailModal } from '../invoices/InvoiceDetailModal';

export function BillingView({ onSaved }: { onSaved?: () => void }) {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Step 1: Select or Create Client
  const [clientId, setClientId] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('+225 ');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('Abidjan');

  // Invoice Metadata
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    () => new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );

  // Steps 2, 3, 4, 5: Products/Services, Quantities, Prices, VAT
  const [items, setItems] = useState<LineItem[]>([
    {
      id: uid('line'),
      description: 'Prestation de service ou produit',
      quantity: 1,
      unitPrice: 150000,
      vatRate: 18,
      totalHt: 150000,
    },
  ]);

  // Extras: Discount, Terms, Notes
  const [discountRate, setDiscountRate] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [paidImmediately, setPaidImmediately] = useState(false);

  // Preview / Feedback state
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadedClients = workspaceService.getClients(user.id);
    const loadedProducts = workspaceService.getProducts(user.id);
    const settings = workspaceService.getSettings(user.id);

    setClients(loadedClients);
    setProducts(loadedProducts);
    if (loadedClients.length > 0) {
      setClientId(loadedClients[0].id);
    } else {
      setIsNewClient(true);
    }

    setInvoiceNumber(workspaceService.getNextInvoiceNumber(user.id));
    setPaymentTerms(settings.paymentTerms);
  }, [user]);

  if (!user) return null;

  const handleSelectCatalogueProduct = (lineId: string, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === lineId
          ? {
              ...item,
              productId: prod.id,
              description: prod.name,
              unitPrice: prod.unitPrice,
              vatRate: prod.vatRate,
              totalHt: item.quantity * prod.unitPrice,
            }
          : item
      )
    );
  };

  const updateLine = (lineId: string, patch: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== lineId) return item;
        const updated = { ...item, ...patch };
        updated.totalHt = Math.max(0, Number(updated.quantity) || 0) * Math.max(0, Number(updated.unitPrice) || 0);
        return updated;
      })
    );
  };

  const addLine = () => {
    setItems((prev) => [
      ...prev,
      {
        id: uid('line'),
        description: '',
        quantity: 1,
        unitPrice: 50000,
        vatRate: 18,
        totalHt: 50000,
      },
    ]);
  };

  const removeLine = (lineId: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== lineId));
  };

  // Automatic Calculations: Sous-total, Remise, TVA, Total TTC
  const subtotalHt = items.reduce((sum, i) => sum + i.totalHt, 0);
  const discountAmount = Math.round((subtotalHt * Math.max(0, Math.min(100, discountRate))) / 100);
  const netHt = subtotalHt - discountAmount;
  const rawVat = items.reduce((sum, i) => sum + Math.round((i.totalHt * i.vatRate) / 100), 0);
  const totalVat = Math.round(rawVat * (1 - Math.max(0, Math.min(100, discountRate)) / 100));
  const totalTtc = netHt + totalVat;

  const resolveClient = (): Client => {
    if (!isNewClient) {
      const found = clients.find((c) => c.id === clientId);
      if (found) return found;
    }
    const created = workspaceService.saveClient(user.id, {
      name: newClientName.trim() || 'Client Comptoir',
      phone: newClientPhone.trim() || '+225 07 00 00 00 00',
      email: newClientEmail.trim(),
      address: newClientAddress.trim(),
      city: 'Abidjan',
    });
    setClients(workspaceService.getClients(user.id));
    setClientId(created.id);
    setIsNewClient(false);
    return created;
  };

  const buildInvoicePayload = (
    status: Invoice['status']
  ): Omit<Invoice, 'id' | 'companyId' | 'userId' | 'createdAt'> => {
    const targetClient = resolveClient();
    const paidAmount = status === 'paid' || paidImmediately ? totalTtc : 0;
    const remainingAmount = Math.max(0, totalTtc - paidAmount);
    const finalStatus: Invoice['status'] =
      status === 'draft' ? 'draft' : paidAmount >= totalTtc ? 'paid' : 'sent';

    return {
      number: invoiceNumber || workspaceService.getNextInvoiceNumber(user.id),
      clientId: targetClient.id,
      clientName: targetClient.name,
      clientEmail: targetClient.email,
      clientPhone: targetClient.phone,
      clientCompany: targetClient.company,
      clientAddress: targetClient.address,
      issueDate,
      dueDate,
      items: items.map((i) => ({
        ...i,
        description: i.description.trim() || 'Prestation / Article',
      })),
      subtotalHt,
      totalVat,
      discountRate,
      totalTtc,
      paidAmount,
      remainingAmount,
      status: finalStatus,
      notes,
      terms: paymentTerms,
    };
  };

  // Action 1: Enregistrer brouillon
  const handleSaveDraft = () => {
    const saved = workspaceService.saveInvoice(user.id, buildInvoicePayload('draft'));
    onSaved?.();
    setBannerMessage(`Brouillon ${saved.number} enregistré avec succès.`);
    setInvoiceNumber(workspaceService.getNextInvoiceNumber(user.id));
  };

  // Action 2: Prévisualiser
  const handlePreview = () => {
    const payload = buildInvoicePayload('sent');
    setPreviewInvoice({
      ...payload,
      id: 'preview_temp',
      userId: user.id,
      createdAt: Date.now(),
    });
  };

  // Action 3: Télécharger PDF
  const handleDownloadPdf = () => {
    const saved = workspaceService.saveInvoice(user.id, buildInvoicePayload('sent'));
    onSaved?.();
    setPreviewInvoice(saved);
    setBannerMessage(`Facture ${saved.number} générée — cliquez sur « Télécharger PDF / Imprimer » dans l'aperçu.`);
    setInvoiceNumber(workspaceService.getNextInvoiceNumber(user.id));
  };

  // Action 4: Envoyer (valider et envoyer la facture)
  const handleSendInvoice = () => {
    const saved = workspaceService.saveInvoice(user.id, buildInvoicePayload('sent'));
    onSaved?.();
    setBannerMessage(`Facture ${saved.number} (${formatFCFA(saved.totalTtc)}) validée et envoyée !`);
    setTimeout(() => {
      navigate('/invoices');
    }, 900);
  };

  // Action 5: Partager WhatsApp
  const handleShareWhatsApp = () => {
    const saved = workspaceService.saveInvoice(user.id, buildInvoicePayload('sent'));
    onSaved?.();
    const message = `Bonjour ${saved.clientName},\n\nVoici votre facture *${saved.number}* émise sur FAKTELIO par *${user.companyName}* :\n- Montant HT : ${formatFCFA(saved.subtotalHt)}\n- TVA : ${formatFCFA(saved.totalVat)}\n- Total TTC : *${formatFCFA(saved.totalTtc)}*\n- Date d'échéance : ${saved.dueDate}\n\nConditions : ${saved.terms || 'Paiement à réception'}\n\nMerci pour votre confiance !`;
    const cleanPhone = (saved.clientPhone || '').replace(/[^0-9]/g, '');
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
    setBannerMessage(`Facture ${saved.number} enregistrée et ouverte dans WhatsApp.`);
    setInvoiceNumber(workspaceService.getNextInvoiceNumber(user.id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#215C46]/10 text-[#215C46] text-xs font-extrabold uppercase tracking-wider mb-2">
            <FilePlus2 className="w-3.5 h-3.5 text-[#215C46]" />
            Studio de Facturation FAKTELIO
          </div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Créer une nouvelle facture professionnelle
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Suivez les 5 étapes ci-dessous. Tous les calculs (Sous-total, TVA, Remise, Total TTC) sont automatiques.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F5F7FA] text-xs font-bold text-[#101828] cursor-pointer"
          >
            Voir l&apos;historique des factures
          </button>
        </div>
      </div>

      {bannerMessage && (
        <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 text-[#15803D] text-xs sm:text-sm font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {bannerMessage}
          </span>
          <button
            onClick={() => setBannerMessage(null)}
            className="text-xs underline ml-4 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Main 5-Step Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Steps 1 to 5 */}
        <div className="lg:col-span-8 space-y-6">
          {/* ÉTAPE 1 : SÉLECTIONNER LE CLIENT & DATES */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F5F7FA] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#215C46] text-white text-xs font-extrabold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-extrabold text-[#101828]">
                  Étape 1 : Sélectionner le client
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsNewClient(!isNewClient)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#215C46] hover:underline cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {isNewClient ? 'Choisir un client existant' : '+ Créer un nouveau client'}
              </button>
            </div>

            {!isNewClient ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#526581] uppercase mb-1.5">
                    Client destinataire *
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#101828] focus:outline-none focus:border-[#215C46]"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company ? `— ${c.company}` : ''} ({c.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F5F7FA] p-4 rounded-xl border border-[#E2E8F0]">
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1">Nom du client *</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ex: Société Ivoirienne de Négoce"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1">Téléphone WhatsApp *</label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1">Email</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="client@entreprise.ci"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1">Adresse</label>
                  <input
                    type="text"
                    value={newClientAddress}
                    onChange={(e) => setNewClientAddress(e.target.value)}
                    placeholder="Cocody, Abidjan"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm"
                  />
                </div>
              </div>
            )}

            {/* Numéro & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#526581] uppercase mb-1">
                  Numéro de facture
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#215C46]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#526581] uppercase mb-1">
                  Date d&apos;émission
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#526581] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#101828]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#526581] uppercase mb-1">
                  Date d&apos;échéance
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#526581] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-sm text-[#101828]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ÉTAPES 2, 3, 4, 5 : PRODUITS/SERVICES, QUANTITÉS, PRIX, TVA */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5F7FA] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#123A2C] text-white text-xs font-extrabold flex items-center justify-center">
                  2–5
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-[#101828]">
                    Étapes 2 à 5 : Produits/Services, Quantités, Prix &amp; TVA
                  </h2>
                  <p className="text-xs text-[#526581]">
                    Sélectionnez depuis votre catalogue ou saisissez librement vos lignes
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#215C46]/10 hover:bg-[#215C46]/20 text-[#215C46] text-xs font-extrabold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Ajouter une ligne
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#215C46]">
                      Ligne #{idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(item.id)}
                        className="text-xs text-[#DC2626] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer
                      </button>
                    )}
                  </div>

                  {/* Step 2: Catalogue selector + Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-[#526581] mb-1">
                        Étape 2 : Choisir dans le catalogue
                      </label>
                      <select
                        value={item.productId || ''}
                        onChange={(e) => handleSelectCatalogueProduct(item.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#101828]"
                      >
                        <option value="">-- Saisie libre ou sélectionner --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.reference}] {p.name} — {formatFCFA(p.unitPrice)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-7">
                      <label className="block text-[11px] font-bold text-[#526581] mb-1">
                        Désignation sur la facture *
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLine(item.id, { description: e.target.value })}
                        placeholder="Description du produit ou de la prestation"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#101828]"
                      />
                    </div>
                  </div>

                  {/* Steps 3, 4, 5: Quantity, Price, VAT, Subtotal */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-[#526581] mb-1">
                        Étape 3 : Quantité
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateLine(item.id, { quantity: Math.max(1, Number(e.target.value) || 1) })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold text-[#101828]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#526581] mb-1">
                        Étape 4 : Prix Unitaire (FCFA)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={500}
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLine(item.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold text-[#101828]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#526581] mb-1">
                        Étape 5 : TVA (%)
                      </label>
                      <select
                        value={item.vatRate}
                        onChange={(e) => updateLine(item.id, { vatRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold text-[#101828]"
                      >
                        <option value={18}>18% (Standard)</option>
                        <option value={9}>9% (Réduit)</option>
                        <option value={0}>0% (Exonéré / HT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#526581] mb-1">
                        Total Ligne HT
                      </label>
                      <div className="w-full px-3 py-2 rounded-lg bg-[#215C46]/8 border border-[#215C46]/15 text-xs font-extrabold text-[#215C46]">
                        {formatFCFA(item.totalHt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPTIONS : REMISE, CONDITIONS DE PAIEMENT, NOTES */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#101828] uppercase tracking-wider">
              Remise, Conditions de paiement &amp; Notes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#526581] mb-1">
                  Remise commerciale (%)
                </label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-[#526581] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E2E8F0] text-sm font-bold text-[#101828]"
                  />
                </div>
              </div>

              <div className="flex items-end pb-1">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={paidImmediately}
                    onChange={(e) => setPaidImmediately(e.target.checked)}
                    className="w-4 h-4 rounded text-[#215C46]"
                  />
                  <span className="text-xs font-bold text-[#101828]">
                    Marquer comme payée comptant (encaissée immédiatement)
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#526581] mb-1">
                  Conditions de paiement
                </label>
                <textarea
                  rows={2}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="Ex: Paiement sous 15 jours par Wave, Orange Money ou virement."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#101828]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#526581] mb-1">
                  Notes ou mentions particulières
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Garantie 12 mois pièces et main d'œuvre."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs text-[#101828]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Live Automatic Summary & 5 Action Buttons */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[#101828]">
                <Calculator className="w-4 h-4 text-[#215C46]" />
                Calcul automatique
              </span>
              <span className="text-xs font-bold text-[#215C46] bg-[#215C46]/10 px-2.5 py-0.5 rounded-full">
                {items.length} article(s)
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#526581]">
                <span>Sous-total HT</span>
                <span className="font-bold text-[#101828]">{formatFCFA(subtotalHt)}</span>
              </div>

              <div className="flex justify-between text-[#15803D]">
                <span>Remise ({discountRate}%)</span>
                <span className="font-bold">-{formatFCFA(discountAmount)}</span>
              </div>

              <div className="flex justify-between text-[#526581]">
                <span>TVA cumulée</span>
                <span className="font-bold text-[#101828]">{formatFCFA(totalVat)}</span>
              </div>

              <div className="pt-3 border-t-2 border-[#215C46] flex items-baseline justify-between">
                <span className="text-base font-extrabold text-[#101828]">TOTAL TTC</span>
                <span className="text-2xl font-extrabold text-[#215C46]">
                  {formatFCFA(totalTtc)}
                </span>
              </div>
            </div>

            {/* Exact 5 Buttons from Section 14 */}
            <div className="pt-3 space-y-2.5">
              <button
                type="button"
                onClick={handleSendInvoice}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(33,92,70,0.3)] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Envoyer &amp; Valider la facture
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full py-2.5 px-4 rounded-xl bg-[#123A2C] hover:bg-[#0D2B21] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Télécharger PDF
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Partager WhatsApp
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] hover:bg-[#E2E8F0]/60 text-[#101828] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#215C46]" />
                  Prévisualiser
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F5F7FA] text-[#526581] hover:text-[#101828] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Enregistrer brouillon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewInvoice && (
        <InvoiceDetailModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}
    </div>
  );
}
