import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './services'

export async function requireAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean
  user?: any
  error?: string
}> {
  try {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return {
        isAuthenticated: false,
        error: 'No token provided',
      }
    }

    const decoded = await verifyToken(token)

    return {
      isAuthenticated: true,
      user: decoded,
    }
  } catch (error: any) {
    return {
      isAuthenticated: false,
      error: error.message || 'Authentication failed',
    }
  }
}

export function redirectToLogin(): NextResponse {
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
}

