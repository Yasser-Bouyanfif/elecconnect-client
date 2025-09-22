import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales - ElecConnect',
  description: 'Informations légales concernant ElecConnect',
};

export default function MentionsLegales() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-emerald-700 mb-8">Mentions Légales</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Éditeur du site</h2>
        <p className="mb-2"><strong>ElecConnect</strong></p>
        <p className="mb-2">[Votre adresse complète]</p>
        <p className="mb-2">Téléphone : [Votre numéro]</p>
        <p className="mb-2">Email : contact@elecconnect.fr</p>
        <p className="mb-2">SIRET : [Votre numéro SIRET]</p>
        <p className="mb-2">TVA intracommunautaire : [Votre numéro de TVA]</p>
        <p className="mb-2">RCS : [Ville du RCS] [Numéro RCS]</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Directeur de la publication</h2>
        <p>[Nom du directeur de la publication]</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hébergement</h2>
        <p className="mb-2">[Nom de l'hébergeur]</p>
        <p className="mb-2">[Adresse de l'hébergeur]</p>
        <p className="mb-2">Téléphone : [Téléphone de l'hébergeur]</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Propriété intellectuelle</h2>
        <p className="mb-4">
          L'ensemble des éléments constituant le site internet (textes, images, logos, etc.) est la propriété exclusive d'ElecConnect ou de ses partenaires. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie des éléments composant le site sans l'accord préalable écrit d'ElecConnect est strictement interdite et constituerait un acte de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Liens hypertextes</h2>
        <p className="mb-4">
          Le site peut contenir des liens hypertextes vers d'autres sites internet. ElecConnect ne peut être tenu responsable du contenu de ces sites ou des éventuels dommages causés par leur consultation.
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
          &larr; Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
