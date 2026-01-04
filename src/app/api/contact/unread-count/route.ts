import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getUnreadCount } from '@/modules/contact/services'
import { ApiResponse } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const count = await getUnreadCount()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { count },
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to get unread count',
      },
      { status: 500 }
    )
  }
}

