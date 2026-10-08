import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Trash2, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService } from '../../services/storage';
import { TeamMember } from '../../types';

export function TeamView() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('collaborator');

  const loadTeam = () => {
    if (!user) return;
    setMembers(workspaceService.getTeam(user.id));
  };

  useEffect(() => {
    loadTeam();
  }, [user]);

  if (!user) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    workspaceService.addTeamMember(user.id, {
      name: name.trim(),
      email: email.trim(),
      role,
    });
    setName('');
    setEmail('');
    loadTeam();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
        <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
          Équipe &amp; Collaborateurs FAKTELIO
        </h1>
        <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
          Invitez vos commerciaux, comptables ou gestionnaires sur votre espace FAKTELIO.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#D9E7E3] shadow-xs">
          <h2 className="text-base font-black text-[#101828] mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#215C46]" />
            Ajouter un collaborateur
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Nom complet *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Marc Koné"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:border-[#215C46] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Email professionnel *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collaborateur@entreprise.ci"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:border-[#215C46] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">Rôle d&apos;accès</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as TeamMember['role'])}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:border-[#215C46] focus:outline-none"
              >
                <option value="collaborator">Collaborateur (Devis, Factures, Clients)</option>
                <option value="manager">Manager (+ Catalogue, Stock, Paiements)</option>
                <option value="admin">Administrateur (Accès complet)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-extrabold cursor-pointer transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Ajouter à l&apos;équipe FAKTELIO
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#D9E7E3] shadow-xs">
          <h2 className="text-base font-black text-[#101828] mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#215C46]" />
            Membres actifs ({members.length})
          </h2>
          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-[#F7FAF8] border border-[#D9E7E3] flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-extrabold text-[#101828]">{m.name}</p>
                  <p className="text-xs text-[#526581] flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-[#215C46]" /> {m.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={m.role}
                    disabled={m.email === user.email}
                    onChange={(e) => {
                      workspaceService.updateTeamMemberRole(user.id, m.id, e.target.value as TeamMember['role']);
                      loadTeam();
                    }}
                    title={m.email === user.email ? 'Votre rôle administrateur principal' : 'Modifier les permissions'}
                    className="px-2.5 py-1 rounded-xl text-xs font-extrabold uppercase bg-[#215C46]/10 text-[#215C46] border border-[#215C46]/20 cursor-pointer disabled:cursor-default"
                  >
                    <option value="collaborator">Collaborateur</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  {m.email !== user.email && (
                    <button
                      onClick={() => {
                        workspaceService.removeTeamMember(user.id, m.id);
                        loadTeam();
                      }}
                      title="Supprimer ce membre"
                      className="p-1.5 rounded-lg text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
