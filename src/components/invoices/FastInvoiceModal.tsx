import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  clientsStorage,
  productsStorage,
  invoicesStorage,
  settingsStorage,
} from '../../services/storage';
import type { Client, Product, LineItem, Invoice } from '../../types';
import { X, Plus, Trash2, Zap, Check, AlertCircle, Building2 } from 'lucide-react';

interface FastInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
  onOpenNewClient: () => void;
}

export function FastInvoiceModal({
  isOpen,
  onClose,
  onInvoiceCreated,
  onOpenNewClient,
}: FastInvoiceModalProps) {
  const { currentUser } = useAuth();
  if (!isOpen || !currentUser) return null;

  const clients = clientsStorage.getAll(currentUser.id);
  const products = productsStorage.getAll(currentUser.id);
  const settings = settingsStorage.getSettings(currentUser.id);

  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 'line_' + Math.random().toString(36).substring(2, 7),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: settings.defaultVatRate || 18,
      totalHt: 0,
    },
  ]);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [dueDateDays, setDueDateDays] = useState<number>(15);
  const [notes, setNotes] = useState<string>('Merci pour votre confiance !');
  const [error, setError] = useState<string | null>(null);

  // Auto-set first client if selectedClientId is empty
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  // Recalculate line totalHt
  const handleItemChange = (index: number, updates: Partial<LineItem>) => {
    const next = [...items];
    const item = { ...next[index], ...updates };
    item.totalHt = (item.quantity || 0) * (item.unitPrice || 0);
    next[index] = item;
    setItems(next);
  };

  // Quick select a product from catalog
  const handleSelectProduct = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    handleItemChange(index, {
      productId: product.id,
      description: product.name,
      unitPrice: product.unitPrice,
      vatRate: product.vatRate,
    });
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: 'line_' + Math.random().toString(36).substring(2, 7),
        description: '',
        quantity: 1,
        unitPrice: 0,
        vatRate: settings.defaultVatRate || 18,
        totalHt: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotalHt = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const discountAmount = (subtotalHt * (discountRate || 0)) / 100;
  const netHt = Math.max(0, subtotalHt - discountAmount);
  const totalVat = items.reduce(
    (sum, it) => sum + ((it.quantity * it.unitPrice * (1 - (discountRate || 0) / 100)) * (it.vatRate || 0)) / 100,
    0
  );
  const totalTtc = Math.round(netHt + totalVat);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedClientId) {
      setError('Veuillez sélectionner un client ou en ajouter un nouveau.');
      return;
    }

    const selectedClient = clients.find((c) => c.id === selectedClientId);
    if (!selectedClient) {
      setError('Client introuvable.');
      return;
    }

    const validItems = items.filter((it) => it.description.trim() && it.quantity > 0);
    if (validItems.length === 0) {
      setError('Ajoutez au moins une ligne avec une désignation et un prix.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + dueDateDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const nextNumber = invoicesStorage.getNextNumber(currentUser.id);

    const newInvoice = invoicesStorage.add(currentUser.id, {
      number: nextNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      clientPhone: selectedClient.phone,
      clientCompany: selectedClient.company,
      clientAddress: selectedClient.address,
      issueDate: today,
      dueDate: due,
      items: validItems,
      subtotalHt,
      totalVat,
      discountRate,
      totalTtc,
      paidAmount: 0,
      remainingAmount: totalTtc,
      status: 'sent',
      notes,
      terms: settings.paymentTerms,
    });

    onInvoiceCreated(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <Zap className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Facture rapide (⚡ &lt; 30s)</h3>
              <p className="text-xs text-slate-500">Création instantanée sans ressaisie</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Client selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Choisir le client <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={onOpenNewClient}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Nouveau client
              </button>
            </div>

            {clients.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center">
                <p className="text-xs text-slate-500 mb-2">Aucun client enregistré pour l'instant.</p>
                <button
                  type="button"
                  onClick={onOpenNewClient}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold shadow-xs"
                >
                  Ajouter mon premier client
                </button>
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-teal-500 outline-none bg-white cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''} - {c.phone}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 2. Items Table */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Articles &amp; Prestations
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter une ligne
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center gap-2">
                    {/* Catalog picker if products exist */}
                    {products.length > 0 && (
                      <select
                        onChange={(e) => handleSelectProduct(idx, e.target.value)}
                        className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-600 focus:border-teal-500 outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          📦 Choisir du catalogue...
                        </option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.unitPrice.toLocaleString('fr-FR')} FCFA)
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="flex-1" />

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, { description: e.target.value })}
                    placeholder="Désignation du produit ou prestation..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none bg-white"
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Quantité</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold focus:border-teal-500 outline-none bg-white"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Prix unitaire (FCFA)</span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, { unitPrice: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold focus:border-teal-500 outline-none bg-white"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">TVA (%)</span>
                      <select
                        value={item.vatRate}
                        onChange={(e) => handleItemChange(idx, { vatRate: parseInt(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold focus:border-teal-500 outline-none bg-white"
                      >
                        <option value={0}>0% (Exonéré)</option>
                        <option value={18}>18% (Standard)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Due Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Échéance de règlement
              </label>
              <select
                value={dueDateDays}
                onChange={(e) => setDueDateDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none bg-white"
              >
                <option value={0}>Paiement immédiat</option>
                <option value={7}>Sous 7 jours</option>
                <option value={15}>Sous 15 jours</option>
                <option value={30}>Sous 30 jours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Remise globale (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountRate}
                onChange={(e) => setDiscountRate(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Total Box */}
          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/70 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Sous-total HT :</span>
              <span className="font-bold">{subtotalHt.toLocaleString('fr-FR')} FCFA</span>
            </div>
            {discountRate > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Remise ({discountRate}%) :</span>
                <span className="font-bold">-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>TVA totale :</span>
              <span className="font-bold">{totalVat.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-teal-900 pt-2 border-t border-teal-200">
              <span>Total TTC à payer :</span>
              <span>{totalTtc.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-xs font-extrabold text-white shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Générer la facture immédiatement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
