import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getAllThemes, createTheme } from '@/modules/theme/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const themeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  variables: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    foreground: z.string(),
    accent: z.string(),
    border: z.string(),
  }),
})

export async function GET() {
  try {
    const themes = await getAllThemes()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: themes,
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch themes',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const validatedData = themeSchema.parse(body)

    const theme = await createTheme(validatedData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: theme,
      message: 'Theme created successfully',
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
        error: error.message || 'Failed to create theme',
      },
      { status: 500 }
    )
  }
}

