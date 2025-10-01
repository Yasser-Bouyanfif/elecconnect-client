import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité et Cookies - ElecConnect',
  description: 'Politique de confidentialité et gestion des cookies de ElecConnect',
};

export default function Confidentialite() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-emerald-700 mb-8">Politique de Confidentialité et Cookies</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">1. Protection des données personnelles</h2>
        
        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">1.1 Responsable du traitement</h3>
          <p className="mb-4">
            ElecConnect, dont le siège social est situé 31 rue Chevalier Paul, 83000 Toulon, France, est responsable du traitement des données à caractère personnel collectées sur le site internet www.elecconnect.fr.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">1.2 Finalités du traitement</h3>
          <p className="mb-2">Les données collectées sont utilisées aux fins suivantes :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Gestion des commandes et de la relation client</li>
            <li>Envoi d’informations commerciales (avec votre consentement)</li>
            <li>Amélioration de nos services et personnalisation de l’expérience utilisateur</li>
            <li>Respect de nos obligations légales et réglementaires</li>
          </ul>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">1.3 Base légale du traitement</h3>
          <p className="mb-4">
            Le traitement de vos données est fondé sur :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>L’exécution d’un contrat pour la gestion de votre commande</li>
            <li>Votre consentement pour les opérations de marketing</li>
            <li>Notre intérêt légitime pour améliorer nos services</li>
            <li>Le respect de nos obligations légales</li>
          </ul>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">1.4 Durée de conservation</h3>
          <p className="mb-2">Vos données sont conservées pour une durée qui n’excède pas la durée nécessaire aux finalités pour lesquelles elles sont collectées :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Données de facturation : 10 ans (obligation légale)</li>
            <li>Données clients : 3 ans à compter de la fin de la relation commerciale</li>
            <li>Données de prospection : 3 ans à compter de leur collecte ou du dernier contact</li>
          </ul>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">1.5 Destinataires des données</h3>
          <p className="mb-4">
            Les données collectées sont destinées à notre société et à nos sous-traitants pour les besoins des finalités décrites ci-dessus. Nous ne vendons pas vos données personnelles à des tiers.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">1.6 Vos droits</h3>
          <p className="mb-2">Conformément à la réglementation sur la protection des données, vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Droit d’accès et de rectification de vos données</li>
            <li>Droit à l’effacement (droit à l’oubli)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité de vos données</li>
            <li>Droit d’opposition</li>
            <li>Définir des directives relatives au sort de vos données après votre décès</li>
          </ul>
          <p className="mb-4">
            Pour exercer ces droits, vous pouvez nous contacter à l’adresse suivante : contact@elecconnect.fr ou par courrier à l’adresse du siège social.
          </p>
          <p className="mb-4">
            Vous avez également le droit d’introduire une réclamation auprès de la CNIL (www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.
          </p>
        </article>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">2. Politique relative aux cookies</h2>
        
        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Qu’est-ce qu’un cookie ?</h3>
          <p className="mb-4">
            Un cookie est un petit fichier texte déposé sur votre ordinateur lors de la visite d’un site. Il permet de conserver des informations relatives à votre navigation sur le site.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 Les cookies que nous utilisons</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border-b text-left">Nom du cookie</th>
                  <th className="px-4 py-2 border-b text-left">Finalité</th>
                  <th className="px-4 py-2 border-b text-left">Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b">session_id</td>
                  <td className="px-4 py-2 border-b">Maintien de la session utilisateur</td>
                  <td className="px-4 py-2 border-b">Durée de la session</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">cookie_consent</td>
                  <td className="px-4 py-2 border-b">Enregistrement de votre consentement aux cookies</td>
                  <td className="px-4 py-2 border-b">12 mois</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">_ga</td>
                  <td className="px-4 py-2 border-b">Analyse d’audience (Google Analytics)</td>
                  <td className="px-4 py-2 border-b">13 mois</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b">_fbp</td>
                  <td className="px-4 py-2 border-b">Publicité ciblée (Facebook Pixel)</td>
                  <td className="px-4 py-2 border-b">3 mois</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.3 Comment gérer les cookies ?</h3>
          <p className="mb-4">
            Vous pouvez à tout moment choisir de désactiver les cookies. Votre navigateur peut également être paramé pour vous signaler les cookies qui sont déposés dans votre ordinateur et vous demander de les accepter ou non.
          </p>
          <p className="mb-2">Pour gérer les cookies en fonction de vos souhaits, nous vous invitons à paramétrer votre navigateur en tenant compte de la finalité des cookies.</p>
          <p className="mb-4">
            Pour plus d’informations sur la gestion des cookies, consultez le site de la CNIL : <a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser</a>
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">2.4 Comment modifier vos préférences ?</h3>
          <p className="mb-4">
            Vous pouvez à tout moment modifier vos préférences en matière de cookies en cliquant sur le lien « Gérer les cookies » en bas de chaque page de notre site.
          </p>
        </article>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Contact</h2>
        <p className="mb-4">
          Pour toute question relative à la présente politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Par email : <b>admin@elecconnect.fr</b></li>
          <li>Par courrier : <b>31 rue Chevalier Paul, 83000 Toulon, France</b></li>
        </ul>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
          &larr; Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
