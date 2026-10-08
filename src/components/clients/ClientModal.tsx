import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Client } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { workspaceService } from '../../services/storage';

export function ClientModal({
  client,
  onClose,
  onSaved,
}: {
  client: Client | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const companyId = user?.companyId || user?.id || '';

  const [name, setName] = useState(client?.name || '');
  const [company, setCompany] = useState(client?.company || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [email, setEmail] = useState(client?.email || '');
  const [address, setAddress] = useState(client?.address || '');
  const [city, setCity] = useState(client?.city || '');
  const [country, setCountry] = useState(client?.country || "Côte d'Ivoire");
  const [notes, setNotes] = useState(client?.notes || '');
  const [error, setError] = useState('');

  if (!user || !companyId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Le nom du client est requis.');
      return;
    }

    workspaceService.saveClient(companyId, {
      id: client?.id,
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      notes: notes.trim(),
    });

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#D9E7E3] overflow-hidden my-auto">
        <div className="px-6 py-4 bg-gradient-to-r from-[#0D2B21] via-[#123A2C] to-[#215C46] text-white flex items-center justify-between">
          <h2 className="text-base font-extrabold">
            {client ? 'Modifier la fiche client' : 'Nouveau client CRM'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Nom complet *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Ex: Kouamé N'Dri"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Entreprise</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Société Ivoire SARL"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">
                Téléphone (WhatsApp)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +225 07 00 00 00 00"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@client.com"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Adresse</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Zone 4 Rue du Canal"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Abidjan"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10241D] mb-1">Pays</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Ex: Côte d'Ivoire"
                className="w-full px-3 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#10241D] mb-1">Notes CRM</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Habitudes de paiement, conditions négociées, interlocuteur..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:outline-none focus:border-[#215C46]"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#D9E7E3] text-xs font-bold text-[#526581] hover:bg-[#F7FAF8] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              {client ? 'Enregistrer les modifications' : 'Créer le client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
