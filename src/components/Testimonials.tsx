import type { Testimonial } from '../types';

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '« Avant, je passais mes dimanches soirs à faire des factures sur Word. Aujourd’hui, je les fais directement depuis mon téléphone au magasin. Mes clients sont impressionnés par le rendu professionnel. »',
    initials: 'AK',
    name: 'Amadou K.',
    role: 'Boutique de prêt-à-porter',
    city: 'Abidjan',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    quote:
      '« Le fait de pouvoir envoyer la facture par WhatsApp en un clic a tout changé pour moi. Les clients paient beaucoup plus vite, et le suivi des impayés est clair. Je ne perds plus d’argent. »',
    initials: 'MD',
    name: 'Mariam D.',
    role: 'Prestations de services & Conseil',
    city: 'Dakar',
    gradient: 'from-teal-500 to-teal-400',
  },
  {
    quote:
      '« Je ne suis pas très à l’aise avec l’informatique, mais Chapfacture est tellement simple que j’ai compris en 5 minutes. Mon comptable est ravi d’avoir des documents propres et numérotés. »',
    initials: 'SA',
    name: 'Seydou A.',
    role: 'Menuiserie & Aménagement',
    city: 'Cotonou',
    gradient: 'from-emerald-600 to-emerald-400',
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-slate-200/70 bg-slate-50/50 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Témoignages
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Ils ont simplifié leur gestion</h2>
          <p className="mt-4 text-slate-600">
            Découvrez comment des entrepreneurs transforment leur quotidien avec Chapfacture.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex gap-0.5 text-teal-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{testimonial.quote}</p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${testimonial.gradient} text-xs font-bold text-white`}
                >
                  {testimonial.initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">
                    {testimonial.role} • {testimonial.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
