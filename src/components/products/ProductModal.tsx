import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { workspaceService } from '../../services/storage';

export function ProductModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.id || '';

  const [type, setType] = useState<'product' | 'service'>(product?.type || 'product');
  const [category, setCategory] = useState(product?.category || (type === 'service' ? 'Prestations' : 'Matériel'));
  const [reference, setReference] = useState(product?.reference || `REF-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [unitPrice, setUnitPrice] = useState<number | string>(product?.unitPrice ?? 0);
  const [vatRate, setVatRate] = useState<number>(product?.vatRate ?? 18);
  const [unit, setUnit] = useState(product?.unit || 'unité');
  const [stock, setStock] = useState<number | string>(product?.stock ?? 0);
  const [minStockAlert, setMinStockAlert] = useState<number | string>(product?.minStockAlert ?? 0);
  const [error, setError] = useState('');

  if (!user || !companyId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom de l'article est requis.");
      return;
    }

    workspaceService.saveProduct(companyId, {
      id: product?.id,
      type,
      category: category.trim() || (type === 'service' ? 'Prestations' : 'Matériel'),
      reference: reference.trim(),
      name: name.trim(),
      description: description.trim(),
      unitPrice: Number(unitPrice) || 0,
      vatRate: Number(vatRate) || 0,
      unit,
      stock: type === 'service' ? 0 : Number(stock) || 0,
      minStockAlert: type === 'service' ? 0 : Number(minStockAlert) || 0,
    });

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#1E4F91] text-white flex items-center justify-between">
          <h2 className="text-base font-extrabold">
            {product ? 'Modifier l’article du catalogue' : 'Nouvel article du catalogue'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/15 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType('product');
                if (category === 'Prestations') setCategory('Matériel');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                type === 'product'
                  ? 'bg-[#1E4F91] text-white border-[#1E4F91]'
                  : 'bg-[#F5F7FA] text-[#526581] border-[#E2E8F0]'
              }`}
            >
              Produit physique (stock)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('service');
                if (category === 'Matériel') setCategory('Prestations');
              }}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                type === 'service'
                  ? 'bg-[#1E4F91] text-white border-[#1E4F91]'
                  : 'bg-[#F5F7FA] text-[#526581] border-[#E2E8F0]'
              }`}
            >
              Prestation de service
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Référence *</label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Catégorie *</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Informatique, Énergie..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101828] mb-1">Nom de l&apos;article *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Désignation commerciale"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#101828] mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails techniques ou contenu de la prestation..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Prix (FCFA) *</label>
              <input
                type="number"
                required
                min={0}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">TVA (%)</label>
              <select
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm"
              >
                <option value={18}>18%</option>
                <option value={9}>9%</option>
                <option value={0}>0%</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Unité</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm"
              >
                <option value="unité">Unité</option>
                <option value="forfait">Forfait</option>
                <option value="heure">Heure</option>
                <option value="jour">Jour</option>
                <option value="lot">Lot</option>
              </select>
            </div>
          </div>

          {type === 'product' && (
            <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">
                  Stock initial
                </label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">
                  Seuil d&apos;alerte minimum
                </label>
                <input
                  type="number"
                  min={0}
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-sm font-bold"
                />
              </div>
            </div>
          )}

          <div className="pt-3 flex justify-end gap-2.5 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#526581] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F47B20] hover:bg-[#FF7A21] text-white text-xs font-extrabold cursor-pointer"
            >
              {product ? 'Mettre à jour' : 'Enregistrer dans le catalogue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
