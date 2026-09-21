import { useNavigation } from '../context/NavigationContext';

export function FinalCTA() {
  const { navigate } = useNavigation();

  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-teal-600 to-teal-400 px-8 py-16 text-center shadow-xl sm:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />

          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Commencez dès aujourd'hui à simplifier votre facturation
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">
            Rejoignez les entrepreneurs qui économisent du temps, réduisent les erreurs et professionnalisent leur
            gestion — sans changer leurs habitudes.
          </p>

          <div className="relative mt-9 flex justify-center">
            <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#295294] shadow-lg ring-1 ring-inset ring-white/60 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Créer mon compte gratuitement
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              14 jours d'essai
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sans engagement
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sans carte bancaire
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
