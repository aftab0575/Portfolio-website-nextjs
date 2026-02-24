import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getAllExperience, createExperience } from '@/modules/experience/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable(),
  description: z.string().min(1, 'Description is required'),
  techStack: z.array(z.string()),
})

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET() {
  try {
    const experiences = await getAllExperience()

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: experiences,
      },
      { headers: CACHE_HEADERS },
    )
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch experiences',
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
    const validatedData = experienceSchema.parse(body)

    const experience = await createExperience(validatedData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: experience,
      message: 'Experience created successfully',
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
        error: error.message || 'Failed to create experience',
      },
      { status: 500 }
    )
  }
}

