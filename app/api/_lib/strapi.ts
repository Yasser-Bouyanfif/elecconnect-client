const STRAPI_API_URL =
  process.env.STRAPI_REST_API_URL ?? process.env.NEXT_PUBLIC_REST_API_URL;
const STRAPI_API_KEY =
  process.env.STRAPI_REST_API_KEY ?? process.env.NEXT_PUBLIC_REST_API_KEY;

if (!STRAPI_API_URL) {
  throw new Error("Missing STRAPI_REST_API_URL environment variable");
}

if (!STRAPI_API_KEY) {
  throw new Error("Missing STRAPI_REST_API_KEY environment variable");
}

export async function strapiFetch(path: string, init: RequestInit = {}) {
  const url = new URL(path, STRAPI_API_URL);

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${STRAPI_API_KEY}`);
  headers.set("Accept", "application/json");

  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function strapiJson<T = unknown>(
  path: string,
  init: RequestInit = {}
) {
  const response = await strapiFetch(path, init);
  const data = (await response.json()) as T;

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : "Strapi request failed";
    throw new Error(errorMessage);
  }

  return { data, status: response.status } as const;
}
