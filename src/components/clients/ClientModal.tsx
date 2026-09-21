import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clientsStorage } from '../../services/storage';
import type { Client } from '../../types';
import { X, UserPlus, Building2, Mail, Phone, MapPin, FileText, AlertCircle } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  clientToEdit?: Client | null;
  onClose: () => void;
  onClientSaved: (client: Client) => void;
}

export function ClientModal({
  isOpen,
  clientToEdit,
  onClose,
  onClientSaved,
}: ClientModalProps) {
  const { currentUser } = useAuth();
  if (!isOpen || !currentUser) return null;

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setCompany(clientToEdit.company || '');
      setEmail(clientToEdit.email || '');
      setPhone(clientToEdit.phone || '');
      setAddress(clientToEdit.address || '');
      setCity(clientToEdit.city || '');
      setNotes(clientToEdit.notes || '');
    } else {
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setNotes('');
    }
  }, [clientToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Le nom du client est requis.');
      return;
    }
    if (!phone.trim()) {
      setError('Le numéro de téléphone (WhatsApp) est requis.');
      return;
    }

    if (clientToEdit) {
      const updated = clientsStorage.update(currentUser.id, clientToEdit.id, {
        name: name.trim(),
        company: company.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim(),
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      if (updated) {
        onClientSaved(updated);
        onClose();
      }
    } else {
      const created = clientsStorage.add(currentUser.id, {
        name: name.trim(),
        company: company.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim(),
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClientSaved(created);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {clientToEdit ? 'Modifier le client' : 'Ajouter un nouveau client'}
              </h3>
              <p className="text-xs text-slate-500">Carnet d'adresses et facturation</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Ibrahim Diallo"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Entreprise (facultatif)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Diallo & Associés"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Téléphone (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+225 07 00 00 00 00"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domaine.ci"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Adresse postale / Quartier
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Boulevard Latrille"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Abidjan"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Notes internes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Conditions spécifiques, contact WhatsApp secondaire..."
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
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-extrabold text-white shadow-md shadow-purple-600/20 cursor-pointer"
            >
              {clientToEdit ? 'Enregistrer les modifications' : 'Ajouter le client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
