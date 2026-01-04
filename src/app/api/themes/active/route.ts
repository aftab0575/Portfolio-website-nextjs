import { NextResponse } from 'next/server'
import { getActiveTheme } from '@/modules/theme/services'
import { ApiResponse } from '@/types/api'

export async function GET() {
  try {
    const theme = await getActiveTheme()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: theme,
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch active theme',
      },
      { status: 500 }
    )
  }
}

