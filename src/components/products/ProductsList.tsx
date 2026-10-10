import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Package,
  Briefcase,
  Tag,
  Edit2,
  Trash2,
  Copy,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService, formatFCFA } from '../../services/storage';
import { Product } from '../../types';
import { ProductModal } from './ProductModal';

export function ProductsList() {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.id || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'product' | 'service' | 'categories'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const loadProducts = () => {
    if (!companyId) return;
    setProducts(workspaceService.getProducts(companyId));
  };

  useEffect(() => {
    loadProducts();
  }, [companyId]);

  if (!user) return null;

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.reference.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (activeTab === 'product' && p.type !== 'product') return false;
    if (activeTab === 'service' && p.type !== 'service') return false;
    if (selectedCategory !== 'Toutes' && (p.category || '') !== selectedCategory) return false;
    return true;
  });

  const handleDuplicate = (product: Product) => {
    workspaceService.duplicateProduct(companyId, product.id);
    setNotificationMsg(`Article "${product.name}" dupliqué avec succès.`);
    loadProducts();
  };

  const confirmDelete = () => {
    if (!deletingProduct) return;
    workspaceService.deleteProduct(companyId, deletingProduct.id);
    setDeletingProduct(null);
    setNotificationMsg('Article supprimé du catalogue.');
    loadProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Catalogue Produits, Services &amp; Catégories
          </h1>
          <p className="text-xs sm:text-sm text-[#4A635A] mt-0.5">
            Gérez vos références, tarifs, stocks réels et alertes de seuil minimum.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 text-[#D9E7E3]" />
          + Ajouter au catalogue
        </button>
      </div>

      {notificationMsg && (
        <div className="p-3.5 rounded-xl bg-[#215C46]/15 border border-[#215C46]/30 text-[#123A2C] text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#215C46]" />
            {notificationMsg}
          </span>
          <button onClick={() => setNotificationMsg(null)} className="text-xs underline cursor-pointer">
            Fermer
          </button>
        </div>
      )}

      {/* Tabs & Search */}
      {products.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#D9E7E3] shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedCategory('Toutes');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#215C46] text-white shadow-xs'
                    : 'bg-[#F7FAF8] text-[#4A635A] hover:text-[#101828] hover:bg-[#D9E7E3]/40'
                }`}
              >
                Tout ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('product')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'product'
                    ? 'bg-[#215C46] text-white shadow-xs'
                    : 'bg-[#F7FAF8] text-[#4A635A] hover:text-[#101828] hover:bg-[#D9E7E3]/40'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Produits ({products.filter((p) => p.type === 'product').length})
              </button>
              <button
                onClick={() => setActiveTab('service')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'service'
                    ? 'bg-[#215C46] text-white shadow-xs'
                    : 'bg-[#F7FAF8] text-[#4A635A] hover:text-[#101828] hover:bg-[#D9E7E3]/40'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Services ({products.filter((p) => p.type === 'service').length})
              </button>
              {categories.length > 0 && (
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-[#123A2C] text-white shadow-xs'
                      : 'bg-[#F7FAF8] text-[#4A635A] hover:text-[#101828] hover:bg-[#D9E7E3]/40'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Catégories ({categories.length})
                </button>
              )}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#4A635A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher nom, référence..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#D9E7E3] bg-[#F7FAF8]/70 focus:bg-white focus:outline-none focus:border-[#215C46] focus:ring-1 focus:ring-[#215C46]"
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#D9E7E3]">
              <span className="text-[11px] font-bold text-[#4A635A] uppercase">Filtrer par catégorie :</span>
              {['Toutes', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#215C46]/15 text-[#215C46] font-bold border border-[#215C46]/20'
                      : 'bg-[#F7FAF8] text-[#4A635A] hover:text-[#101828] hover:bg-[#D9E7E3]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table or Empty State */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Package className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-[#101828]">
              Votre catalogue est vide.
            </h3>
            <p className="text-xs text-[#4A635A] max-w-sm mx-auto mt-1 mb-5">
              Ajoutez vos premiers produits ou services pour créer des factures et devis en 1 clic.
            </p>
            <button
              onClick={() => {
                setEditingProduct(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-extrabold shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-[#D9E7E3]" />
              + Ajouter un produit
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-sm font-bold text-[#101828]">Aucun article ne correspond à votre filtre.</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveTab('all');
                setSelectedCategory('Toutes');
              }}
              className="mt-2 text-xs font-bold text-[#215C46] hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[rgba(33,92,70,0.08)] text-[11px] font-bold text-[#123A2C] uppercase tracking-wider border-b border-[rgba(33,92,70,0.15)]">
                  <th className="py-3.5 px-5">Référence</th>
                  <th className="py-3.5 px-5">Nom &amp; Description</th>
                  <th className="py-3.5 px-5">Catégorie</th>
                  <th className="py-3.5 px-5">Prix Unitaire</th>
                  <th className="py-3.5 px-5 text-center">TVA</th>
                  <th className="py-3.5 px-5">Stock réel</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(33,92,70,0.08)] text-sm">
                {filtered.map((item) => {
                  const isLowStock = item.type === 'product' && item.stock <= item.minStockAlert;
                  return (
                    <tr key={item.id} className="hover:bg-[rgba(169,189,188,0.12)] transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono text-xs font-black text-[#215C46] bg-[#215C46]/10 border border-[#215C46]/20 px-2.5 py-1 rounded-lg">
                          {item.reference}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 max-w-xs">
                        <div className="font-extrabold text-[#101828]">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-[#4A635A] truncate mt-0.5">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#F7FAF8] text-[#4A635A] border border-[#D9E7E3]">
                          {item.category || (item.type === 'service' ? 'Prestation' : 'Marchandise')}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-black text-[#101828]">
                        {formatFCFA(item.unitPrice)}
                        <span className="text-[11px] font-normal text-[#4A635A]"> / {item.unit}</span>
                      </td>
                      <td className="py-3.5 px-5 text-center text-xs font-bold text-[#4A635A]">
                        {item.vatRate}%
                      </td>
                      <td className="py-3.5 px-5">
                        {item.type === 'service' ? (
                          <span className="text-xs font-semibold text-[#4A635A]">
                            Prestation de service
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                                isLowStock
                                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                                  : 'bg-[#D9E7E3] text-[#123A2C]'
                              }`}
                            >
                              {item.stock} en stock
                            </span>
                            {item.minStockAlert > 0 && (
                              <span className="text-[11px] text-[#4A635A]">
                                (Seuil : {item.minStockAlert})
                              </span>
                            )}
                            {isLowStock && <AlertTriangle className="w-4 h-4 text-[#DC2626]" />}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(item);
                              setModalOpen(true);
                            }}
                            title="Modifier"
                            className="p-2 rounded-lg bg-[#D9E7E3]/40 hover:bg-[#215C46] text-[#101828] hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(item)}
                            title="Dupliquer"
                            className="p-2 rounded-lg bg-[#D9E7E3]/40 hover:bg-[#123A2C] text-[#101828] hover:text-white transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingProduct(item)}
                            title="Supprimer"
                            className="p-2 rounded-lg bg-[#FEE2E2]/60 hover:bg-[#DC2626] text-[#DC2626] hover:text-white transition-colors cursor-pointer"
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

      {/* Confirmation Modal before Deleting Product */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-3 text-[#DC2626]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-[#101828]">Confirmer la suppression</h3>
            </div>
            <p className="text-xs text-[#4A635A] leading-relaxed">
              Êtes-vous sûr de vouloir supprimer l&apos;article <strong>{deletingProduct.name}</strong> ?
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#4A635A] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-extrabold hover:bg-[#B91C1C] cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            setNotificationMsg(editingProduct ? 'Article mis à jour.' : 'Nouvel article ajouté au catalogue.');
            loadProducts();
          }}
        />
      )}
    </div>
  );
}
