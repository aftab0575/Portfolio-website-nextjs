import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { getAllProjects, createProject } from '@/modules/projects/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'
import { ProjectFormData } from '@/types/project'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  techStack: z.array(z.string()),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(
    z.object({
      url: z.string(),
      publicId: z.string(),
      alt: z.string(),
      order: z.number(),
    })
  ),
  isFeatured: z.boolean(),
  category: z.enum(['Frontend', 'Full-Stack', 'AI']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isFeatured = searchParams.get('isFeatured')
    const category = searchParams.get('category')

    const filters: any = {}
    if (isFeatured !== null) {
      filters.isFeatured = isFeatured === 'true'
    }
    if (category) {
      filters.category = category
    }

    const projects = await getAllProjects(filters)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: projects,
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch projects',
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
    const validatedData = projectSchema.parse(body)

    const project = await createProject(validatedData as ProjectFormData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: project,
      message: 'Project created successfully',
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
        error: error.message || 'Failed to create project',
      },
      { status: 500 }
    )
  }
}

