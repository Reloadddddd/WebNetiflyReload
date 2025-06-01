import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Protected routes that require authentication
  const protectedPaths = [
    '/servers/add',
    '/servers/mine',
    '/profile',
    '/admin'
  ]
  
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  
  // Check if it's an admin route
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
  
  // If accessing protected route without session, redirect to login
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // If accessing admin route without admin privileges, redirect to home
  if (isAdminPath && session?.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  return res
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}