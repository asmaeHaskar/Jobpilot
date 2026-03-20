import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // List of public routes that don't require auth
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/setup']

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For all other routes, auth is handled by the page itself
  // Supabase client-side will redirect to login if needed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
