import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { uploadImageToCloudinary } from '@/modules/cloudinary/upload'
import { ApiResponse } from '@/types/api'

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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'File must be an image',
        },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'File size must be less than 10MB',
        },
        { status: 400 }
      )
    }

    const folder = (formData.get('folder') as string) || 'portfolio'

    const result = await uploadImageToCloudinary(file, { folder })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
      message: 'Image uploaded successfully',
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to upload image',
      },
      { status: 500 }
    )
  }
}

