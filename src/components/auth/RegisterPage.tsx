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
    <div className="min-h-screen bg-[#F7F9F7] flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#65736B] hover:text-[#176B4D] mb-5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil FAKTELIO
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <FaktelioLogo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17231D] tracking-tight">
          Créez votre compte FAKTELIO gratuitement
        </h1>
        <p className="mt-1 text-sm text-[#65736B]">
          Démarrez avec 14 jours d&apos;essai gratuit sans carte bancaire et une interface prête à l&apos;emploi.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white/95 backdrop-blur-xl py-8 px-6 shadow-[0_12px_40px_rgba(16,75,56,0.08)] rounded-2xl border border-[#DCE5DE] sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/20 text-xs font-semibold text-[#DC2626]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-1.5">
                  Votre nom complet *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#65736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Kouadio Konan"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#DCE5DE] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] text-[#17231D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-1.5">
                  Nom de l&apos;entreprise *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#65736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ivoire Services SARL"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#DCE5DE] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] text-[#17231D]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-1.5">
                  Email professionnel *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#65736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@entreprise.ci"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#DCE5DE] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] text-[#17231D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-1.5">
                  Téléphone WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#65736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#DCE5DE] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] text-[#17231D]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-1.5">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#65736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-[#DCE5DE] focus:outline-none focus:border-[#176B4D] focus:ring-1 focus:ring-[#176B4D] text-[#17231D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17231D] uppercase tracking-wider mb-2">
                Sélectionnez votre formule
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'startup' as PlanType, label: 'Standard', price: 'Gratuit' },
                  { id: 'pro' as PlanType, label: 'FAKTELIO Pro', price: '9 900 F' },
                  { id: 'entreprise' as PlanType, label: 'Business', price: '24 900 F' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlan(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      plan === item.id
                        ? 'border-[#176B4D] bg-[#E8F3ED] ring-2 ring-[#176B4D]/25'
                        : 'border-[#DCE5DE] hover:bg-[#F7F9F7]'
                    }`}
                  >
                    <div className="text-xs font-extrabold text-[#17231D]">{item.label}</div>
                    <div className="text-[11px] font-semibold text-[#176B4D] mt-0.5">{item.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl text-sm font-bold text-white bg-[#176B4D] hover:bg-[#104B38] shadow-[0_8px_24px_rgba(23,107,77,0.25)] hover:shadow-[0_12px_30px_rgba(23,107,77,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Créer mon compte FAKTELIO →
            </button>
          </form>

          <div className="mt-5 grid grid-cols-2 gap-2 text-[11px] text-[#65736B] bg-[#F7F9F7] p-3 rounded-xl border border-[#DCE5DE]">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#176B4D]" /> Aucune carte requise
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#176B4D]" /> Configuration en 30 sec
            </span>
          </div>

          <div className="mt-5 pt-5 border-t border-[#DCE5DE] text-center">
            <p className="text-xs text-[#65736B]">
              Vous avez déjà un compte FAKTELIO ?{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-[#176B4D] hover:underline cursor-pointer"
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
