import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { FaktelioLogo } from '../common/FaktelioLogo';
import { Footer } from '../Footer';

export function PrivacyPolicyPage() {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#10241D]">
      {/* Header */}
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
            <Lock className="w-3.5 h-3.5" />
            Protection &amp; Sécurité des Données
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10241D] tracking-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-[#4A635A] mt-2">
            Chez FAKTELIO, la sécurité et la confidentialité de vos données financières et commerciales sont notre priorité absolue.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9E7E3] shadow-sm space-y-8 text-sm leading-relaxed text-[#10241D]">
          {/* Section 1: Principes généraux */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#215C46]" />
              1. Engagement de Confidentialité FAKTELIO
            </h2>
            <p className="text-[#4A635A]">
              FAKTELIO s&apos;engage à protéger la vie privée des utilisateurs de sa plateforme SaaS. Nous appliquons les principes stricts de minimisation de la collecte de données, de transparence et d&apos;isolation rigoureuse entre chaque espace entreprise.
            </p>
            <p className="text-[#4A635A]">
              <strong>Règle fondamentale :</strong> Nous ne vendons, ne louons et ne cédons aucune donnée de vos devis, factures, clients ou transactions financières à des tiers à des fins publicitaires ou de courtage.
            </p>
          </section>

          {/* Section 2: Données collectées */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#215C46]" />
              2. Nature des Données Traitées
            </h2>
            <p className="text-[#4A635A]">
              Dans le cadre de l&apos;exécution du service, FAKTELIO est amené à traiter les catégories de données suivantes :
            </p>
            <ul className="list-disc pl-5 text-[#4A635A] space-y-2">
              <li>
                <strong>Données de compte utilisateur :</strong> nom, prénom, adresse email professionnelle, mot de passe chiffré, numéro de téléphone, formule d&apos;abonnement.
              </li>
              <li>
                <strong>Données de l&apos;entreprise émettrice :</strong> raison sociale, adresse, numéro fiscal, logo d&apos;entreprise, coordonnées bancaires pour factures.
              </li>
              <li>
                <strong>Données commerciales &amp; de facturation :</strong> fiches clients (noms, numéros de téléphone pour relances WhatsApp), lignes d&apos;articles, devis, factures, encaissements (Wave, Mobile Money, virements) et mouvements de stock.
              </li>
              <li>
                <strong>Données techniques de connexion :</strong> adresse IP, identifiants de session sécurisés, logs d&apos;accès horodatés pour prévenir la fraude.
              </li>
            </ul>
          </section>

          {/* Section 3: Finalités du traitement */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#215C46]" />
              3. Finalités du Traitement
            </h2>
            <p className="text-[#4A635A]">
              Vos données sont traitées exclusivement pour répondre aux finalités suivantes :
            </p>
            <ol className="list-decimal pl-5 text-[#4A635A] space-y-1.5">
              <li>Permettre la création, l&apos;édition et le téléchargement de devis et factures conformes en PDF.</li>
              <li>Calculer en temps réel votre chiffre d&apos;affaires, taux d&apos;encaissement et montants en attente.</li>
              <li>Faciliter l&apos;envoi de messages de relance personnalisés via WhatsApp à vos clients.</li>
              <li>Assurer la synchronisation Cloud multi-appareils (mobile, tablette, ordinateur).</li>
              <li>Assurer la maintenance, la sécurité et la prévention des fraudes.</li>
            </ol>
          </section>

          {/* Section 4: Sécurité et Chiffrement */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#215C46]" />
              4. Sécurité &amp; Stockage
            </h2>
            <p className="text-[#4A635A]">
              Nous mettons en œuvre des mesures techniques et organisationnelles de pointe :
            </p>
            <ul className="list-disc pl-5 text-[#4A635A] space-y-1">
              <li>Chiffrement SSL/TLS (HTTPS) pour l&apos;intégralité des flux de données.</li>
              <li>Isolation étanche des bases de données par identifiant d&apos;entreprise.</li>
              <li>Sauvegardes régulières automatisées.</li>
              <li>Mots de passe hachés avec des fonctions cryptographiques robustes.</li>
            </ul>
          </section>

          {/* Section 5: Vos droits */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#215C46] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#215C46]" />
              5. Vos Droits
            </h2>
            <p className="text-[#4A635A]">
              Conformément à la réglementation sur la protection des données personnelles, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 text-[#4A635A] space-y-1">
              <li><strong>Droit d&apos;accès :</strong> consulter l&apos;ensemble de vos données enregistrées sur FAKTELIO.</li>
              <li><strong>Droit de rectification :</strong> modifier vos coordonnées et paramètres à tout moment depuis votre espace.</li>
              <li><strong>Droit à l&apos;effacement :</strong> demander la suppression définitive de votre compte et de vos données associées.</li>
              <li><strong>Droit à la portabilité :</strong> exporter vos données clients, factures et catalogues aux formats standards (CSV / JSON / PDF).</li>
            </ul>
            <p className="text-[#4A635A] mt-2">
              Pour exercer l&apos;un de ces droits, écrivez simplement à <a href="mailto:privacy@faktelio.com" className="text-[#215C46] underline">privacy@faktelio.com</a> avec une preuve d&apos;identité professionnelle.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
