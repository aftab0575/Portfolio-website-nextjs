import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { requireAuth, redirectToLogin } from '@/modules/auth/guards'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams
  
  // Skip RSC (React Server Component) requests and Next.js internal requests
  // These are handled by Next.js internally and shouldn't be intercepted
  if (
    searchParams.has('_rsc') ||
    searchParams.has('__nextjs_router_state_tree') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const authResult = await requireAuth(request)

    if (!authResult.isAuthenticated) {
      return redirectToLogin()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

