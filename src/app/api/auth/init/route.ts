import { NextRequest, NextResponse } from 'next/server'
import { createAdminUser } from '@/modules/auth/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const initSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with a secret key
    if (process.env.NODE_ENV === 'production' && request.headers.get('x-secret-key') !== process.env.INIT_SECRET_KEY) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = initSchema.parse(body)

    const user = await createAdminUser(
      validatedData.name,
      validatedData.email,
      validatedData.password
    )

    return NextResponse.json<ApiResponse>({
      success: true,
      data: user,
      message: 'Admin user created successfully',
    })
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
        error: error.message || 'Failed to create admin user',
      },
      { status: 500 }
    )
  }
}

