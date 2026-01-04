import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/modules/auth/services'
import { z } from 'zod'
import { ApiResponse } from '@/types/api'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    const authResponse = await login(validatedData)

    const response = NextResponse.json<ApiResponse>({
      success: true,
      data: authResponse,
      message: 'Login successful',
    })

    // Set HTTP-only cookie
    response.cookies.set('token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Also set a non-httpOnly cookie for client-side access (if needed)
    // But prefer using localStorage for client-side token access

    return response
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Validation error',
          message: error.errors[0].message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Login failed',
        message: error.message || 'Login failed',
      },
      { status: 401 }
    )
  }
}

