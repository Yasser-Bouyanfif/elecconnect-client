import "server-only";

const url_api = process.env.REST_API_URL;
const key_api = process.env.REST_API_KEY;
const stripe_public_key = process.env.STRIPE_PUBLISHABLE_KEY;
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

if (!url_api || !key_api || !stripe_public_key || !stripe_secret_key) {
    throw new Error("Missing STRAPI_REST_API_KEY environment variable");
}

export const API_KEY = key_api;
export const API_URL = url_api;
export const STRIPE_PUBLIC_KEY = stripe_public_key;
export const STRIPE_SECRET_KEY = stripe_secret_key;
