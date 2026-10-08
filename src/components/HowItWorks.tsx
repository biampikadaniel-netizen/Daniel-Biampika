import React from 'react';
import { UserCheck, FileSpreadsheet, Send, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

const steps = [
  {
    step: 'Étape 1',
    icon: UserCheck,
    title: 'Sélectionnez ou créez votre client',
    description:
      'Choisissez un client existant dans votre CRM FAKTELIO ou ajoutez ses coordonnées en quelques secondes.',
  },
  {
    step: 'Étape 2',
    icon: FileSpreadsheet,
    title: 'Ajoutez vos produits ou prestations',
    description:
      'Sélectionnez vos articles du catalogue. Les prix, quantités, remises et la TVA se calculent automatiquement.',
  },
  {
    step: 'Étape 3',
    icon: Send,
    title: 'Téléchargez le PDF ou partagez sur WhatsApp',
    description:
      'Votre facture professionnelle est prête. Téléchargez le PDF, envoyez-la sur WhatsApp et suivez son paiement.',
  },
];

export function HowItWorks() {
  const { user, loginDemo } = useAuth();
  const { navigate } = useNavigation();

  const handleStart = () => {
    if (user) {
      navigate('/billing');
    } else {
      loginDemo();
      navigate('/billing');
    }
  };

  return (
    <section className="py-20 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F47B20]/10 text-[#F47B20] text-xs font-extrabold uppercase tracking-wider mb-3">
            Prise en main immédiate
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Comment fonctionne FAKTELIO en 3 étapes simples
          </h2>
          <p className="text-base text-[#526581] mt-3">
            Aucune compétence comptable requise. Tout est pensé pour aller droit au but.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#F5F7FA] rounded-2xl p-7 border border-[#E2E8F0] hover:border-[#1E4F91]/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-[#1E4F91] text-white text-xs font-extrabold">
                    {s.step}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] text-[#F47B20] flex items-center justify-center shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-extrabold text-[#101828] mb-2">{s.title}</h3>
                <p className="text-sm text-[#526581] leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1E4F91] hover:bg-[#163C70] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            Créer ma première facture maintenant
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
