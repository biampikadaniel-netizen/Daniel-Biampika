export function Stats() {
  return (
    <section className="border-y border-slate-200/70 bg-slate-50/50 py-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">&lt; 30s</p>
            <p className="mt-1 text-sm font-medium text-slate-600">pour créer une facture</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">1 clic</p>
            <p className="mt-1 text-sm font-medium text-slate-600">pour envoyer sur WhatsApp</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">100%</p>
            <p className="mt-1 text-sm font-medium text-slate-600">dans le cloud, jamais perdu</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">0 FCFA</p>
            <p className="mt-1 text-sm font-medium text-slate-600">pour démarrer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
