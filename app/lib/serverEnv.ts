import "server-only";

const url_api = process.env.REST_API_URL;
const key_api = process.env.REST_API_KEY;
const stripe_public_key = process.env.STRIPE_PUBLISHABLE_KEY;
const stripe_secret_key = process.env.STRIPE_SECRET_KEY;
const resend_api_key = process.env.RESEND_API_KEY;
const google_place_id = process.env.GOOGLE_PLACE_ID;
const google_api_key = process.env.GOOGLE_API_KEY;

if (!url_api || !key_api || !stripe_public_key || !stripe_secret_key || !resend_api_key || !google_place_id || !google_api_key) {
    throw new Error("Missing required server environment variables");
}

export const API_KEY = key_api;
export const API_URL = url_api;
export const STRIPE_PUBLIC_KEY = stripe_public_key;
export const STRIPE_SECRET_KEY = stripe_secret_key;
export const RESEND_API_KEY = resend_api_key;
export const GOOGLE_PLACE_ID = google_place_id;
export const GOOGLE_API_KEY = google_api_key;
