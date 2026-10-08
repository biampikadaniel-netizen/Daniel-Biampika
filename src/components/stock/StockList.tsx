import React, { useState, useEffect } from 'react';
import {
  Boxes,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  History,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { workspaceService } from '../../services/storage';
import { Product, StockMovement } from '../../types';

export function StockList() {
  const { user } = useAuth();
  const { navigate } = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [moveType, setMoveType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState(5);
  const [reason, setReason] = useState('');

  const loadStock = () => {
    if (!user) return;
    const prods = workspaceService.getProducts(user.id).filter((p) => p.type === 'product');
    setProducts(prods);
    if (!selectedProductId && prods.length > 0) {
      setSelectedProductId(prods[0].id);
    }
    setMovements(workspaceService.getStockMovements(user.id));
  };

  useEffect(() => {
    loadStock();
  }, [user]);

  if (!user) return null;

  const lowStock = products.filter((p) => p.stock <= p.minStockAlert);

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || quantity <= 0) return;
    workspaceService.adjustStock(
      user.id,
      selectedProductId,
      moveType,
      quantity,
      reason || (moveType === 'in' ? 'Réapprovisionnement stock' : 'Sortie manuelle de stock')
    );
    setReason('');
    loadStock();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
          Gestion de Stock &amp; Mouvements FAKTELIO
        </h1>
        <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
          Stock disponible, seuils minimums, alertes de rupture, entrées, sorties et historique horodaté.
        </p>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-[#FEE2E2]/60 border border-[#DC2626]/30 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0" />
          <div className="text-xs">
            <p className="font-extrabold text-[#101828]">
              {lowStock.length} article(s) ont atteint le seuil d&apos;alerte minimum :
            </p>
            <p className="text-[#526581]">
              {lowStock
                .map((p) => `${p.name} (Stock: ${p.stock} / Seuil: ${p.minStockAlert})`)
                .join(' • ')}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stock Available & Movement Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
            <h2 className="text-base font-extrabold text-[#101828] mb-4 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#F47B20]" />
              Enregistrer une Entrée / Sortie
            </h2>

            {products.length === 0 ? (
              <div className="py-6 px-4 text-center bg-[#F5F7FA] rounded-xl border border-dashed border-[#CBD5E1]">
                <Package className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#101828]">
                  Aucun produit physique dans le catalogue
                </p>
                <p className="text-[11px] text-[#526581] mt-1 mb-3">
                  Pour gérer le stock, ajoutez un article physique avec une quantité initiale.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="px-4 py-2 rounded-xl bg-[#F47B20] text-white text-xs font-bold hover:bg-[#FF7A21] cursor-pointer"
                >
                  + Ajouter un produit
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdjust} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#101828] mb-1">Produit *</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm font-semibold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.reference}] {p.name} (Stock actuel : {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMoveType('in')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border cursor-pointer ${
                      moveType === 'in'
                        ? 'bg-[#DCFCE7] text-[#15803D] border-[#16A34A]'
                        : 'bg-[#F5F7FA] text-[#526581] border-[#E2E8F0]'
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    Entrée (+ Stock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoveType('out')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border cursor-pointer ${
                      moveType === 'out'
                        ? 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]'
                        : 'bg-[#F5F7FA] text-[#526581] border-[#E2E8F0]'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Sortie (- Stock)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#101828] mb-1">Quantité *</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#101828] mb-1">Motif</label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Ex: Réception commande..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1E4F91] hover:bg-[#163C70] text-white text-xs font-extrabold cursor-pointer"
                >
                  Valider le mouvement de stock
                </button>
              </form>
            )}
          </div>

          {/* Current Stock Table */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-[#101828]">État des stocks par produit</h3>
            {products.length === 0 ? (
              <p className="text-xs text-[#526581] italic">Aucun produit physique dans le catalogue.</p>
            ) : (
              products.map((p) => {
                const alert = p.stock <= p.minStockAlert;
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-[#101828]">{p.name}</p>
                      <p className="text-[11px] text-[#526581]">
                        Réf: {p.reference} • Seuil minimum : {p.minStockAlert}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        alert ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#DCFCE7] text-[#15803D]'
                      }`}
                    >
                      {p.stock} {p.unit}(s)
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Stock Movements History */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
          <h2 className="text-base font-extrabold text-[#101828] mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-[#1E4F91]" />
            Historique des entrées et sorties ({movements.length})
          </h2>

          {movements.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <History className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2.5" />
              <p className="text-sm font-bold text-[#101828]">Aucun mouvement de stock</p>
              <p className="text-xs text-[#526581] max-w-sm mx-auto mt-1">
                Toutes les entrées, sorties manuelles et ventes facturées s&apos;afficheront ici automatiquement.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {movements.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          m.type === 'in'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#FEE2E2] text-[#DC2626]'
                        }`}
                      >
                        {m.type === 'in' ? `+${m.quantity} Entrée` : `-${m.quantity} Sortie`}
                      </span>
                      <span className="text-xs font-extrabold text-[#101828]">{m.productName}</span>
                    </div>
                    <p className="text-xs text-[#526581] mt-1">{m.reason}</p>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-[#1E4F91]">
                      Stock : {m.previousStock} → {m.newStock}
                    </div>
                    <div className="text-[10px] text-[#526581]">
                      {new Date(m.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
