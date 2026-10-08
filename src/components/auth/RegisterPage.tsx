import React, { useState } from 'react';
import { ArrowLeft, Building2, Mail, Phone, User, Lock, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { PlanType } from '../../types';
import { FaktelioLogo } from '../common/FaktelioLogo';

export function RegisterPage() {
  const { register } = useAuth();
  const { navigate, params } = useNavigation();

  const initialPlan = (params.selectedPlan as PlanType) || 'startup';

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('+225 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState<PlanType>(initialPlan);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Veuillez remplir votre nom et votre adresse email.');
      return;
    }

    const res = register({
      name,
      email,
      password: password || '123456',
      companyName: companyName || `Entreprise ${name}`,
      phone,
      plan,
    });

    if (res.error) {
      setError(res.error);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-lg px-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A635A] hover:text-[#215C46] mb-5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil FAKTELIO
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <FaktelioLogo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10241D] tracking-tight">
          Créez votre compte FAKTELIO gratuitement
        </h1>
        <p className="mt-1 text-sm text-[#4A635A]">
          Démarrez avec 14 jours d&apos;essai gratuit sans carte bancaire et une interface prête à l&apos;emploi.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-[0_12px_40px_rgba(13,43,33,0.08)] rounded-2xl border border-[#D9E7E3] sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/20 text-xs font-semibold text-[#DC2626]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#10241D] uppercase tracking-wider mb-1.5">
                  Votre nom complet *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#4A635A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kouadio Konan"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#10241D] uppercase tracking-wider mb-1.5">
                  Nom de l&apos;entreprise *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#4A635A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ivoire Services SARL"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#10241D] uppercase tracking-wider mb-1.5">
                  Email professionnel *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#4A635A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@entreprise.ci"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#10241D] uppercase tracking-wider mb-1.5">
                  Téléphone WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#4A635A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10241D] uppercase tracking-wider mb-1.5">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#4A635A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#D9E7E3] focus:outline-none focus:border-[#215C46]"
                />
              </div>
            </div>

            {/* Plan Selection */}
            <div>
              <label className="block text-xs font-bold text-[#10241D] uppercase tracking-wider mb-2">
                Formule souhaitée (14 jours d&apos;essai gratuit inclus)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'basique', label: 'Gratuit', price: '0 FCFA' },
                    { id: 'startup', label: 'FAKTELIO Pro', price: '9 900 FCFA/m' },
                    { id: 'entreprise', label: 'Business', price: '24 900 FCFA/m' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlan(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      plan === item.id
                        ? 'border-[#215C46] bg-[#215C46]/8 ring-2 ring-[#215C46]/20'
                        : 'border-[#D9E7E3] hover:bg-[#F7FAF8]'
                    }`}
                  >
                    <div className="text-xs font-extrabold text-[#10241D]">{item.label}</div>
                    <div className="text-[11px] font-semibold text-[#215C46] mt-0.5">{item.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] shadow-[0_8px_24px_rgba(33,92,70,0.28)] hover:shadow-[0_12px_30px_rgba(33,92,70,0.38)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Créer mon compte FAKTELIO →
            </button>
          </form>

          <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-[#4A635A] bg-[#F7FAF8] p-3 rounded-xl border border-[#D9E7E3]/60">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#215C46]" /> Aucune carte requise
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#215C46]" /> Configuration en 30 sec
            </span>
          </div>

          <div className="mt-5 pt-5 border-t border-[#D9E7E3] text-center">
            <p className="text-xs text-[#4A635A]">
              Vous avez déjà un compte FAKTELIO ?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-[#215C46] hover:underline cursor-pointer"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
