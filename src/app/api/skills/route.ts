import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getAllSkills, createSkill } from '@/modules/skills/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.number().min(1).max(100),
  order: z.number(),
  isActive: z.boolean(),
})

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const skills = await getAllSkills(activeOnly)

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: skills,
      },
      { headers: CACHE_HEADERS },
    )
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch skills',
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
    const validatedData = skillSchema.parse(body)

    const skill = await createSkill(validatedData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: skill,
      message: 'Skill created successfully',
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
        error: error.message || 'Failed to create skill',
      },
      { status: 500 }
    )
  }
}

