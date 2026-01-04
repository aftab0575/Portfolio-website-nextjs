/**
 * Viewport Utilities
 * 
 * Utility functions for viewport management, responsive calculations,
 * and programmatic viewport manipulation.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { 
  BREAKPOINTS, 
  VIEWPORT_SIZES, 
  TOUCH_TARGET,
  getBreakpointFromWidth,
  isTouchTargetCompliant,
  type BreakpointName 
} from '@/constants/responsive'

export interface ViewportInfo {
  width: number
  height: number
  breakpoint: BreakpointName
  aspectRatio: number
  isPortrait: boolean
  isLandscape: boolean
  devicePixelRatio: number
}

/**
 * Get current viewport information
 */
export function getViewportInfo(): ViewportInfo {
  if (typeof window === 'undefined') {
    // SSR fallback
    return {
      width: 1024,
      height: 768,
      breakpoint: 'desktop',
      aspectRatio: 1024 / 768,
      isPortrait: false,
      isLandscape: true,
      devicePixelRatio: 1
    }
  }

  const width = window.innerWidth
  const height = window.innerHeight
  const breakpoint = getBreakpointFromWidth(width)
  const aspectRatio = width / height
  const isPortrait = height > width
  const isLandscape = width >= height
  const devicePixelRatio = window.devicePixelRatio || 1

  return {
    width,
    height,
    breakpoint,
    aspectRatio,
    isPortrait,
    isLandscape,
    devicePixelRatio
  }
}

/**
 * Check if current viewport matches a specific breakpoint
 */
export function isViewportBreakpoint(breakpoint: BreakpointName): boolean {
  const { breakpoint: current } = getViewportInfo()
  return current === breakpoint
}

/**
 * Check if current viewport is at least a specific breakpoint
 */
export function isViewportAtLeast(breakpoint: BreakpointName): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= BREAKPOINTS[breakpoint]
}

/**
 * Check if current viewport is at most a specific breakpoint
 */
export function isViewportAtMost(breakpoint: BreakpointName): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= BREAKPOINTS[breakpoint]
}

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue<T>(values: Partial<Record<BreakpointName, T>>): T | undefined {
  const { breakpoint } = getViewportInfo()
  
  // Try exact match first
  if (values[breakpoint] !== undefined) {
    return values[breakpoint]
  }
  
  // Fallback to smaller breakpoints
  const fallbackOrder: BreakpointName[] = ['ultrawide', 'wide', 'desktop', 'tablet', 'mobile']
  const currentIndex = fallbackOrder.indexOf(breakpoint)
  
  for (let i = currentIndex + 1; i < fallbackOrder.length; i++) {
    const fallbackBreakpoint = fallbackOrder[i]
    if (values[fallbackBreakpoint] !== undefined) {
      return values[fallbackBreakpoint]
    }
  }
  
  return undefined
}

/**
 * Calculate responsive font size based on viewport
 */
export function getResponsiveFontSize(
  baseSizePx: number,
  scaleFactor: number = 0.1
): string {
  if (typeof window === 'undefined') return `${baseSizePx}px`
  
  const { width, breakpoint } = getViewportInfo()
  
  // Scale factor based on breakpoint
  let scale = 1
  switch (breakpoint) {
    case 'mobile':
      scale = Math.max(0.8, 1 - (768 - width) * scaleFactor / 768)
      break
    case 'tablet':
      scale = 1
      break
    case 'desktop':
    case 'wide':
    case 'ultrawide':
      scale = Math.min(1.2, 1 + (width - 1024) * scaleFactor / 1024)
      break
  }
  
  return `${Math.round(baseSizePx * scale)}px`
}

/**
 * Calculate responsive spacing based on viewport
 */
export function getResponsiveSpacing(baseSpacingRem: number): string {
  const { breakpoint } = getViewportInfo()
  
  let scale = 1
  switch (breakpoint) {
    case 'mobile':
      scale = 0.75
      break
    case 'tablet':
      scale = 0.875
      break
    case 'desktop':
      scale = 1
      break
    case 'wide':
      scale = 1.125
      break
    case 'ultrawide':
      scale = 1.25
      break
  }
  
  return `${baseSpacingRem * scale}rem`
}

/**
 * Validate touch target size for current viewport
 */
export function validateTouchTarget(
  element: HTMLElement | { width: number; height: number }
): {
  isCompliant: boolean
  width: number
  height: number
  recommendations?: string[]
} {
  let width: number
  let height: number
  
  if ('getBoundingClientRect' in element) {
    const rect = element.getBoundingClientRect()
    width = rect.width
    height = rect.height
  } else {
    width = element.width
    height = element.height
  }
  
  const isCompliant = isTouchTargetCompliant(width, height)
  const recommendations: string[] = []
  
  if (width < TOUCH_TARGET.minSize) {
    recommendations.push(`Increase width to at least ${TOUCH_TARGET.minSize}px (current: ${Math.round(width)}px)`)
  }
  
  if (height < TOUCH_TARGET.minSize) {
    recommendations.push(`Increase height to at least ${TOUCH_TARGET.minSize}px (current: ${Math.round(height)}px)`)
  }
  
  return {
    isCompliant,
    width: Math.round(width),
    height: Math.round(height),
    recommendations: recommendations.length > 0 ? recommendations : undefined
  }
}

/**
 * Get optimal image dimensions for current viewport
 */
export function getOptimalImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number
): { width: number; height: number; scale: number } {
  const { width: viewportWidth, breakpoint } = getViewportInfo()
  
  // Default max width based on breakpoint
  if (!maxWidth) {
    switch (breakpoint) {
      case 'mobile':
        maxWidth = Math.min(viewportWidth - 32, 400) // Account for padding
        break
      case 'tablet':
        maxWidth = Math.min(viewportWidth - 64, 600)
        break
      default:
        maxWidth = Math.min(viewportWidth - 128, 800)
        break
    }
  }
  
  const aspectRatio = originalWidth / originalHeight
  let width = Math.min(originalWidth, maxWidth)
  let height = width / aspectRatio
  
  // Ensure we don't exceed viewport height (with some margin)
  const maxHeight = window.innerHeight * 0.8
  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }
  
  const scale = width / originalWidth
  
  return {
    width: Math.round(width),
    height: Math.round(height),
    scale
  }
}

/**
 * Simulate viewport for testing purposes
 */
export function simulateViewport(width: number, height: number): void {
  if (typeof window === 'undefined') return
  
  // This is primarily for testing - in real scenarios, 
  // you'd use browser dev tools or testing frameworks
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  })
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

/**
 * Get common viewport sizes for testing
 */
export function getTestViewportSizes(): Array<{ name: string; width: number; height: number; breakpoint: BreakpointName }> {
  const sizes: Array<{ name: string; width: number; height: number; breakpoint: BreakpointName }> = []
  
  // Add mobile sizes
  Object.entries(VIEWPORT_SIZES.mobile).forEach(([size, dimensions]) => {
    sizes.push({
      name: `Mobile ${size}`,
      width: dimensions.width,
      height: dimensions.height,
      breakpoint: 'mobile'
    })
  })
  
  // Add tablet sizes
  Object.entries(VIEWPORT_SIZES.tablet).forEach(([size, dimensions]) => {
    sizes.push({
      name: `Tablet ${size}`,
      width: dimensions.width,
      height: dimensions.height,
      breakpoint: 'tablet'
    })
  })
  
  // Add desktop sizes
  Object.entries(VIEWPORT_SIZES.desktop).forEach(([size, dimensions]) => {
    sizes.push({
      name: `Desktop ${size}`,
      width: dimensions.width,
      height: dimensions.height,
      breakpoint: getBreakpointFromWidth(dimensions.width)
    })
  })
  
  return sizes
}

/**
 * Debounce function for viewport events
 */
export function debounceViewportEvent<T extends (...args: any[]) => void>(
  func: T,
  delay: number = 100
): T {
  let timeoutId: NodeJS.Timeout
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}