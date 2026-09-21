export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <img src="/icon.svg" alt="" className="h-7 w-7" />
          <span>
            <span className="text-[#295294]">Chap</span>
            <span className="text-[#f27a2c]">facture</span>
          </span>
        </div>
        <p className="text-sm text-slate-500">
          © 2026 Chapfacture. Tous droits réservés.
        </p>
        <a
          href="mailto:contact@chapfacture.com"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          contact@chapfacture.com
        </a>
      </div>
    </footer>
  );
}
