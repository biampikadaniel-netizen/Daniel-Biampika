import React, { useState } from 'react';
import { X, Zap, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA, uid } from '../../services/storage';
import { LineItem } from '../../types';

export function FastInvoiceModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { user } = useAuth();
  if (!user) return null;

  const clients = workspaceService.getClients(user.id);
  const products = workspaceService.getProducts(user.id);
  const settings = workspaceService.getSettings(user.id);

  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || 'new');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('+225 ');
  const [paidNow, setPaidNow] = useState(false);

  const [items, setItems] = useState<LineItem[]>([
    {
      id: uid('line'),
      productId: products[0]?.id,
      description: products[0]?.name || 'Prestation professionnelle',
      quantity: 1,
      unitPrice: products[0]?.unitPrice || 150000,
      vatRate: settings.defaultVatRate || 18,
      totalHt: products[0]?.unitPrice || 150000,
    },
  ]);

  const handleProductPick = (lineId: string, productId: string) => {
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
        const next = { ...item, ...patch };
        next.totalHt = (Number(next.quantity) || 0) * (Number(next.unitPrice) || 0);
        return next;
      })
    );
  };

  const subtotalHt = items.reduce((s, i) => s + i.totalHt, 0);
  const totalVat = items.reduce((s, i) => s + Math.round((i.totalHt * i.vatRate) / 100), 0);
  const totalTtc = subtotalHt + totalVat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let client = clients.find((c) => c.id === selectedClientId);
    if (!client || selectedClientId === 'new') {
      client = workspaceService.saveClient(user.id, {
        name: newClientName.trim() || 'Client Express',
        phone: newClientPhone.trim() || '+225 07 00 00 00 00',
        city: 'Abidjan',
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

    workspaceService.saveInvoice(user.id, {
      number: workspaceService.getNextInvoiceNumber(user.id),
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      clientCompany: client.company,
      clientAddress: client.address,
      issueDate: today,
      dueDate: due,
      items,
      subtotalHt,
      totalVat,
      discountRate: 0,
      totalTtc,
      paidAmount: paidNow ? totalTtc : 0,
      remainingAmount: paidNow ? 0 : totalTtc,
      status: paidNow ? 'paid' : 'sent',
      terms: settings.paymentTerms,
    });

    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto">
        <div className="px-6 py-4 bg-gradient-to-r from-[#0D2B21] via-[#123A2C] to-[#215C46] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#A9BDBC]" />
            <h2 className="text-base font-extrabold">
              Facture Express FAKTELIO (+30 secondes)
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/15 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#101828] uppercase mb-1">
              1. Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''} — {c.phone}
                </option>
              ))}
              <option value="new">+ Nouveau client rapide</option>
            </select>
          </div>

          {selectedClientId === 'new' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <input
                type="text"
                required
                placeholder="Nom du client *"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm"
              />
              <input
                type="text"
                placeholder="Téléphone WhatsApp"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm"
              />
            </div>
          )}

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#101828] uppercase">
                2. Produits / Prestations
              </label>
              <button
                type="button"
                onClick={() =>
                  setItems([
                    ...items,
                    {
                      id: uid('line'),
                      description: 'Article supplémentaire',
                      quantity: 1,
                      unitPrice: 50000,
                      vatRate: 18,
                      totalHt: 50000,
                    },
                  ])
                }
                className="text-xs font-bold text-[#215C46] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#F7FAF8] border border-[#D9E7E3] space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <select
                    value={item.productId || ''}
                    onChange={(e) => handleProductPick(item.id, e.target.value)}
                    className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-white border border-[#D9E7E3] text-xs font-semibold focus:border-[#215C46] focus:outline-none"
                  >
                    <option value="">-- Catalogue --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatFCFA(p.unitPrice)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLine(item.id, { description: e.target.value })}
                    className="sm:col-span-7 px-2.5 py-1.5 rounded-lg bg-white border border-[#D9E7E3] text-xs font-semibold focus:border-[#215C46] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateLine(item.id, { quantity: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9E7E3] text-xs font-bold focus:border-[#215C46] focus:outline-none"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateLine(item.id, { unitPrice: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#D9E7E3] text-xs font-bold focus:border-[#215C46] focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3 text-right text-xs font-extrabold text-[#215C46]">
                    {formatFCFA(item.totalHt)}
                  </div>
                  <div className="col-span-1 text-right">
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

          <div className="p-4 rounded-xl bg-[#D9E7E3]/35 border border-[#215C46]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-[#10241D] cursor-pointer">
              <input
                type="checkbox"
                checked={paidNow}
                onChange={(e) => setPaidNow(e.target.checked)}
                className="w-4 h-4 rounded text-[#215C46] focus:ring-[#215C46]"
              />
              Payée immédiatement (Espèces / Mobile Money)
            </label>
            <div className="text-right">
              <span className="text-xs text-[#4A635A] mr-2">Total TTC :</span>
              <span className="text-lg font-black text-[#215C46]">{formatFCFA(totalTtc)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D9E7E3] text-xs font-bold text-[#4A635A] hover:bg-[#F7FAF8] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D9E7E3]" />
              Générer la facture FAKTELIO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
