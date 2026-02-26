'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchActiveTheme } from '@/store/slices/themeSlice'
import { applyThemeColors } from '@/utils/themeUtils'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { activeTheme } = useAppSelector((state) => state.theme)

  useEffect(() => {
    let cancelled = false

    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const loadTheme = async () => {
      // Only fetch if theme is not already loaded
      if (activeTheme) return

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const result = await dispatch(fetchActiveTheme())
        if (cancelled) return

        if (fetchActiveTheme.fulfilled.match(result) && result.payload) {
          return
        }

        if (attempt < 2) {
          await wait(350 * (attempt + 1))
        }
      }
    }

    void loadTheme()
    return () => {
      cancelled = true
    }
  }, [activeTheme, dispatch])

  useEffect(() => {
    if (activeTheme) {
      applyThemeColors(activeTheme)
    }
  }, [activeTheme])

  return <>{children}</>
}

