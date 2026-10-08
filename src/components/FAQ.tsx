import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../types';

const faqs: FAQItem[] = [
  {
    question: 'Est-ce que je peux utiliser FAKTELIO gratuitement ?',
    answer:
      'Oui, vous pouvez créer votre compte FAKTELIO gratuitement à 0 FCFA sans carte bancaire et profiter de 14 jours d’essai complet sur les fonctionnalités Pro ainsi que d’une formule découverte gratuite.',
  },
  {
    question: 'Puis-je transformer un devis en facture automatiquement ?',
    answer:
      'Absolument. Dès qu’un devis passe au statut « Accepté », un bouton « Transformer en facture » apparaît. En un clic, FAKTELIO génère la facture correspondante avec toutes les lignes, prix, remises et TVA sans aucune ressaisie.',
  },
  {
    question: 'Comment fonctionnent les relances clients sur WhatsApp ?',
    answer:
      'FAKTELIO prépare automatiquement un message personnalisé contenant le nom du client, le numéro de la facture, le montant restant à payer, la date d’échéance et la référence du document. Il vous suffit de cliquer sur « Relancer sur WhatsApp » pour l’envoyer.',
  },
  {
    question: 'Est-ce que je peux personnaliser mes factures avec mon logo et mon cachet ?',
    answer:
      'Oui, depuis le menu Paramètres de votre espace FAKTELIO, vous pouvez ajouter le logo de votre entreprise, choisir votre couleur principale, configurer votre signature/cachet, vos mentions légales (NIF, RCCM) et vos conditions de règlement.',
  },
  {
    question: 'FAKTELIO fonctionne-t-il sur téléphone mobile et ordinateur ?',
    answer:
      'Oui, FAKTELIO est une application web 100% responsive accessible 24/7 depuis n’importe quel smartphone (Android, iPhone), tablette ou ordinateur portable.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#F7FAF8] border-b border-[#D9E7E3]">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#215C46]/10 text-[#215C46] border border-[#D9E7E3] text-xs font-extrabold uppercase tracking-wider mb-3">
            Questions fréquentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#101828] tracking-tight">
            Tout savoir sur FAKTELIO
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/95 rounded-2xl border border-[#D9E7E3] overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[#F7FAF8] transition-colors cursor-pointer"
                >
                  <span className="text-base font-extrabold text-[#10241D]">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#215C46] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#4A635A] leading-relaxed border-t border-[#D9E7E3]/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
