export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth (NextAuth.js routes)
     * - favicon.ico (favicon file)
     */
    '/((?!api|auth|favicon.ico).*)',
  ],
}
