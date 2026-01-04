'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getCurrentUser, setToken, setLoading } from '@/store/slices/authSlice'
import Sidebar from '@/components/layout/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, user, token } = useAppSelector((state) => state.auth)
  const [isMounted, setIsMounted] = useState(false)

  // Initialize auth state from localStorage on mount (client-side only)
  useEffect(() => {
    setIsMounted(true)
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (storedToken) {
      // Set token in Redux state first
      if (!token) {
        dispatch(setToken(storedToken))
      }
      // Then fetch user data
      if (!user) {
        dispatch(getCurrentUser())
      } else {
        // Already have user, stop loading
        dispatch(setLoading(false))
      }
    } else {
      // No token found, mark as not loading
      dispatch(setLoading(false))
    }
  }, []) // Only run on mount

  useEffect(() => {
    // Redirect to login if not authenticated (only after mount and loading complete)
    if (isMounted && !isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isMounted, isAuthenticated, isLoading, pathname, router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading state until mounted and auth check is complete
  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

