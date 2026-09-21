import type { FAQItem } from '../types';

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Ai-je besoin d'une carte bancaire pour commencer ?",
    answer:
      "Non. Vous créez votre compte gratuitement, sans carte bancaire. Vous profitez en plus de 14 jours d'essai des fonctionnalités Entreprise.",
  },
  {
    question: "Combien de temps dure l'essai gratuit ?",
    answer:
      "À l'inscription, vous bénéficiez de 14 jours d'essai des fonctionnalités Entreprise. À la fin, vous basculez automatiquement sur l'offre gratuite si vous ne souscrivez pas — sans blocage ni mauvaise surprise.",
  },
  {
    question: 'Puis-je utiliser Chapfacture sur mon téléphone ?',
    answer:
      "Oui. Chapfacture fonctionne dans le navigateur de votre téléphone, tablette ou ordinateur, et peut s'installer comme une application sur votre écran d'accueil.",
  },
  {
    question: 'Mes données sont-elles en sécurité ?',
    answer:
      'Vos données et celles de vos clients sont chiffrées et hébergées sur des serveurs cloud sécurisés. Chaque entreprise ne voit que ses propres données, jamais celles des autres.',
  },
  {
    question: 'Mes données sont-elles sauvegardées ?',
    answer:
      'Oui, tout est sauvegardé automatiquement dans le cloud. Un téléphone perdu ou cassé ne vous fait rien perdre : reconnectez-vous et vous retrouvez tout.',
  },
  {
    question: 'Puis-je personnaliser mes factures ?',
    answer:
      'Oui : ajoutez votre logo et choisissez votre modèle pour des devis et factures à votre image, qui renforcent votre professionnalisme.',
  },
  {
    question: 'Comment mes clients paient-ils ?',
    answer:
      'Vous envoyez vos factures par WhatsApp et suivez les paiements en temps réel. Le paiement Mobile Money est intégré pour vos abonnements Chapfacture.',
  },
  {
    question: 'Puis-je importer mes clients existants ?',
    answer:
      'Oui. Vous saisissez ou ajoutez vos clients une fois ; ils sont ensuite réutilisables sur tous vos documents, sans ressaisie.',
  },
  {
    question: 'Puis-je travailler à plusieurs ?',
    answer:
      "Oui. Avec l'offre Entreprise, le chef d'entreprise ajoute des membres de son équipe et garde une trace de qui a fait quoi.",
  },
  {
    question: 'Puis-je résilier à tout moment ?',
    answer:
      "Oui, sans engagement. Vous changez d'offre ou arrêtez quand vous voulez, et vous conservez l'accès à l'offre gratuite.",
  },
  {
    question: 'Puis-je envoyer mes factures par WhatsApp ?',
    answer:
      "Oui, c'est au cœur de Chapfacture : envoyez devis et factures à vos clients par WhatsApp en un clic, avec un lien propre vers le PDF.",
  },
  {
    question: 'Ai-je besoin de compétences techniques ? Et pour le support ?',
    answer:
      'Non. Si vous savez envoyer un message WhatsApp, vous savez utiliser Chapfacture. Et notre équipe francophone vous accompagne : écrivez-nous depuis la page Contact.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-slate-200/70 bg-slate-50/50 py-14 sm:py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center reveal">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Questions fréquentes</h2>
        </div>

        <div className="mt-12 space-y-4 reveal">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-800">
                {item.question}
                <svg
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
