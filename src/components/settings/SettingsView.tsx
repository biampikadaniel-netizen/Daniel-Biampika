import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { settingsStorage, authStorage } from '../../services/storage';
import type { CompanySettings } from '../../types';
import {
  Building2,
  User,
  Sliders,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export function SettingsView() {
  const { currentUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'invoicing' | 'notifications' | 'security'>(
    'company'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Settings
  const currentSettings = currentUser ? settingsStorage.getSettings(currentUser.id) : null;
  const [companyName, setCompanyName] = useState(currentSettings?.name || '');
  const [companyAddress, setCompanyAddress] = useState(currentSettings?.address || '');
  const [companyCity, setCompanyCity] = useState(currentSettings?.city || '');
  const [companyPhone, setCompanyPhone] = useState(currentSettings?.phone || '');
  const [companyEmail, setCompanyEmail] = useState(currentSettings?.email || '');
  const [companyWebsite, setCompanyWebsite] = useState(currentSettings?.website || '');
  const [taxNumber, setTaxNumber] = useState(currentSettings?.taxNumber || '');

  // Invoicing
  const [currency, setCurrency] = useState(currentSettings?.currency || 'FCFA');
  const [defaultVatRate, setDefaultVatRate] = useState<number>(currentSettings?.defaultVatRate ?? 18);
  const [invoicePrefix, setInvoicePrefix] = useState(currentSettings?.invoicePrefix || 'FAC-');
  const [quotePrefix, setQuotePrefix] = useState(currentSettings?.quotePrefix || 'DEV-');
  const [paymentTerms, setPaymentTerms] = useState(
    currentSettings?.paymentTerms || 'Paiement à réception de facture par Mobile Money ou Virement bancaire.'
  );

  // Security
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  if (!currentUser) return null;

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    settingsStorage.updateSettings(currentUser.id, {
      name: companyName,
      address: companyAddress,
      city: companyCity,
      phone: companyPhone,
      email: companyEmail,
      website: companyWebsite,
      taxNumber,
      currency,
      defaultVatRate,
      invoicePrefix,
      quotePrefix,
      paymentTerms,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    authStorage.updateUserProfile(currentUser.id, {
      name,
      phone,
      companyName,
    });
    refreshUser();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPwd.length < 6) {
      setPasswordError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPwd !== confirmPwd) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    const ok = authStorage.changePassword(currentUser.id, currentPwd, newPwd);
    if (!ok) {
      setPasswordError('Le mot de passe actuel est incorrect.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-1">
          Personnalisez les coordonnées de votre entreprise, vos mentions légales et vos préférences de facturation.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Vos modifications ont été enregistrées avec succès !</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'company' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-teal-600" />
          <span>Entreprise &amp; Mentions</span>
        </button>

        <button
          onClick={() => setActiveTab('invoicing')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'invoicing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#295294]" />
          <span>Facturation &amp; TVA</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4 text-purple-600" />
          <span>Mon profil</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notifications' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock className="w-4 h-4 text-slate-600" />
          <span>Sécurité</span>
        </button>
      </div>

      {/* Tab: Company */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Coordonnées de l'entreprise</h2>
            <p className="text-xs text-slate-500">
              Ces informations apparaîtront sur l'en-tête de vos devis et factures PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nom commercial / Raison sociale
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                NIF / Numéro RCCM
              </label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="Ex: CI-ABJ-2023-B-12345"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Adresse du siège
              </label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Cocody Angré 7e Tranche"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ville &amp; Pays
              </label>
              <input
                type="text"
                value={companyCity}
                onChange={(e) => setCompanyCity(e.target.value)}
                placeholder="Abidjan, Côte d'Ivoire"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Téléphone officiel
              </label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="+225 27 00 00 00 00"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email commercial
              </label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="contact@entreprise.ci"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les coordonnées</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Invoicing */}
      {activeTab === 'invoicing' && (
        <form onSubmit={handleSaveCompany} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Préférences de Facturation</h2>
            <p className="text-xs text-slate-500">
              Paramétrez les préfixes de numérotation, devise et taux de taxe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Devise par défaut
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                <option value="FCFA">FCFA (Franc CFA - XOF / XAF)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Taux de TVA par défaut (%)
              </label>
              <select
                value={defaultVatRate}
                onChange={(e) => setDefaultVatRate(parseInt(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white"
              >
                <option value={18}>18% (Taux normal UEMOA)</option>
                <option value={0}>0% (Régime simplifié / Exonéré)</option>
                <option value={9}>9% (Taux réduit)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Préfixe factures
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Préfixe devis
              </label>
              <input
                type="text"
                value={quotePrefix}
                onChange={(e) => setQuotePrefix(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Conditions de paiement par défaut
            </label>
            <textarea
              rows={3}
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les préférences</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Informations personnelles</h2>
            <p className="text-xs text-slate-500">Gérez vos identifiants d'accès utilisateur.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Numéro WhatsApp personnel
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email de connexion
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 mt-1">L'adresse email ne peut pas être modifiée.</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Mettre à jour le profil</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Préférences d'alerte</h2>
            <p className="text-xs text-slate-500">Choisissez comment vous souhaitez être notifié.</p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-teal-600 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Alertes de stock faible</span>
                <span className="text-[11px] text-slate-500">
                  Recevez un avertissement dès qu'un produit atteint son seuil d'alerte.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-teal-600 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Notifications de paiement</span>
                <span className="text-[11px] text-slate-500">
                  Notification instantanée lors de chaque enregistrement d'encaissement.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-teal-600 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Rappels de relances WhatsApp</span>
                <span className="text-[11px] text-slate-500">
                  Rappels automatiques lorsque des factures dépassent leur date d'échéance.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Modifier mon mot de passe</h2>
            <p className="text-xs text-slate-500">Sécurisez votre compte avec un mot de passe robuste.</p>
          </div>

          {passwordError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Votre mot de passe a été modifié avec succès !</span>
            </div>
          )}

          <div className="space-y-4 max-w-sm">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mot de passe actuel
              </label>
              <input
                type="password"
                required
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                required
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                required
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-md cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Changer le mot de passe</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
