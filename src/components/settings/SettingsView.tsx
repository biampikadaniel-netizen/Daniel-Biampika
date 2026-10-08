import React, { useState, useEffect } from 'react';
import { Save, Building2, Palette, Stamp, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workspaceService } from '../../services/storage';
import { CompanySettings } from '../../types';
import { FaktelioLogo } from '../common/FaktelioLogo';

export function SettingsView() {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings(workspaceService.getSettings(user.id));
    }
  }, [user]);

  if (!user || !settings) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    workspaceService.saveSettings(user.id, settings);
    updateUser({ companyName: settings.name });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Paramètres &amp; Documents Personnalisés FAKTELIO
          </h1>
          <p className="text-xs sm:text-sm text-[#526581] mt-0.5">
            Personnalisez le logo, les couleurs, les informations entreprise, la signature, le cachet et les conditions de paiement de vos factures PDF.
          </p>
        </div>
      </div>

      {savedBanner && (
        <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#16A34A]/30 text-[#15803D] text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Vos paramètres et la personnalisation de vos documents FAKTELIO ont été enregistrés.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Informations Entreprise */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#D9E7E3] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D9E7E3]">
              <Building2 className="w-5 h-5 text-[#215C46]" />
              <h2 className="text-base font-black text-[#101828]">
                Informations de l&apos;entreprise
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#F7FAF8] border border-[#D9E7E3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#D9E7E3] p-1 flex items-center justify-center overflow-hidden shrink-0">
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo entreprise" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-[10px] font-bold text-[#526581] text-center">Aucun logo</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#101828]">Logo officiel de l&apos;entreprise</label>
                    <p className="text-[11px] text-[#526581] mt-0.5">
                      S&apos;affichera sur vos factures PDF certifiées et vos devis.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                    <span>{settings.logoUrl ? 'Changer le logo' : 'Téléverser un logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setSettings({ ...settings, logoUrl: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {settings.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, logoUrl: '' })}
                      className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">
                  Raison sociale / Nom commercial *
                </label>
                <input
                  type="text"
                  required
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">
                  NIF / RCCM / Identifiant fiscal
                </label>
                <input
                  type="text"
                  value={settings.taxNumber || ''}
                  onChange={(e) => setSettings({ ...settings, taxNumber: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">Téléphone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">Adresse</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">Ville &amp; Pays</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Personnalisation Visuelle, Signature, Cachet & Conditions */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#D9E7E3] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#D9E7E3]">
              <Palette className="w-5 h-5 text-[#215C46]" />
              <h2 className="text-base font-black text-[#101828]">
                Personnalisation des documents (Logo, Couleurs, Signature &amp; Cachet)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  Couleur principale des factures &amp; devis
                </label>
                <div className="flex items-center gap-2.5">
                  {['#215C46', '#123A2C', '#0D2B21', '#1D4D3D', '#2E7D5C'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSettings({ ...settings, accentColor: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        (settings.accentColor || '#215C46') === color
                          ? 'scale-110 border-[#101828] ring-2 ring-[#215C46]'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">
                  Mention Signature &amp; Cachet officiel
                </label>
                <input
                  type="text"
                  value={settings.signatureText || ''}
                  onChange={(e) => setSettings({ ...settings, signatureText: e.target.value })}
                  placeholder="Ex: La Direction Générale — Certifié"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:border-[#215C46] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">
                  Préfixe Factures
                </label>
                <input
                  type="text"
                  value={settings.invoicePrefix}
                  onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm font-mono focus:border-[#215C46] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">Préfixe Devis</label>
                <input
                  type="text"
                  value={settings.quotePrefix}
                  onChange={(e) => setSettings({ ...settings, quotePrefix: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm font-mono focus:border-[#215C46] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1">
                  TVA par défaut (%)
                </label>
                <input
                  type="number"
                  value={settings.defaultVatRate}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultVatRate: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:border-[#215C46] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Conditions de paiement par défaut
              </label>
              <textarea
                rows={2}
                value={settings.paymentTerms}
                onChange={(e) => setSettings({ ...settings, paymentTerms: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:border-[#215C46] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] mb-1">
                Coordonnées bancaires / Mobile Money affichées en pied de facture
              </label>
              <input
                type="text"
                value={settings.bankDetails || ''}
                onChange={(e) => setSettings({ ...settings, bankDetails: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9E7E3] text-sm focus:border-[#215C46] focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#215C46] hover:bg-[#123A2C] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4 text-[#D9E7E3]" />
                Enregistrer la configuration FAKTELIO
              </button>
            </div>
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div className="lg:col-span-4 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#D9E7E3] shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#526581]">
            Aperçu en direct de vos documents
          </h3>

          <div className="p-4 rounded-xl border border-[#D9E7E3] bg-[#F7FAF8] space-y-3">
            <div
              className="pb-3 border-b-2 flex items-start justify-between"
              style={{ borderColor: settings.accentColor || '#215C46' }}
            >
              <div>
                <FaktelioLogo size="sm" />
                <p className="text-xs font-extrabold text-[#101828] mt-1">{settings.name}</p>
                <p className="text-[10px] text-[#526581]">{settings.city}</p>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white"
                style={{ backgroundColor: settings.accentColor || '#215C46' }}
              >
                {settings.invoicePrefix}001
              </span>
            </div>

            <div className="text-[11px] text-[#526581] space-y-1">
              <p>
                <strong>Conditions :</strong> {settings.paymentTerms}
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-dashed border-[#215C46]/40 bg-white flex items-center gap-2">
              <Stamp className="w-4 h-4 text-[#215C46]" />
              <div>
                <p className="text-[9px] font-bold uppercase text-[#215C46]">Signature &amp; Cachet</p>
                <p className="text-[11px] font-bold text-[#101828]">
                  {settings.signatureText || settings.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
