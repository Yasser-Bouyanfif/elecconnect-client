This project is a [Next.js](https://nextjs.org) e-commerce front-end. It now integrates [Shippo](https://goshippo.com/) to let shoppers pick a carrier before being redirected to Stripe Checkout.

## Getting started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

## Shippo configuration

Create an `.env.local` file at the project root and configure the following variables with your Shippo credentials and origin address:

```bash
SHIPPO_API_TOKEN=your_private_token
SHIPPO_FROM_NAME=John Doe
SHIPPO_FROM_COMPANY=My Company            # optional
SHIPPO_FROM_STREET1=12 Rue des Fleurs
SHIPPO_FROM_STREET2=Appartement 34        # optional
SHIPPO_FROM_CITY=Paris
SHIPPO_FROM_STATE=Île-de-France           # optional
SHIPPO_FROM_ZIP=75001
SHIPPO_FROM_COUNTRY=FR
SHIPPO_FROM_PHONE=+33123456789            # optional
SHIPPO_FROM_EMAIL=john.doe@example.com    # optional
SHIPPO_CURRENCY=EUR                       # optional (defaults to EUR)
```

The checkout flow requests shipping rates from `app/api/shipping-rates`, filters them to the configured currency, and persists the shopper's choice until the Stripe Checkout session completes.

## Development workflow

- `npm run dev` – start the local development server.
- `npm run lint` – run ESLint checks.

When testing the checkout flow locally, make sure your browser can reach the Next.js server (http://localhost:3000) and that the Shippo API token has access to live or test rates for the destination country.
