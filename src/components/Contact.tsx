import { useState, type FormEvent } from 'react';

export function Contact() {
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    if (channel === 'whatsapp') {
      const details: string[] = [`Nom : ${name.trim()}`];
      if (email.trim()) details.push(`Email : ${email.trim()}`);
      if (subject.trim()) details.push(`Sujet : ${subject.trim()}`);

      const body = `Bonjour, je vous contacte depuis Chapfacture.\n\n${details.join('\n')}\n\n${message.trim()}`;
      const url = `https://wa.me/2250700000000?text=${encodeURIComponent(body)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setSubmitted(true);
    } else {
      // Email submission
      const mailtoUrl = `mailto:contact@chapfacture.com?subject=${encodeURIComponent(
        subject.trim() || `Contact Chapfacture - ${name.trim()}`
      )}&body=${encodeURIComponent(
        `Nom: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`
      )}`;
      window.location.href = mailtoUrl;
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-14 sm:py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="reveal text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Contact
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Une question ? Écrivez-nous</h2>
          <p className="mt-4 text-slate-600">Notre équipe francophone vous répond rapidement.</p>
        </div>

        <div className="reveal mt-10">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <p className="text-lg font-bold text-emerald-800">Merci pour votre message !</p>
              <p className="mt-2 text-sm text-emerald-700">
                Notre équipe francophone vous répondra dans les plus brefs délais.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 text-xs font-semibold text-emerald-800 underline hover:text-emerald-900"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Comment souhaitez-vous nous joindre ?
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
                      channel === 'whatsapp'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Par WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${
                      channel === 'email'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Par email
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Nom
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Email <span className="font-normal text-slate-400">(optionnel)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Sujet <span className="font-normal text-slate-400">(optionnel)</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500"
                  placeholder="Objet de votre message"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500"
                  placeholder="Comment pouvons-nous vous aider ?"
                />
              </div>

              {channel === 'whatsapp' ? (
                <>
                  <button
                    type="submit"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/40 ring-1 ring-inset ring-white/30 transition-transform hover:-translate-y-0.5"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Envoyer sur WhatsApp
                  </button>
                  <p className="mt-3 text-center text-xs text-slate-400">
                    WhatsApp s'ouvrira avec votre message déjà rédigé.
                  </p>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-teal-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/40 ring-1 ring-inset ring-white/30 transition-transform hover:-translate-y-0.5"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Envoyer par email
                  </button>
                  <p className="mt-3 text-center text-xs text-slate-400">
                    Votre message sera transmis directement à notre équipe support.
                  </p>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
