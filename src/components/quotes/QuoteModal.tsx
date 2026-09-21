import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  clientsStorage,
  productsStorage,
  quotesStorage,
  settingsStorage,
} from '../../services/storage';
import type { LineItem, Quote } from '../../types';
import { X, Plus, Trash2, FileText, AlertCircle } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCreated: (quote: Quote) => void;
  onOpenNewClient: () => void;
}

export function QuoteModal({
  isOpen,
  onClose,
  onQuoteCreated,
  onOpenNewClient,
}: QuoteModalProps) {
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
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [notes, setNotes] = useState<string>('Offre valable 30 jours à compter de la date d’émission.');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  const handleItemChange = (index: number, updates: Partial<LineItem>) => {
    const next = [...items];
    const item = { ...next[index], ...updates };
    item.totalHt = (item.quantity || 0) * (item.unitPrice || 0);
    next[index] = item;
    setItems(next);
  };

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
      setError('Veuillez sélectionner un client.');
      return;
    }

    const selectedClient = clients.find((c) => c.id === selectedClientId);
    if (!selectedClient) {
      setError('Client introuvable.');
      return;
    }

    const validItems = items.filter((it) => it.description.trim() && it.quantity > 0);
    if (validItems.length === 0) {
      setError('Ajoutez au moins une ligne avec une désignation.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const nextNumber = quotesStorage.getNextNumber(currentUser.id);

    const newQuote = quotesStorage.add(currentUser.id, {
      number: nextNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      clientPhone: selectedClient.phone,
      clientCompany: selectedClient.company,
      clientAddress: selectedClient.address,
      issueDate: today,
      expiryDate: expiry,
      items: validItems,
      subtotalHt,
      totalVat,
      discountRate,
      totalTtc,
      status: 'sent',
      notes,
      terms: settings.paymentTerms,
    });

    onQuoteCreated(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-[#295294]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Nouveau Devis</h3>
              <p className="text-xs text-slate-500">Proposition commerciale chiffrée</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Client destinataire <span className="text-red-500">*</span>
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
              <p className="text-xs text-slate-400">Ajoutez d'abord un client.</p>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-teal-500 outline-none bg-white"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''} - {c.phone}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Prestations &amp; Articles
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
                    {products.length > 0 && (
                      <select
                        onChange={(e) => handleSelectProduct(idx, e.target.value)}
                        className="text-xs py-1 px-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-600"
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
                    placeholder="Description du produit ou service..."
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
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
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
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">TVA (%)</span>
                      <select
                        value={item.vatRate}
                        onChange={(e) => handleItemChange(idx, { vatRate: parseInt(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Validité de l'offre
              </label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                <option value={15}>15 jours</option>
                <option value={30}>30 jours (Standard)</option>
                <option value={60}>60 jours</option>
                <option value={90}>90 jours</option>
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
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1.5 text-xs">
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
            <div className="flex justify-between text-base font-extrabold text-blue-900 pt-2 border-t border-blue-200">
              <span>Total TTC :</span>
              <span>{totalTtc.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-gradient-to-tr from-[#295294] to-blue-600 hover:opacity-90 text-xs font-extrabold text-white shadow-md shadow-blue-900/20 cursor-pointer"
            >
              Créer le devis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
