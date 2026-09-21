import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productsStorage } from '../../services/storage';
import type { Product } from '../../types';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingDown,
  TrendingUp,
  X,
  Package,
} from 'lucide-react';

export function StockList() {
  const { currentUser, refreshUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'out' | 'low' | 'ok'>('all');
  const [search, setSearch] = useState('');

  // Stock Adjustment Modal
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(1);
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [adjustReason, setAdjustReason] = useState<string>('Réapprovisionnement fournisseur');

  if (!currentUser) return null;

  // Only products with physical stock tracked
  const products = productsStorage.getAll(currentUser.id).filter((p) => p.type === 'product');

  const filtered = products.filter((p) => {
    const isOut = p.stock === 0;
    const isLow = p.stock > 0 && p.stock <= p.minStockAlert;
    const isOk = p.stock > p.minStockAlert;

    if (filter === 'out' && !isOut) return false;
    if (filter === 'low' && !isLow) return false;
    if (filter === 'ok' && !isOk) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRef = p.reference.toLowerCase().includes(q);
      if (!matchName && !matchRef) return false;
    }
    return true;
  });

  // Total valuation
  const totalStockValue = products.reduce((sum, p) => sum + p.stock * p.unitPrice, 0);
  const outCount = products.filter((p) => p.stock === 0).length;
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStockAlert).length;
  const okCount = products.filter((p) => p.stock > p.minStockAlert).length;

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;

    const delta = adjustType === 'add' ? Math.abs(adjustDelta) : -Math.abs(adjustDelta);
    productsStorage.adjustStock(currentUser.id, adjustModalProduct.id, delta, adjustReason);
    refreshUser();
    setAdjustModalProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestion du Stock
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Suivi des quantités en temps réel avec décrémentation automatique sur factures.
          </p>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Valeur du stock
          </span>
          <p className="text-xl font-extrabold text-slate-900 mt-2 truncate">
            {totalStockValue.toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-semibold text-slate-500">FCFA</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{products.length} références physiques</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Stock optimal</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xl font-extrabold text-emerald-600 mt-2">{okCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Produits en quantité suffisante</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Stock faible</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-amber-600 mt-2">{lowCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sous le seuil d'alerte</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rupture de stock
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          </div>
          <p className="text-xl font-extrabold text-red-600 mt-2">{outCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Quantité à 0</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-2xl flex-wrap">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'ok', label: '🟢 Disponible' },
              { id: 'low', label: '🟠 Faible' },
              { id: 'out', label: '🔴 Rupture' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher article ou SKU..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <Boxes className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucun produit physique suivi</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Ajoutez des produits physiques dans le catalogue pour activer le suivi des stocks.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Produit</th>
                  <th className="py-3 px-3">Référence</th>
                  <th className="py-3 px-3 text-center">Quantité</th>
                  <th className="py-3 px-3 text-center">Seuil Min.</th>
                  <th className="py-3 px-3 text-center">Statut</th>
                  <th className="py-3 px-3 text-right">Prix Unitaire</th>
                  <th className="py-3 px-3 text-right">Valeur Stock</th>
                  <th className="py-3 px-3 text-right">Ajustement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => {
                  const isOut = item.stock === 0;
                  const isLow = item.stock > 0 && item.stock <= item.minStockAlert;
                  const stockValue = item.stock * item.unitPrice;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900">{item.name}</p>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600 font-semibold">{item.reference}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="text-sm font-extrabold text-slate-900">
                          {item.stock} {item.unit}s
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-medium">
                        {item.minStockAlert} {item.unit}s
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isOut
                              ? 'bg-red-100 text-red-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          {isOut ? 'Rupture' : isLow ? 'Stock faible' : 'Disponible'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium text-slate-700">
                        {item.unitPrice.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        {stockValue.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setAdjustModalProduct(item);
                            setAdjustDelta(5);
                            setAdjustType('add');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Ajuster stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Ajuster le stock</h3>
                <p className="text-xs text-slate-500 mt-0.5">{adjustModalProduct.name}</p>
              </div>
              <button
                onClick={() => setAdjustModalProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="mt-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-500">Stock actuel :</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {adjustModalProduct.stock} {adjustModalProduct.unit}s
                </span>
              </div>

              {/* Add or Deduct */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    adjustType === 'add'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  + Entrée en stock
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('remove')}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    adjustType === 'remove'
                      ? 'bg-white text-red-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  - Sortie / Perte
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Quantité à {adjustType === 'add' ? 'ajouter' : 'déduire'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-extrabold focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Motif de l'ajustement
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ex: Réception commande fournisseur"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-extrabold text-white shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  Valider l'ajustement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
