import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/modules/auth/guards'
import { uploadFileToCloudinary } from '@/modules/cloudinary/upload'
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
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      )
    }

    // Validate file type (PDF only)
    const isPdfMime = file.type === 'application/pdf' || file.type === 'application/x-pdf'
    const fileName = (file as any).name as string | undefined
    const isPdfName = typeof fileName === 'string' && fileName.toLowerCase().endsWith('.pdf')

    if (!isPdfMime && !isPdfName) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'File must be a PDF',
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

    const folder = (formData.get('folder') as string) || 'portfolio/cv'

    const result = await uploadFileToCloudinary(file, { folder })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
      },
      message: 'CV uploaded successfully',
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || 'Failed to upload CV',
      },
      { status: 500 }
    )
  }
}

