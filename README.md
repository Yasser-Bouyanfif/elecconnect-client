## Order API

The `/api/order` endpoint is protected with Clerk server-side helpers. The handler retrieves the active session via `auth()` and `currentUser()` and rejects unauthenticated requests with a `401` status code. Incoming payloads are only expected to provide the cart contents; the authenticated Clerk profile is the single source of truth for the order's `userId` and email address.

When integrating this endpoint from the client, ensure that:

- Requests include credentials (cookies) so Clerk can associate them with an active session.
- No user identifiers are sent in the request body. The server derives them from the authenticated Clerk session before creating the order in Strapi.

Run the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
