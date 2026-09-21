import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { authStorage, seedDemoDataForUser } from '../../services/storage';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Mail, Lock, LogIn, KeyRound, Sparkles } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { navigate } = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Veuillez saisir votre email.');
      return;
    }
    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Identifiants invalides.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    const res = authStorage.resetPasswordByEmail(forgotEmail);
    setForgotMessage({
      text: res.message,
      isError: !res.success,
    });
  };

  const handleQuickDemo = () => {
    // Quick demo test account creation if none exists
    const demoEmail = 'demo@chapfacture.ci';
    const existing = authStorage.getUsers().find((u) => u.user.email === demoEmail);

    if (!existing) {
      const reg = authStorage.register({
        name: 'Koffi Kouamé (Démo)',
        companyName: 'Ivoire Négoce & Services',
        email: demoEmail,
        phone: '+225 07 12 34 56 78',
        password: 'password123',
      });
      if (reg.success && reg.user) {
        seedDemoDataForUser(reg.user.id);
      }
    }

    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Back to Home button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à l'accueil
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
          <img src="/icon.svg" alt="Chapfacture" className="h-9 w-9" />
          <span>
            <span className="text-[#295294]">Chap</span>
            <span className="text-[#f27a2c]">facture</span>
          </span>
        </div>

        <h2 className="mt-4 text-center text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
          Connexion à votre espace
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Accédez à votre tableau de bord, vos factures et devis en cours.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl sm:px-10 border border-slate-200/80">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold">Échec de connexion</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.ci"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setForgotEmail(email);
                    setForgotMessage(null);
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <span className="text-xs text-slate-600 font-medium">Se souvenir de moi</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-teal-500/20 text-sm font-bold text-white bg-gradient-to-tr from-teal-600 to-teal-400 hover:from-teal-700 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Se connecter</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Remplir avec un compte de test (Démo)
            </button>
          </div>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-600">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-bold text-[#295294] hover:underline"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Mot de passe oublié</h3>
                <p className="text-xs text-slate-500">Récupérez l'accès à votre compte Chapfacture</p>
              </div>
            </div>

            {forgotMessage ? (
              <div
                className={`mt-5 p-4 rounded-2xl text-sm ${
                  forgotMessage.isError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                <p>{forgotMessage.text}</p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotMessage(null);
                  }}
                  className="mt-3 block w-full py-2 text-center text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-5 space-y-4">
                <p className="text-sm text-slate-600">
                  Saisissez l'adresse email associée à votre compte. Nous réinitialiserons un code d'accès temporaire pour vous reconnecter immédiatement.
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Votre adresse email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="vous@entreprise.ci"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 text-sm font-bold text-white hover:bg-teal-700 shadow-md shadow-teal-500/20"
                  >
                    Réinitialiser
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
