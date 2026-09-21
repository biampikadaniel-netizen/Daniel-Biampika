import type { ComparisonRow } from '../types';

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'Créer un devis / une facture',
    traditional: 'Long, tout à la main',
    chapfacture: 'En moins de 30 secondes',
  },
  {
    feature: 'Passer du devis à la facture',
    traditional: "Copier-coller, risque d'erreur",
    chapfacture: 'En un seul clic',
  },
  {
    feature: 'Calculs & TVA',
    traditional: 'Erreurs de formules fréquentes',
    chapfacture: 'Calculés automatiquement',
  },
  {
    feature: 'Suivi des paiements',
    traditional: 'Manuel ou introuvable',
    chapfacture: 'En temps réel : payé / en attente',
  },
  {
    feature: 'Relances clients',
    traditional: 'Souvent oubliées',
    chapfacture: 'En un clic sur WhatsApp',
  },
  {
    feature: 'Image de marque',
    traditional: 'Document basique',
    chapfacture: 'Factures pro à votre logo',
  },
  {
    feature: 'Sécurité & sauvegarde',
    traditional: 'Fichier perdu = tout perdu',
    chapfacture: 'Sauvegardé dans le cloud',
  },
  {
    feature: 'Accès mobile',
    traditional: 'Compliqué',
    chapfacture: 'Depuis votre téléphone, partout',
  },
];

export function Comparison() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Comparatif
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Pourquoi abandonner Excel et Word ?
          </h2>
          <p className="mt-4 text-slate-600">Voyez la différence entre vos anciennes méthodes et Chapfacture.</p>
        </div>

        <div className="reveal mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 sm:px-6 sm:text-sm">
            <span>Fonctionnalité</span>
            <span className="text-slate-400">Excel / Word / Papier</span>
            <span className="text-teal-600">Avec Chapfacture</span>
          </div>

          {/* Table Body */}
          {COMPARISON_ROWS.map((row, index) => {
            const isLast = index === COMPARISON_ROWS.length - 1;
            return (
              <div
                key={row.feature}
                className={`grid grid-cols-[1.3fr_1fr_1fr] items-center gap-2 px-4 py-4 text-sm sm:px-6 ${
                  isLast ? '' : 'border-b border-slate-100'
                }`}
              >
                <span className="font-semibold text-slate-800">{row.feature}</span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <svg
                    className="h-4 w-4 shrink-0 text-red-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                  </svg>
                  <span>{row.traditional}</span>
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-teal-700">
                  <svg
                    className="h-4 w-4 shrink-0 text-teal-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{row.chapfacture}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
