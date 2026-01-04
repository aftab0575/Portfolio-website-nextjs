'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchActiveTheme } from '@/store/slices/themeSlice'
import { applyThemeColors } from '@/utils/themeUtils'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { activeTheme } = useAppSelector((state) => state.theme)

  useEffect(() => {
    // Only fetch if theme is not already loaded
    if (!activeTheme) {
      dispatch(fetchActiveTheme())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeTheme) {
      applyThemeColors(activeTheme)
    }
  }, [activeTheme])

  return <>{children}</>
}

