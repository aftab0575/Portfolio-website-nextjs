import { ApiResponse, ApiError } from '@/types/api'

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // For server-side, use absolute URL; for client-side, use relative
    const isServer = typeof window === 'undefined'
    const url = isServer ? `${this.baseURL}${endpoint}` : endpoint
    const token = typeof window !== 'undefined' ? this.getToken() : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'An error occurred',
          statusCode: response.status,
          errors: data.errors,
        }
        throw error
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          statusCode: 500,
        } as ApiError
      }
      throw error
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const token = typeof window !== 'undefined' ? this.getToken() : null

    const headers: HeadersInit = {}

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'An error occurred',
          statusCode: response.status,
          errors: data.errors,
        }
        throw error
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          statusCode: 500,
        } as ApiError
      }
      throw error
    }
  }
}

export const apiClient = new ApiClient()
export default apiClient

