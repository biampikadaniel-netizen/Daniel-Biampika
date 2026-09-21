export function Benefits() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Pourquoi Chapfacture
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            La facturation pensée pour votre quotidien
          </h2>
          <p className="mt-4 text-slate-600">
            Pas besoin d'être comptable ni expert en informatique. Tout est conçu pour être rapide, clair et sans prise
            de tête.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Ultra rapide</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Créez un devis ou une facture en 3 clics, convertissez le devis en facture sans rien retaper, téléchargez
              le PDF instantanément.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Zéro erreur, zéro perte</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Les calculs, la TVA et les totaux se font automatiquement. Vos données sont sauvegardées dans le cloud :
              plus jamais de facture égarée.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Intégré à WhatsApp</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Envoyez vos factures à vos clients directement sur WhatsApp en un clic. Relancez les impayés sans gêne et
              faites-vous payer plus vite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
