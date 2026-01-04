'use client'

import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchThemes, activateThemePublic } from '@/store/slices/themeSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Palette, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Theme } from '@/types/theme'
import { useToast } from '@/hooks/useToast'

interface ThemeSwitcherProps {
  className?: string
  variant?: 'dropdown' | 'grid'
  showLabel?: boolean
  onThemeChange?: (theme: Theme) => void
  showToast?: boolean
}

export default function ThemeSwitcher({ 
  className, 
  variant = 'dropdown',
  showLabel = true,
  onThemeChange,
  showToast = true
}: ThemeSwitcherProps) {
  const dispatch = useAppDispatch()
  const { themes, activeTheme, isLoading } = useAppSelector((state) => state.theme)
  const [isOpen, setIsOpen] = useState(false)
  const [isActivating, setIsActivating] = useState<string | null>(null)
  
  // Try to use toast, but don't fail if it's not available
  let addToast: ((toast: any) => void) | null = null
  try {
    const toastHook = useToast()
    addToast = toastHook.addToast
  } catch {
    // Toast provider not available, that's okay
  }

  useEffect(() => {
    // Fetch themes if not already loaded
    if (themes.length === 0 && !isLoading) {
      dispatch(fetchThemes())
    }
  }, [dispatch, themes.length, isLoading])

  const handleThemeChange = async (theme: Theme) => {
    if (isActivating || theme.isActive) return
    
    setIsActivating(theme._id!)
    try {
      await dispatch(activateThemePublic(theme._id!)).unwrap()
      setIsOpen(false)
      onThemeChange?.(theme)
      
      if (showToast && addToast) {
        addToast({
          type: 'success',
          title: 'Theme Changed',
          description: `"${theme.name}" theme has been activated successfully!`,
          duration: 3000
        })
      }
    } catch (error: any) {
      console.error('Failed to activate theme:', error)
      
      if (showToast && addToast) {
        addToast({
          type: 'error',
          title: 'Theme Change Failed',
          description: `Failed to activate "${theme.name}" theme. Please try again.`,
          duration: 5000
        })
      }
    } finally {
      setIsActivating(null)
    }
  }

  if (themes.length === 0) {
    return null // Don't show if no themes available
  }

  if (variant === 'grid') {
    return (
      <div className={cn('space-y-4', className)}>
        {showLabel && (
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Choose Theme
          </h3>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {themes.map((theme) => (
            <Card
              key={theme._id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-md relative',
                theme.isActive ? 'ring-2 ring-primary' : '',
                isActivating === theme._id ? 'opacity-50 cursor-not-allowed' : ''
              )}
              onClick={() => handleThemeChange(theme)}
            >
              <CardContent className="p-3">
                <div
                  className="h-16 rounded-md mb-2 relative overflow-hidden"
                  style={{ backgroundColor: theme.variables.background }}
                >
                  <div className="absolute inset-0 p-2 flex flex-col justify-between">
                    <div
                      className="text-xs font-medium"
                      style={{ color: theme.variables.foreground }}
                    >
                      {theme.name}
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.variables.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.variables.accent }}
                      />
                    </div>
                  </div>
                  {theme.isActive && (
                    <div className="absolute top-1 right-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  {isActivating === theme._id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-center text-muted-foreground truncate">
                  {theme.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Dropdown variant
  return (
    <div className={cn('relative', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        aria-label="Change theme"
      >
        <Palette className="h-4 w-4" />
        {showLabel && (
          <>
            <span className="hidden sm:inline">
              {activeTheme?.name || 'Theme'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 w-80 max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-900 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Choose Theme
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme._id}
                    onClick={() => handleThemeChange(theme)}
                    disabled={isActivating === theme._id}
                    className={cn(
                      'p-2 rounded-lg border transition-all duration-200 hover:shadow-sm text-left relative',
                      theme.isActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300',
                      isActivating === theme._id ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    <div
                      className="h-8 rounded mb-2 relative"
                      style={{ backgroundColor: theme.variables.background }}
                    >
                      <div className="absolute inset-0 p-1 flex justify-between items-center">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.variables.primary }}
                          />
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.variables.accent }}
                          />
                        </div>
                        {theme.isActive && (
                          <Check className="h-3 w-3 text-primary" />
                        )}
                        {isActivating === theme._id && (
                          <div className="animate-spin rounded-full h-3 w-3 border border-primary border-t-transparent" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-medium truncate">
                      {theme.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}