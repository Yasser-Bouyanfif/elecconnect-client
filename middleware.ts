import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Configuration pour forcer l'encodage UTF-8

const isPublicRoute = createRouteMatcher([
  '/account(.*)',
  '/',
  '/cart(.*)',
  '/solar-solution(.*)',
  '/shop(.*)',
  '/success(.*)',
  '/product(.*)',
  '/api/products(.*)',
  '/api/cart-total(.*)',
  '/api/promotion(.*)',
  '/api/google-reviews(.*)',
  '/404(.*)',
  '/legal-notice(.*)',
  '/privacy-policy(.*)',
  '/terms(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const response = NextResponse.next()

  
  if (!isPublicRoute(req)) {
    const signInAbs = new URL("/account", req.nextUrl.origin).toString();
    await auth.protect({ unauthenticatedUrl: signInAbs });
  }
  
  return response
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
