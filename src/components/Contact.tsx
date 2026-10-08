import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Demande de démonstration FAKTELIO',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-[#D9E7E3]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#215C46]/10 text-[#215C46] border border-[#D9E7E3] text-xs font-extrabold uppercase tracking-wider mb-3">
              Contact &amp; Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10241D] tracking-tight mb-4">
              Une question ? Notre équipe FAKTELIO vous accompagne
            </h2>
            <p className="text-base text-[#4A635A] leading-relaxed mb-8">
              Besoin d&apos;aide pour configurer votre compte, importer vos clients ou choisir la formule adaptée à votre PME ? Contactez-nous directement.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <div className="w-11 h-11 rounded-xl bg-[#215C46] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-5 h-5 text-[#D9E7E3]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[#4A635A]">Assistance Téléphone &amp; WhatsApp</p>
                  <p className="text-sm font-extrabold text-[#10241D]">+225 07 08 45 12 90</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <div className="w-11 h-11 rounded-xl bg-[#123A2C] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="w-5 h-5 text-[#A9BDBC]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[#4A635A]">Email Support &amp; Commercial</p>
                  <p className="text-sm font-extrabold text-[#10241D]">contact@faktelio.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3]">
                <div className="w-11 h-11 rounded-xl bg-[#3F7A65] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[#4A635A]">Siège &amp; Bureaux</p>
                  <p className="text-sm font-extrabold text-[#10241D]">Cocody Riviera 3, Abidjan • Dakar • Ouagadougou</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="lg:col-span-7 bg-[#F7FAF8] rounded-2xl p-6 sm:p-8 border border-[#D9E7E3] shadow-xs">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#D9E7E3] text-[#123A2C] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#215C46]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#10241D] mb-2">
                  Merci, votre message a bien été envoyé à FAKTELIO !
                </h3>
                <p className="text-sm text-[#4A635A] max-w-md mx-auto mb-6">
                  Un conseiller FAKTELIO vous répondra sous 2 heures ouvrées par téléphone, email ou WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#215C46] text-white text-xs font-bold cursor-pointer"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-extrabold text-[#10241D] mb-2">
                  Envoyez-nous un message
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#10241D] mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex: Kouadio Konan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9E7E3] text-sm text-[#10241D] focus:outline-none focus:border-[#215C46]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#10241D] mb-1.5">
                      Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+225 07 00 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9E7E3] text-sm text-[#10241D] focus:outline-none focus:border-[#215C46]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#10241D] mb-1.5">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="vous@entreprise.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9E7E3] text-sm text-[#10241D] focus:outline-none focus:border-[#215C46]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#10241D] mb-1.5">
                      Sujet
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9E7E3] text-sm text-[#10241D] focus:outline-none focus:border-[#215C46]"
                    >
                      <option>Demande de démonstration FAKTELIO</option>
                      <option>Offre FAKTELIO Pro / Business</option>
                      <option>Support technique &amp; Import de données</option>
                      <option>Partenariat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10241D] mb-1.5">
                    Votre message
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Décrivez brièvement vos besoins en facturation ou gestion commerciale..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9E7E3] text-sm text-[#10241D] focus:outline-none focus:border-[#215C46]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#215C46] to-[#3F7A65] hover:from-[#1A4937] hover:to-[#356B58] text-white text-sm font-bold shadow-[0_8px_24px_rgba(33,92,70,0.25)] hover:shadow-[0_12px_30px_rgba(33,92,70,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#D9E7E3]" />
                    Envoyer ma demande
                  </button>

                  <a
                    href="https://wa.me/2250708451290?text=Bonjour%20FAKTELIO%2C%20je%20souhaite%20des%20informations%20sur%20la%20plateforme."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 text-[#123A2C] hover:bg-[#25D366]/20 text-xs font-bold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#215C46]" />
                    Discuter sur WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
