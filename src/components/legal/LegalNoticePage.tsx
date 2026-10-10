import React from 'react';
import { ArrowLeft, Shield, Building, Globe, Mail, Phone, Server } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { FaktelioLogo } from '../common/FaktelioLogo';
import { Footer } from '../Footer';

export function LegalNoticePage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#10241D]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D9E7E3] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4A635A] hover:text-[#215C46] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </button>
          <FaktelioLogo size="sm" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#215C46]/10 text-[#215C46] text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            Cadre Réglementaire &amp; Légal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10241D] tracking-tight">
            Mentions Légales
          </h1>
          <p className="text-sm text-[#4A635A] mt-2">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9E7E3] shadow-sm space-y-8 text-sm leading-relaxed text-[#10241D]">
          {/* Section 1: Éditeur du site */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#215C46]" />
              1. Éditeur de la Plateforme FAKTELIO
            </h2>
            <p className="text-[#4A635A]">
              Le site internet et l&apos;application SaaS <strong>FAKTELIO</strong> (accessible à l&apos;adresse https://faktelio.vercel.app/) sont édités par :
            </p>

            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3] space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Raison sociale :</strong> [À compléter par l’éditeur : ex. FAKTELIO SAS / SARL]
              </p>
              <p>
                <strong>Forme juridique :</strong> [À compléter : Société par Actions Simplifiée / SARL]
              </p>
              <p>
                <strong>Capital social :</strong> [À compléter : ex. 1 000 000 FCFA / 10 000 €]
              </p>
              <p>
                <strong>Numéro d&apos;immatriculation / RCCM :</strong> [À compléter : N° RCCM / SIREN]
              </p>
              <p>
                <strong>Numéro d&apos;identification fiscale :</strong> [À compléter : N° CC / TVA intracommunautaire]
              </p>
              <p>
                <strong>Siège social :</strong> [À compléter : Adresse géographique du siège social, Ville, Pays]
              </p>
              <p>
                <strong>Directeur de la publication :</strong> [À compléter : Nom et prénom du représentant légal]
              </p>
              <p>
                <strong>Contact électronique :</strong> <a href="mailto:contact@faktelio.com" className="text-[#215C46] underline">contact@faktelio.com</a>
              </p>
            </div>
          </section>

          {/* Section 2: Hébergement */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Server className="w-5 h-5 text-[#215C46]" />
              2. Hébergement de l&apos;Application
            </h2>
            <p className="text-[#4A635A]">
              La plateforme SaaS FAKTELIO est hébergée par une infrastructure Cloud sécurisée de premier plan :
            </p>
            <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#D9E7E3] space-y-1.5 text-xs sm:text-sm">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse de l&apos;hébergeur :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p><strong>Site web de l&apos;hébergeur :</strong> <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-[#215C46] underline">https://vercel.com</a></p>
              <p><strong>Datacenters :</strong> Infrastructures sécurisées avec chiffrement des données au repos et en transit (TLS 1.3 / AES-256).</p>
            </div>
          </section>

          {/* Section 3: Propriété intellectuelle */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#215C46]" />
              3. Propriété Intellectuelle
            </h2>
            <p className="text-[#4A635A]">
              La marque <strong>FAKTELIO</strong>, le logo officiel, la charte graphique, les algorithmes de calcul de taxes et de facturation, les interfaces graphiques, ainsi que l&apos;ensemble des contenus (textes, vidéos, icônes) sont la propriété exclusive de l&apos;éditeur ou font l&apos;objet d&apos;une licence d&apos;exploitation.
            </p>
            <p className="text-[#4A635A]">
              Toute reproduction, distribution, modification ou utilisation non autorisée de ces éléments, totale ou partielle, est formellement interdite sans l&apos;accord exprès préalable et écrit de l&apos;éditeur.
            </p>
          </section>

          {/* Section 4: Données des clients */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#215C46]" />
              4. Données Personnelles et Professionnelles
            </h2>
            <p className="text-[#4A635A]">
              Les données commerciales renseignées par les utilisateurs (factures, devis, fiches clients, catalogues, coordonnées) restent la propriété exclusive de chaque entreprise utilisatrice. FAKTELIO garantit une stricte isolation multi-entreprises et ne commercialise aucune donnée utilisateur.
            </p>
            <p className="text-[#4A635A]">
              Pour toute question relative à la protection de vos données ou pour exercer vos droits d&apos;accès, de rectification et d&apos;effacement, veuillez consulter notre{' '}
              <button
                onClick={() => navigate('/politique-confidentialite')}
                className="text-[#215C46] font-bold underline cursor-pointer"
              >
                Politique de Confidentialité
              </button>.
            </p>
          </section>

          {/* Section 5: Contact */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#215C46]" />
              5. Service Client &amp; Assistance
            </h2>
            <p className="text-[#4A635A]">
              Pour toute assistance technique, réclamation ou renseignement commercial, l&apos;équipe FAKTELIO est joignable :
            </p>
            <ul className="list-disc pl-5 text-[#4A635A] space-y-1">
              <li>Par email : <a href="mailto:support@faktelio.com" className="text-[#215C46] underline">support@faktelio.com</a></li>
              <li>Par WhatsApp Support : [À compléter : Numéro WhatsApp officiel]</li>
              <li>Du lundi au vendredi de 8h00 à 18h00 GMT.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
