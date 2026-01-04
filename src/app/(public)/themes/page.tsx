'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchThemes } from '@/store/slices/themeSlice'
import ThemeSwitcher from '@/components/theme/ThemeSwitcher'
import { Palette } from 'lucide-react'

export default function ThemesPage() {
  const dispatch = useAppDispatch()
  const { themes, isLoading } = useAppSelector((state) => state.theme)

  useEffect(() => {
    if (themes.length === 0 && !isLoading) {
      dispatch(fetchThemes())
    }
  }, [dispatch, themes.length, isLoading])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Website Themes</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Customize your viewing experience by selecting from our available themes. 
            Changes will be applied instantly across the entire website.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : themes.length === 0 ? (
          <div className="text-center py-12">
            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Themes Available</h3>
            <p className="text-gray-600">
              No custom themes have been created yet. Check back later for theme options.
            </p>
          </div>
        ) : (
          <ThemeSwitcher variant="grid" showLabel={false} />
        )}
      </div>
    </div>
  )
}