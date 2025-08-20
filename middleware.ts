import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/thaid', '/api/auth/mfa']

// Define route permissions (simplified for middleware)
const protectedRoutes: Record<string, { requireAuth: boolean; requireMFA?: boolean }> = {
  '/settings': { requireAuth: true, requireMFA: true },
  '/users': { requireAuth: true, requireMFA: true },
  '/master-data': { requireAuth: true },
  '/budget-request': { requireAuth: true },
  '/work-plan': { requireAuth: true },
  '/allocation': { requireAuth: true },
  '/transfer': { requireAuth: true },
  '/reports': { requireAuth: true },
  '/import-budget': { requireAuth: true },
  '/compare': { requireAuth: true },
  '/export': { requireAuth: true },
  '/dpis': { requireAuth: true },
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow all routes for mockup demo - no authentication required
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}