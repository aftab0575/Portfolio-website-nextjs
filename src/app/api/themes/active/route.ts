import { NextResponse } from 'next/server'
import { getActiveTheme } from '@/modules/theme/services'
import { ApiResponse } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const theme = await getActiveTheme()

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: theme,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
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

