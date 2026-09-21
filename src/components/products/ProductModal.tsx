import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productsStorage, settingsStorage } from '../../services/storage';
import type { Product } from '../../types';
import { X, Package, Tag, DollarSign, Layers, AlertCircle } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onProductSaved: (product: Product) => void;
}

export function ProductModal({
  isOpen,
  productToEdit,
  onClose,
  onProductSaved,
}: ProductModalProps) {
  const { currentUser } = useAuth();
  if (!isOpen || !currentUser) return null;

  const settings = settingsStorage.getSettings(currentUser.id);

  const [type, setType] = useState<'product' | 'service'>('product');
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(settings.defaultVatRate || 18);
  const [unit, setUnit] = useState('unité');
  const [stock, setStock] = useState<number>(10);
  const [minStockAlert, setMinStockAlert] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setType(productToEdit.type);
      setName(productToEdit.name);
      setReference(productToEdit.reference);
      setDescription(productToEdit.description || '');
      setUnitPrice(productToEdit.unitPrice);
      setVatRate(productToEdit.vatRate);
      setUnit(productToEdit.unit);
      setStock(productToEdit.stock);
      setMinStockAlert(productToEdit.minStockAlert);
    } else {
      setType('product');
      setName('');
      setReference('REF-' + Math.floor(1000 + Math.random() * 9000));
      setDescription('');
      setUnitPrice(5000);
      setVatRate(settings.defaultVatRate || 18);
      setUnit('unité');
      setStock(10);
      setMinStockAlert(3);
    }
  }, [productToEdit, settings.defaultVatRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom du produit ou service est requis.');
      return;
    }
    if (unitPrice < 0) {
      setError('Le prix ne peut pas être négatif.');
      return;
    }

    if (productToEdit) {
      const updated = productsStorage.update(currentUser.id, productToEdit.id, {
        type,
        name: name.trim(),
        reference: reference.trim() || 'REF-001',
        description: description.trim() || undefined,
        unitPrice,
        vatRate,
        unit,
        stock: type === 'product' ? stock : 0,
        minStockAlert: type === 'product' ? minStockAlert : 0,
      });
      if (updated) {
        onProductSaved(updated);
        onClose();
      }
    } else {
      const created = productsStorage.add(currentUser.id, {
        type,
        name: name.trim(),
        reference: reference.trim() || 'REF-001',
        description: description.trim() || undefined,
        unitPrice,
        vatRate,
        unit,
        stock: type === 'product' ? stock : 0,
        minStockAlert: type === 'product' ? minStockAlert : 0,
      });
      onProductSaved(created);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-700">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {productToEdit ? 'Modifier l’article' : 'Ajouter un produit / service'}
              </h3>
              <p className="text-xs text-slate-500">Catalogue commercial &amp; stocks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType('product')}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                type === 'product' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📦 Produit physique
            </button>
            <button
              type="button"
              onClick={() => setType('service')}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                type === 'service' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              💼 Prestation / Service
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Désignation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ordinateur portable ou Audit SEO"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Référence / SKU
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="REF-001"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Prix unitaire (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                TVA (%)
              </label>
              <select
                value={vatRate}
                onChange={(e) => setVatRate(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:border-teal-500 outline-none bg-white"
              >
                <option value={0}>0%</option>
                <option value={18}>18%</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Unité
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:border-teal-500 outline-none bg-white"
              >
                <option value="unité">Unité</option>
                <option value="heure">Heure</option>
                <option value="jour">Jour</option>
                <option value="forfait">Forfait</option>
                <option value="lot">Lot</option>
                <option value="kg">Kg</option>
                <option value="mètre">Mètre</option>
              </select>
            </div>
          </div>

          {/* Stock fields only for physical products */}
          {type === 'product' && (
            <div className="grid grid-cols-2 gap-4 p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/60">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-900 mb-1.5">
                  Stock initial
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-orange-300 text-xs font-bold bg-white focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-orange-900 mb-1.5">
                  Seuil d'alerte min.
                </label>
                <input
                  type="number"
                  min="0"
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-orange-300 text-xs font-bold bg-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description (optionnel)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails techniques, garanties..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-extrabold text-white shadow-md shadow-orange-600/20 cursor-pointer"
            >
              {productToEdit ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
