import "server-only";

const url_api = process.env.REST_API_URL;
const key_api = process.env.REST_API_KEY;
const stripe_public_key = process.env.STRIPE_PUBLISHABLE_KEY;
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
const resend_api_key = process.env.RESEND_API_KEY;

if (!url_api || !key_api || !stripe_public_key || !stripe_secret_key || !resend_api_key) {
    throw new Error("Missing required server environment variables");
}

export const API_KEY = key_api;
export const API_URL = url_api;
export const STRIPE_PUBLIC_KEY = stripe_public_key;
export const STRIPE_SECRET_KEY = stripe_secret_key;
export const RESEND_API_KEY = resend_api_key;
