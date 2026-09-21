export function Features() {
  return (
    <section id="fonctionnalites" className="border-t border-slate-200/70 bg-slate-50/50 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Fonctionnalités
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Tout ce dont vous avez besoin, rien de superflu
          </h2>
          <p className="mt-4 text-slate-600">
            Des outils simples et efficaces pour gérer votre activité sans perdre de temps.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
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
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Factures &amp; Devis</h3>
            <p className="mt-2 text-sm text-slate-600">
              Créez des documents professionnels à vos couleurs en quelques clics. Transformez un devis accepté en
              facture instantanément.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Envoi &amp; Relances WhatsApp</h3>
            <p className="mt-2 text-sm text-slate-600">
              Partagez vos factures directement par message WhatsApp. Relancez les factures en retard en un clic avec un
              message personnalisé.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Suivi des Paiements</h3>
            <p className="mt-2 text-sm text-slate-600">
              Visualisez en un coup d'œil vos factures payées, en attente et en retard. Enregistrez les acomptes et
              règlements reçus.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Gestion des Clients</h3>
            <p className="mt-2 text-sm text-slate-600">
              Gardez les coordonnées de tous vos clients au même endroit. Retrouvez l'historique complet de leurs
              commandes et paiements.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
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
                <path d="m7.5 4.27 9 5.15" />
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Catalogue &amp; Stocks</h3>
            <p className="mt-2 text-sm text-slate-600">
              Enregistrez vos produits et services avec leurs prix pour remplir vos factures encore plus vite. Suivez
              l'état de votre stock.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
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
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <h3 className="mt-4 font-bold text-slate-900">Signature &amp; Cachet Pro</h3>
            <p className="mt-2 text-sm text-slate-600">
              Ajoutez votre logo, votre signature et le cachet de votre entreprise directement sur les documents pour un
              rendu 100% professionnel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
