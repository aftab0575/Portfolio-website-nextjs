import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'

export async function POST() {
  const response = NextResponse.json<ApiResponse>({
    success: true,
    message: 'Logout successful',
  })

  // Clear the token cookie
  response.cookies.delete('token')

  return response
}

