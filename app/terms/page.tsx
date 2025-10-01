import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - ElecConnect',
  description: 'Conditions générales de vente de ElecConnect',
};

export default function CGV() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-emerald-700 mb-8">Conditions Générales de Vente</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Objet</h2>
        <p className="mb-4">
          Les présentes conditions générales de vente (CGV) s’appliquent à toutes les commandes passées sur le site internet ElecConnect. Toute commande implique l’acceptation sans réserve des présentes conditions générales de vente.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Caractéristiques des produits</h2>
        <p className="mb-4">
          Les caractéristiques essentielles des produits, leurs prix et leur disponibilité sont indiqués sur le site au moment de la commande. Les photographies des produits sont les plus fidèles possibles mais ne sont pas contractuelles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Prix</h2>
        <p className="mb-4">
          Les prix sont indiqués en euros toutes taxes comprises (TTC). Ils tiennent compte de la TVA applicable au jour de la commande. En cas de modification de taux, ces changements pourront être répercutés sur le prix des produits. ElecConnect se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable.
        </p>
        <p className="mb-4">
          <strong>Éco-participation :</strong> Le prix des produits comprend une éco-participation qui correspond à la contribution au recyclage des équipements électriques et électroniques (DEEE).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Frais et délais de livraison</h2>
        <p className="mb-4">
          Les délais de livraison sont indiqués lors de la commande. Ils sont donnés à titre indicatif et ne sont aucunement garantis. En cas de retard de livraison, le client sera informé par email.
        </p>
        <p className="mb-4">
          Les frais de livraison sont calculés en fonction du poids du colis et de l’adresse de livraison. Ils sont indiqués de manière claire et compréhensible avant la validation de la commande.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Paiement et exécution de la commande</h2>
        <p className="mb-4">
          Le paiement s’effectue par carte bancaire via une plateforme sécurisée. La commande ne sera validée qu’à réception du paiement. En cas de défaut de paiement, de refus d’autorisation de paiement par carte bancaire, de défaut de provision ou de tout autre incident, la commande sera annulée.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Droit de rétractation</h2>
        <p className="mb-4">
          Conformément à l’article L.221-18 du Code de la consommation, vous disposez d’un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités. Pour les retours, les frais de retour sont à votre charge.
        </p>
        <p className="mb-4">
          <strong>Formulaire de rétractation :</strong> Vous pouvez utiliser le formulaire suivant pour exercer votre droit de rétractation :
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="font-medium mb-2">À l’attention de [Votre société], [Votre adresse]</p>
          <p className="mb-4">Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous :</p>
          <p>Commandé le [date] / reçu le [date]</p>
          <p>Numéro de commande : [numéro]</p>
          <p>Nom du consommateur : [nom]</p>
          <p>Adresse du consommateur : [adresse]</p>
          <p>Signature (uniquement en cas de notification du présent formulaire sur papier) :</p>
          <p>Date : [date]</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Garanties légales et SAV</h2>
        <p className="mb-4">
          Tous nos produits bénéficient de la garantie légale de conformité de 2 ans (article L. 217-4 du code de la consommation) et de la garantie des vices cachés (articles 1641 à 1649 du code civil).
        </p>
        <p className="mb-4">
          Pour toute réclamation, merci de contacter notre service client à l’adresse suivante : sav@elecconnect.fr
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Médiateur de la consommation</h2>
        <p className="mb-4">
          En cas de litige, le consommateur peut recourir à un médiateur de la consommation dans les conditions prévues aux articles L. 612-1 et suivants du code de la consommation.
        </p>
        <p className="mb-4">
          <strong>Coordonnées du médiateur :</strong><br />
          [Nom du médiateur]<br />
          [Adresse du médiateur]<br />
          [Site internet du médiateur]<br />
          [Email du médiateur]
        </p>
        <p className="mb-4">
          Plateforme de Règlement des Litiges en ligne (RLL) : https://webgate.ec.europa.eu/odr
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Retours et réclamations</h2>
        <p className="mb-4">
          Les retours doivent être effectués dans leur état d’origine et complets. Les frais de retour sont à la charge du client, sauf en cas d’erreur de notre part ou de produit non conforme.
        </p>
        <p className="mb-4">
          Pour toute réclamation, vous pouvez nous contacter par email à l’adresse reclamations@elecconnect.fr ou par courrier à l’adresse indiquée dans les mentions légales.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Droit applicable et juridiction compétente</h2>
        <p className="mb-4">
          Les présentes conditions générales de vente sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
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
