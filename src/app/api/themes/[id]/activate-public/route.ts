import { NextRequest, NextResponse } from 'next/server'
import { activateTheme } from '@/modules/theme/services'
import { ApiResponse } from '@/types/api'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const theme = await activateTheme(id)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: theme,
      message: 'Theme activated successfully',
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to activate theme',
      },
      { status: 500 }
    )
  }
}