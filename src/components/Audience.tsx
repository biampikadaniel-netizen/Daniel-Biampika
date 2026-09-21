export function Audience() {
  return (
    <section id="pour-qui" className="border-t border-slate-200/70 bg-slate-50/50 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Pour qui ?
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Conçu pour votre activité</h2>
          <p className="mt-4 text-slate-600">
            Que vous vendiez des produits ou des services, seul ou avec une équipe.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Audience 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Commerçants &amp; Boutiques</h3>
            <p className="mt-2 text-sm text-slate-600">
              Vente au détail, prêt-à-porter, cosmétiques, alimentation. Facturez au comptoir ou à la livraison en
              quelques secondes.
            </p>
          </div>

          {/* Audience 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
                <path d="M17.64 15 22 10.64" />
                <path d="m20.91 3.26-1.25-1.25a2.12 2.12 0 0 0-3 0l-1.4 1.4 4.25 4.25 1.4-1.4a2.12 2.12 0 0 0 0-3Z" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Artisans &amp; BTP</h3>
            <p className="mt-2 text-sm text-slate-600">
              Menuisiers, électriciens, plombiers, peintres. Envoyez des devis clairs avant travaux et convertissez-les
              en factures en un clic.
            </p>
          </div>

          {/* Audience 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Prestataires &amp; Agences</h3>
            <p className="mt-2 text-sm text-slate-600">
              Consultants, designers, développeurs, formateurs. Facturez vos missions, suivez les règlements et
              renforcez votre image pro.
            </p>
          </div>

          {/* Audience 4 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                <path d="M10 6h4" />
                <path d="M10 10h4" />
                <path d="M10 14h4" />
                <path d="M10 18h4" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">TPE &amp; PME</h3>
            <p className="mt-2 text-sm text-slate-600">
              Équipes de 2 à 10 personnes. Travaillez à plusieurs, gérez le catalogue et les stocks, et gardez la
              maîtrise de votre trésorerie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
