import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { teamStorage } from '../../services/storage';
import type { TeamMember } from '../../types';
import { Users, UserPlus, Trash2, Mail, Shield, CheckCircle2, X } from 'lucide-react';

export function TeamView() {
  const { currentUser } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'collaborator'>('collaborator');
  const [members, setMembers] = useState<TeamMember[]>(() => {
    return currentUser ? teamStorage.getAll(currentUser.id) : [];
  });

  if (!currentUser) return null;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember = teamStorage.add(currentUser.id, {
      name: name.trim(),
      email: email.trim(),
      role,
      status: 'invited',
    });

    setMembers([...members, newMember]);
    setName('');
    setEmail('');
    setIsInviteOpen(false);
  };

  const handleDelete = (id: string, memberName: string) => {
    if (window.confirm(`Retirer ${memberName} de l'équipe ?`)) {
      teamStorage.delete(currentUser.id, id);
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'admin':
        return { label: 'Administrateur', bg: 'bg-red-100 text-red-800' };
      case 'manager':
        return { label: 'Gestionnaire', bg: 'bg-blue-100 text-blue-800' };
      default:
        return { label: 'Collaborateur', bg: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestion de l'Équipe
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Invitez vos collaborateurs et attribuez des permissions selon leurs responsabilités.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Inviter un collaborateur</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Membres de votre organisation ({members.length + 1})
        </h2>

        <div className="overflow-x-auto border-t border-slate-100 pt-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-3">Collaborateur</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Rôle</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* Primary User (Owner) */}
              <tr className="bg-teal-50/40">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {currentUser.name}{' '}
                        <span className="text-[10px] font-extrabold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-md ml-1">
                          VOUS (Propriétaire)
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500">{currentUser.companyName}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-slate-600">{currentUser.email}</td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                    Administrateur
                  </span>
                </td>
                <td className="py-3.5 px-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Actif
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right text-slate-400 italic text-[11px]">—</td>
              </tr>

              {/* Invited Members */}
              {members.map((m) => {
                const r = getRoleLabel(m.role);

                return (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {m.name.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-900">{m.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{m.email}</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${r.bg}`}>
                        {r.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.status === 'active' ? 'Actif' : 'Invitation envoyée'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Inviter un collaborateur</h3>
                  <p className="text-xs text-slate-500">Accès sécurisé à votre espace entreprise</p>
                </div>
              </div>
              <button onClick={() => setIsInviteOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Fatou Traoré"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collaborateur@entreprise.ci"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rôle &amp; Permissions
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none bg-white"
                >
                  <option value="collaborator">Collaborateur (Création de factures/devis uniquement)</option>
                  <option value="manager">Gestionnaire (Clients, Devis, Factures, Stocks, Rapports)</option>
                  <option value="admin">Administrateur (Accès complet + Paramètres + Équipe)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-extrabold text-white shadow-md cursor-pointer"
                >
                  Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
