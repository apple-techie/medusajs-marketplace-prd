import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for the login page
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // For client-side auth check, we'll rely on the fetchAdmin redirect logic
  // The actual token check happens in the API calls via localStorage
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