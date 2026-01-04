import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getExperienceById, updateExperience, deleteExperience } from '@/modules/experience/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const experienceUpdateSchema = z.object({
  company: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  startDate: z.string().min(1).optional(),
  endDate: z.string().nullable().optional(),
  description: z.string().min(1).optional(),
  techStack: z.array(z.string()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const experience = await getExperienceById(id)

    if (!experience) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Experience not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: experience,
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch experience',
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

    const body = await request.json()
    const validatedData = experienceUpdateSchema.parse(body)

    const { id } = await params
    const experience = await updateExperience(id, validatedData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: experience,
      message: 'Experience updated successfully',
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
        error: error.message || 'Failed to update experience',
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
    await deleteExperience(id)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Experience deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to delete experience',
      },
      { status: 500 }
    )
  }
}

