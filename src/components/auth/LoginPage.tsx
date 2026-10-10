import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A635A] hover:text-[#215C46] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil FAKTELIO
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <FaktelioLogo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10241D] tracking-tight">
          Connexion à votre espace FAKTELIO
        </h1>
        <p className="mt-1.5 text-sm text-[#4A635A]">
          Gérez vos devis, factures, clients, stocks et paiements en temps réel.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-[0_12px_40px_rgba(13,43,33,0.08)] rounded-2xl border border-[#D9E7E3] sm:px-10">
          {/* Instant Demo Access Banner */}
          <div className="mb-6 p-4 rounded-xl bg-[#215C46]/6 border border-[#215C46]/18 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#215C46] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#215C46]" />
                Accès Démo Immédiat
              </span>
              <span className="text-[11px] font-semibold text-[#123A2C] bg-[#D9E7E3] px-2 py-0.5 rounded-full">
                Données pré-remplies
              </span>
            </div>
            <p className="text-xs text-[#4A635A] leading-relaxed">
              Testez toutes les fonctionnalités FAKTELIO (Facturation, Devis → Facture, Stock, Relances WhatsApp, PDF) en 1 clic.
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#215C46] hover:bg-[#1A4937] transition-colors shadow-xs cursor-pointer"
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
              <label className="block text-xs font-bold text-[#10241D] uppercase tracking-wider mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#4A635A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@entreprise.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#DCE5DE] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] text-[#17231D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#65736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#DCE5DE] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] text-[#17231D]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl text-sm font-bold text-white bg-[#176B4D] hover:bg-[#104B38] shadow-[0_8px_24px_rgba(23,107,77,0.25)] hover:shadow-[0_12px_30px_rgba(23,107,77,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Se connecter à FAKTELIO
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#DCE5DE] text-center">
            <p className="text-xs text-[#65736B]">
              Pas encore de compte FAKTELIO ?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-bold text-[#176B4D] hover:underline cursor-pointer"
              >
                Créer mon compte gratuitement (14 jours d&apos;essai)
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
