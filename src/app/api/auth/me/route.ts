import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getUserById } from '@/modules/auth/services'
import { ApiResponse } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)

    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized',
          message: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    const user = await getUserById(authResult.user.userId)

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to get user',
      },
      { status: 500 }
    )
  }
}

