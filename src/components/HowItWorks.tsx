export function HowItWorks() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Simple &amp; Rapide
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Comment ça fonctionne ?</h2>
          <p className="mt-4 text-slate-600">3 étapes simples pour facturer comme un pro, dès aujourd'hui.</p>
        </div>

        <div className="reveal mt-12 grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
              1
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Créez votre document</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Sélectionnez un client, ajoutez vos prestations ou produits. Les totaux et la TVA se calculent tout seuls.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
              2
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Partagez en 1 clic</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Envoyez un lien propre et professionnel à votre client par WhatsApp, par email ou téléchargez le PDF.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
              3
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Suivez &amp; encaissez</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Voyez qui a payé, qui est en retard, et relancez en un clic sans friction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
