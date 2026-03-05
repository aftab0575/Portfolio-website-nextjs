import { NextResponse } from 'next/server'
import cloudinary from '@/services/cloudinary'
import { getSite } from '@/modules/site/services'
import { ApiResponse } from '@/types/api'

function toSafePdfFilename(rawName?: string): string {
  const base = (rawName || 'YourName-CV').replace(/\.pdf$/i, '')
  const ascii = base.normalize('NFKD').replace(/[^\x20-\x7E]/g, '')
  const cleaned = ascii
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  const finalBase = cleaned || 'YourName-CV'
  return `${finalBase}.pdf`
}

export async function GET() {
  try {
    const site = await getSite()

    if (!site?.cv?.publicId) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'CV not found',
        },
        { status: 404 }
      )
    }

    const filename = toSafePdfFilename(site.cv.fileName)
    const cloudinaryUrl =
      site.cv.url ||
      cloudinary.utils.url(site.cv.publicId, {
        resource_type: 'raw',
        type: 'upload',
        secure: true,
      })

    const upstream = await fetch(cloudinaryUrl, { cache: 'no-store' })
    if (!upstream.ok || !upstream.body) {
      throw new Error(`Failed to fetch CV file (status ${upstream.status})`)
    }

    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set(
      'Content-Disposition',
      `inline; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    )
    headers.set('Cache-Control', 'no-store')

    const contentLength = upstream.headers.get('content-length')
    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    })
  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error?.message || 'Failed to load CV',
      },
      { status: 500 }
    )
  }
}

