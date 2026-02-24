import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getSite, updateSite } from '@/modules/site/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const siteUpdateSchema = z.object({
  hero: z
    .object({
      imageUrl: z.union([z.string().url(), z.literal('')]).optional(),
      imageAlt: z.string().optional(),
      publicId: z.string().optional(),
    })
    .optional(),
})

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
  try {
    const site = await getSite()
    return NextResponse.json<ApiResponse>(
      { success: true, data: site },
      { headers: CACHE_HEADERS }
    )
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Failed to fetch site' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAuth(request)
    if (!authResult.isAuthenticated) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = siteUpdateSchema.parse(body)
    const site = await updateSite(validatedData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: site,
      message: 'Site updated successfully',
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Validation error',
          message: error.errors[0]?.message,
        },
        { status: 400 }
      )
    }
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Failed to update site' },
      { status: 500 }
    )
  }
}
