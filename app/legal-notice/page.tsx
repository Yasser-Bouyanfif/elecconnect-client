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
        <p className="mb-2">Entreprise : <b>ElecConnect</b></p>
        <p className="mb-2">Adresse : <b>31 rue Chevalier Paul, 83000 Toulon, France</b></p>
        <p className="mb-2">Téléphone : <b>+33 6 98 65 77 80 / +33 4 22 91 82 91</b></p>
        <p className="mb-2">Email : <b>contact@elecconnect.fr</b></p>
        <p className="mb-2">SIRET : <b>928 755 412 00014</b></p>
        <p className="mb-2">RCS : <b>928 755 412 00014</b></p>
        <p className="mb-2">TVA intracommunautaire : <b>FR30 928 755 412</b></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Directeur de la publication</h2>
        <p>Rodolphe AGOSSOU</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hébergement</h2>
        <p className="mb-2">Vercel Inc.</p>
        <p className="mb-2">340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
        <p className="mb-2">Site web : <a href="https://vercel.com" className="text-emerald-600 hover:underline">vercel.com</a></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Propriété intellectuelle</h2>
        <p className="mb-4">
          L’ensemble des éléments constituant le site internet (textes, images, logos, etc.) est la propriété exclusive d’ElecConnect ou de ses partenaires. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie des éléments composant le site sans l’accord préalable écrit d’ElecConnect est strictement interdite et constituerait un acte de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Liens hypertextes</h2>
        <p className="mb-4">
          Le site peut contenir des liens hypertextes vers d’autres sites internet. ElecConnect ne peut être tenu responsable du contenu de ces sites ou des éventuels dommages causés par leur consultation.
        </p>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
          &larr; Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
