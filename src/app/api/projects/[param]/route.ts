import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import {
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
} from '@/modules/projects/services'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

const projectUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  techStack: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  images: z
    .array(
      z.object({
        url: z.string(),
        publicId: z.string(),
        alt: z.string(),
        order: z.number(),
      })
    )
    .optional(),
  isFeatured: z.boolean().optional(),
  category: z.enum(['Frontend', 'Full-Stack', 'AI']).optional(),
})

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  try {
    const { param } = await params
    let project = null

    // Try ID first (if it looks like an ObjectId), then try slug
    if (isValidObjectId(param)) {
      project = await getProjectById(param)
    }

    // If not found by ID or not an ObjectId, try slug
    if (!project) {
      project = await getProjectBySlug(param)
    }

    if (!project) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: project,
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to fetch project',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
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

    const { param } = await params
    // PUT/DELETE operations only work with IDs
    if (!isValidObjectId(param)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid project ID',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = projectUpdateSchema.parse(body)

    const project = await updateProject(param, validatedData)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: project,
      message: 'Project updated successfully',
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
        error: error.message || 'Failed to update project',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
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

    const { param } = await params
    // DELETE operations only work with IDs
    if (!isValidObjectId(param)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid project ID',
        },
        { status: 400 }
      )
    }

    await deleteProject(param)

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to delete project',
      },
      { status: 500 }
    )
  }
}

