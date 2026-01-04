/**
 * useBreakpoint Hook
 * 
 * Custom React hook for detecting responsive breakpoints and viewport changes.
 * Provides real-time breakpoint information and viewport dimensions.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  BREAKPOINTS, 
  MEDIA_QUERIES, 
  getBreakpointFromWidth,
  type BreakpointName 
} from '@/constants/responsive'

interface ViewportDimensions {
  width: number
  height: number
}

export interface UseBreakpointReturn {
  // Current breakpoint information
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isWide: boolean
  isUltrawide: boolean
  currentBreakpoint: BreakpointName
  
  // Viewport dimensions
  viewport: ViewportDimensions
  
  // Orientation and capabilities
  isPortrait: boolean
  isLandscape: boolean
  isTouchDevice: boolean
  isRetina: boolean
  
  // Utility functions
  isBreakpoint: (breakpoint: BreakpointName) => boolean
  isAtLeast: (breakpoint: BreakpointName) => boolean
  isAtMost: (breakpoint: BreakpointName) => boolean
}

/**
 * Hook for responsive breakpoint detection
 */
export function useBreakpoint(): UseBreakpointReturn {
  const [viewport, setViewport] = useState<ViewportDimensions>(() => {
    // Safe default for SSR
    if (typeof window === 'undefined') {
      return { width: 1024, height: 768 }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  })

  const [mediaQueries, setMediaQueries] = useState(() => {
    // Safe defaults for SSR
    if (typeof window === 'undefined') {
      return {
        isPortrait: false,
        isLandscape: true,
        isTouchDevice: false,
        isRetina: false
      }
    }

    return {
      isPortrait: window.matchMedia(MEDIA_QUERIES.portrait).matches,
      isLandscape: window.matchMedia(MEDIA_QUERIES.landscape).matches,
      isTouchDevice: window.matchMedia(MEDIA_QUERIES.touch).matches,
      isRetina: window.matchMedia(MEDIA_QUERIES.retina).matches
    }
  })

  // Update viewport dimensions
  const updateViewport = useCallback(() => {
    if (typeof window === 'undefined') return

    setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  // Update media query states
  const updateMediaQueries = useCallback(() => {
    if (typeof window === 'undefined') return

    setMediaQueries({
      isPortrait: window.matchMedia(MEDIA_QUERIES.portrait).matches,
      isLandscape: window.matchMedia(MEDIA_QUERIES.landscape).matches,
      isTouchDevice: window.matchMedia(MEDIA_QUERIES.touch).matches,
      isRetina: window.matchMedia(MEDIA_QUERIES.retina).matches
    })
  }, [])

  // Set up event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Initial update
    updateViewport()
    updateMediaQueries()

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        updateViewport()
        updateMediaQueries()
      }, 100) // 100ms debounce
    }

    // Add event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    // Set up media query listeners
    const mediaQueryLists = [
      window.matchMedia(MEDIA_QUERIES.portrait),
      window.matchMedia(MEDIA_QUERIES.landscape),
      window.matchMedia(MEDIA_QUERIES.touch),
      window.matchMedia(MEDIA_QUERIES.retina)
    ]

    const handleMediaQueryChange = () => {
      updateMediaQueries()
    }

    mediaQueryLists.forEach(mql => {
      // Use modern addEventListener if available, fallback to addListener
      if (mql.addEventListener) {
        mql.addEventListener('change', handleMediaQueryChange)
      } else {
        // @ts-ignore - Legacy support
        mql.addListener(handleMediaQueryChange)
      }
    })

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      
      mediaQueryLists.forEach(mql => {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handleMediaQueryChange)
        } else {
          // @ts-ignore - Legacy support
          mql.removeListener(handleMediaQueryChange)
        }
      })
    }
  }, [updateViewport, updateMediaQueries])

  // Calculate current breakpoint
  const currentBreakpoint = getBreakpointFromWidth(viewport.width)

  // Breakpoint boolean flags
  const isMobile = currentBreakpoint === 'mobile'
  const isTablet = currentBreakpoint === 'tablet'
  const isDesktop = currentBreakpoint === 'desktop'
  const isWide = currentBreakpoint === 'wide'
  const isUltrawide = currentBreakpoint === 'ultrawide'

  // Utility functions
  const isBreakpoint = useCallback((breakpoint: BreakpointName): boolean => {
    return currentBreakpoint === breakpoint
  }, [currentBreakpoint])

  const isAtLeast = useCallback((breakpoint: BreakpointName): boolean => {
    const currentWidth = viewport.width
    const targetWidth = BREAKPOINTS[breakpoint]
    return currentWidth >= targetWidth
  }, [viewport.width])

  const isAtMost = useCallback((breakpoint: BreakpointName): boolean => {
    const currentWidth = viewport.width
    const targetWidth = BREAKPOINTS[breakpoint]
    return currentWidth <= targetWidth
  }, [viewport.width])

  return {
    // Breakpoint flags
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isUltrawide,
    currentBreakpoint,
    
    // Viewport information
    viewport,
    
    // Media query states
    isPortrait: mediaQueries.isPortrait,
    isLandscape: mediaQueries.isLandscape,
    isTouchDevice: mediaQueries.isTouchDevice,
    isRetina: mediaQueries.isRetina,
    
    // Utility functions
    isBreakpoint,
    isAtLeast,
    isAtMost
  }
}

/**
 * Hook for simple mobile detection
 */
export function useIsMobile(): boolean {
  const { isMobile } = useBreakpoint()
  return isMobile
}

/**
 * Hook for simple tablet detection
 */
export function useIsTablet(): boolean {
  const { isTablet } = useBreakpoint()
  return isTablet
}

/**
 * Hook for simple desktop detection
 */
export function useIsDesktop(): boolean {
  const { isDesktop, isWide, isUltrawide } = useBreakpoint()
  return isDesktop || isWide || isUltrawide
}

/**
 * Hook for touch device detection
 */
export function useIsTouchDevice(): boolean {
  const { isTouchDevice } = useBreakpoint()
  return isTouchDevice
}

export default useBreakpoint