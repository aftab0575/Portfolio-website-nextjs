import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getThemeById, updateTheme, deleteTheme } from '@/modules/theme/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const themeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  variables: z
    .object({
      primary: z.string(),
      secondary: z.string(),
      background: z.string(),
      foreground: z.string(),
      accent: z.string(),
      border: z.string(),
    })
    .optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const theme = await getThemeById(id)

    if (!theme) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Theme not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: theme,
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch theme',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const validatedData = themeUpdateSchema.parse(body)

    const theme = await updateTheme(id, validatedData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: theme,
      message: 'Theme updated successfully',
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
        error: error.message || 'Failed to update theme',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    await deleteTheme(id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Theme deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to delete theme',
      },
      { status: 500 }
    )
  }
}

