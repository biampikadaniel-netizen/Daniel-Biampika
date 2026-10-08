import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { FaktelioLogo } from '../common/FaktelioLogo';

export function LoginPage() {
  const { login, loginDemo } = useAuth();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('demo@faktelio.com');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }
    const res = login(email, password);
    if (res.error) {
      setError(res.error);
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuickDemo = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#526581] hover:text-[#1E4F91] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil FAKTELIO
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <FaktelioLogo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
          Connexion à votre espace FAKTELIO
        </h1>
        <p className="mt-1.5 text-sm text-[#526581]">
          Gérez vos devis, factures, clients, stocks et paiements en temps réel.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-[0_12px_40px_-8px_rgba(16,24,40,0.08)] rounded-2xl border border-[#E2E8F0] sm:px-10">
          {/* Instant Demo Access Banner */}
          <div className="mb-6 p-4 rounded-xl bg-[#1E4F91]/6 border border-[#1E4F91]/15 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1E4F91] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F47B20]" />
                Accès Démo Immédiat
              </span>
              <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Données pré-remplies
              </span>
            </div>
            <p className="text-xs text-[#526581] leading-relaxed">
              Testez toutes les fonctionnalités FAKTELIO (Facturation, Devis → Facture, Stock, Relances WhatsApp, PDF) en 1 clic.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1E4F91] hover:bg-[#163C70] transition-colors shadow-xs cursor-pointer"
            >
              Ouvrir le compte Démo FAKTELIO en 1 clic →
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/20 text-xs font-semibold text-[#DC2626]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#526581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E4F91] text-[#101828]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101828] uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#526581] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#1E4F91] text-[#101828]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl text-sm font-bold text-white bg-[#F47B20] hover:bg-[#FF7A21] shadow-[0_6px_18px_rgba(244,123,32,0.28)] transition-all cursor-pointer"
            >
              Se connecter à FAKTELIO
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] text-center">
            <p className="text-xs text-[#526581]">
              Pas encore de compte FAKTELIO ?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-bold text-[#1E4F91] hover:underline cursor-pointer"
              >
                Créer mon compte gratuitement (14 jours d&apos;essai)
              </button>
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#526581]">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Sans carte bancaire
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Support 7j/7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
