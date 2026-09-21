import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productsStorage } from '../../services/storage';
import type { Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  Tag,
  Edit2,
  Trash2,
  Boxes,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ProductsListProps {
  onOpenNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onNavigateStock: () => void;
}

export function ProductsList({
  onOpenNewProduct,
  onEditProduct,
  onNavigateStock,
}: ProductsListProps) {
  const { currentUser, refreshUser } = useAuth();
  const [filterType, setFilterType] = useState<'all' | 'product' | 'service'>('all');
  const [search, setSearch] = useState('');

  if (!currentUser) return null;

  const allProducts = productsStorage.getAll(currentUser.id);

  const filtered = allProducts.filter((p) => {
    if (filterType !== 'all' && p.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRef = p.reference.toLowerCase().includes(q);
      if (!matchName && !matchRef) return false;
    }
    return true;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous supprimer « ${name} » du catalogue ?`)) {
      productsStorage.delete(currentUser.id, id);
      refreshUser();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Produits &amp; Services
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez votre catalogue de prix, prestations de services et articles marchands.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateStock}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
          >
            <Boxes className="w-4 h-4 text-orange-600" />
            <span>Gestion du Stock</span>
          </button>

          <button
            onClick={onOpenNewProduct}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 transition-transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un article</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 p-1 rounded-2xl">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'product', label: '📦 Produits' },
              { id: 'service', label: '💼 Services' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  filterType === tab.id
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
              placeholder="Rechercher par nom ou référence..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-teal-500 outline-none bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center border-t border-slate-100 mt-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">Aucun produit ou service</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Ajoutez vos tarifs pour les injecter automatiquement lors de la création de vos factures en 1 clic.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-slate-100 pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Référence</th>
                  <th className="py-3 px-3">Désignation</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-right">Prix HT</th>
                  <th className="py-3 px-3 text-center">TVA</th>
                  <th className="py-3 px-3 text-center">Stock</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{item.reference}</td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.type === 'product'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.type === 'product' ? 'Produit' : 'Service'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                      {item.unitPrice.toLocaleString('fr-FR')} FCFA{' '}
                      <span className="text-[10px] text-slate-400 font-normal">/{item.unit}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-600">{item.vatRate}%</td>
                    <td className="py-3.5 px-3 text-center">
                      {item.type === 'product' ? (
                        <span
                          className={`font-bold ${
                            item.stock === 0
                              ? 'text-red-600'
                              : item.stock <= item.minStockAlert
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {item.stock} {item.unit}s
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Illimité</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(item)}
                          title="Modifier l'article"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Supprimer l'article"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
