import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/account(.*)',
  '/',
  '/cart(.*)',
  '/solar-solution(.*)',
  '/shop(.*)',
  '/product(.*)',
  '/api/products(.*)',
  '/api/cart-total(.*)',
  '/api/promotion(.*)',
  '/api/google-reviews(.*)',
  '/404(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const signInAbs = new URL("/account", req.nextUrl.origin).toString();

    await auth.protect({ unauthenticatedUrl: signInAbs });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
