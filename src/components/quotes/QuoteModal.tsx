import React, { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA, uid } from '../../services/storage';
import { LineItem } from '../../types';

export function QuoteModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.id || '';

  const clients = workspaceService.getClients(companyId);
  const products = workspaceService.getProducts(companyId);
  const settings = workspaceService.getSettings(companyId);

  const [clientId, setClientId] = useState(clients[0]?.id || 'new');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [notes, setNotes] = useState('Proposition commerciale valable 30 jours.');
  const [error, setError] = useState('');

  const [items, setItems] = useState<LineItem[]>([
    {
      id: uid('line'),
      productId: products[0]?.id,
      description: products[0]?.name || '',
      quantity: 1,
      unitPrice: products[0]?.unitPrice || 0,
      vatRate: settings.defaultVatRate || 18,
      totalHt: products[0]?.unitPrice || 0,
    },
  ]);

  if (!user || !companyId) return null;

  const handleProductSelect = (lineId: string, productId: string) => {
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
              totalHt: (Number(item.quantity) || 1) * prod.unitPrice,
            }
          : item
      )
    );
  };

  const updateLine = (lineId: string, patch: Partial<LineItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== lineId) return item;
        const next = { ...item, ...patch };
        const q = Math.max(0, Number(next.quantity) || 0);
        const p = Math.max(0, Number(next.unitPrice) || 0);
        next.totalHt = q * p;
        return next;
      })
    );
  };

  const subtotalHt = items.reduce((s, i) => s + (Number(i.totalHt) || 0), 0);
  const cleanDiscount = Math.max(0, Math.min(100, Number(discountRate) || 0));
  const discountAmt = Math.round((subtotalHt * cleanDiscount) / 100);
  const netHt = subtotalHt - discountAmt;
  const rawVat = items.reduce(
    (s, i) => s + Math.round(((Number(i.totalHt) || 0) * (Number(i.vatRate) || 0)) / 100),
    0
  );
  const totalVat = Math.round(rawVat * (1 - cleanDiscount / 100));
  const totalTtc = netHt + totalVat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let client = clients.find((c) => c.id === clientId);
    if (!client || clientId === 'new') {
      if (!newClientName.trim()) {
        setError('Veuillez renseigner le nom du client.');
        return;
      }
      client = workspaceService.saveClient(companyId, {
        name: newClientName.trim(),
        phone: newClientPhone.trim(),
        city: 'Abidjan',
      });
    }

    if (items.length === 0 || !items.some((i) => i.description.trim())) {
      setError('Veuillez renseigner au moins une ligne avec une désignation.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    workspaceService.saveQuote(companyId, {
      number: workspaceService.getNextQuoteNumber(companyId),
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      clientCompany: client.company,
      clientAddress: client.address,
      issueDate: today,
      expiryDate: expiry,
      items: items.map((i) => ({
        ...i,
        description: i.description.trim() || 'Prestation / Produit',
      })),
      subtotalHt,
      totalVat,
      discountRate: cleanDiscount,
      totalTtc,
      status: 'sent',
      notes,
      terms: settings.paymentTerms,
    });

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#D9E7E3] overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#0D2B21] text-white flex items-center justify-between border-b border-[#123A2C]">
          <h2 className="text-base font-extrabold">Nouveau Devis FAKTELIO</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/15 cursor-pointer text-[#A9BDBC] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#101828] mb-1">Client *</label>
              {clients.length === 0 ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Nom complet du client *"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Téléphone WhatsApp"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                  />
                </div>
              ) : (
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''} — {c.phone}
                    </option>
                  ))}
                  <option value="new">+ Saisir un nouveau client</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Remise (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-bold"
              />
            </div>
          </div>

          {clientId === 'new' && clients.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <input
                type="text"
                required
                placeholder="Nom du nouveau client *"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold"
              />
              <input
                type="text"
                placeholder="Téléphone WhatsApp"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs"
              />
            </div>
          )}

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#101828] uppercase">
                Lignes du devis ({items.length})
              </label>
              <button
                type="button"
                onClick={() =>
                  setItems([
                    ...items,
                    {
                      id: uid('line'),
                      description: '',
                      quantity: 1,
                      unitPrice: 0,
                      vatRate: settings.defaultVatRate || 18,
                      totalHt: 0,
                    },
                  ])
                }
                className="text-xs font-bold text-[#215C46] inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  {products.length > 0 && (
                    <select
                      value={item.productId || ''}
                      onChange={(e) => handleProductSelect(item.id, e.target.value)}
                      className="sm:col-span-4 px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold"
                    >
                      <option value="">-- Depuis catalogue --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatFCFA(p.unitPrice)})
                        </option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    required
                    placeholder="Description de la prestation ou du produit *"
                    value={item.description}
                    onChange={(e) => updateLine(item.id, { description: e.target.value })}
                    className={`${products.length > 0 ? 'sm:col-span-8' : 'sm:col-span-12'} px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold`}
                  />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <label className="text-[10px] text-[#4A635A] block">Quantité</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateLine(item.id, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] text-[#4A635A] block">Prix Unit. HT</label>
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateLine(item.id, { unitPrice: Math.max(0, Number(e.target.value) || 0) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-bold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] text-[#4A635A] block">TVA %</label>
                    <select
                      value={item.vatRate}
                      onChange={(e) => updateLine(item.id, { vatRate: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold"
                    >
                      <option value={18}>18%</option>
                      <option value={9}>9%</option>
                      <option value={0}>0%</option>
                    </select>
                  </div>
                  <div className="col-span-2 text-right">
                    <label className="text-[10px] text-[#4A635A] block">Total HT</label>
                    <div className="text-xs font-extrabold text-[#215C46] py-1">
                      {formatFCFA(item.totalHt)}
                    </div>
                  </div>
                  <div className="col-span-1 text-right pt-3">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                        className="text-[#DC2626] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#DCE5DE] space-y-1 text-xs">
            <div className="flex justify-between text-[#65736B]">
              <span>Sous-total HT :</span>
              <strong className="text-[#17231D]">{formatFCFA(subtotalHt)}</strong>
            </div>
            {cleanDiscount > 0 && (
              <div className="flex justify-between text-[#176B4D]">
                <span>Remise ({cleanDiscount}%) :</span>
                <strong>-{formatFCFA(discountAmt)}</strong>
              </div>
            )}
            <div className="flex justify-between text-[#65736B]">
              <span>TVA ({settings.defaultVatRate}%) :</span>
              <strong className="text-[#17231D]">{formatFCFA(totalVat)}</strong>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#DCE5DE] text-sm">
              <span className="font-extrabold text-[#17231D]">Total Devis TTC :</span>
              <strong className="text-[#176B4D] font-extrabold text-base">{formatFCFA(totalTtc)}</strong>
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DCE5DE] text-xs font-bold text-[#65736B] hover:bg-[#F7F9F7] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#176B4D] hover:bg-[#104B38] text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              Créer le devis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
