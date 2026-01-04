/**
 * Responsive Utilities Index
 * 
 * Central export point for all responsive utilities, hooks, and constants.
 * Provides a clean API for responsive functionality throughout the application.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

// Re-export constants
export {
  BREAKPOINTS,
  BREAKPOINT_NAMES,
  TOUCH_TARGET,
  RESPONSIVE_CONFIG,
  VIEWPORT_SIZES,
  MEDIA_QUERIES,
  getBreakpointFromWidth,
  isTouchTargetCompliant,
  getResponsiveColumns,
  type BreakpointName
} from '@/constants/responsive'

// Re-export hooks
export {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTouchDevice,
  type UseBreakpointReturn
} from '@/hooks/useBreakpoint'

// Re-export viewport utilities
export {
  getViewportInfo,
  isViewportBreakpoint,
  isViewportAtLeast,
  isViewportAtMost,
  getResponsiveValue,
  getResponsiveFontSize,
  getResponsiveSpacing,
  validateTouchTarget,
  getOptimalImageDimensions,
  simulateViewport,
  getTestViewportSizes,
  debounceViewportEvent,
  type ViewportInfo
} from '@/utils/viewport'

// Re-export testing utilities
export {
  generateResponsiveTestCases,
  testTouchTargets,
  measureLayoutStability,
  runResponsiveTest,
  runResponsiveTestSuite,
  generateTestReport,
  type ResponsiveTestCase,
  type TouchTargetTestResult,
  type ResponsiveTestResult
} from '@/utils/responsiveTesting'

/**
 * Quick utility functions for common responsive patterns
 */

/**
 * Get CSS classes for responsive behavior
 */
export function getResponsiveClasses(config: {
  mobile?: string
  tablet?: string
  desktop?: string
  wide?: string
  ultrawide?: string
}): string {
  const classes: string[] = []
  
  if (config.mobile) classes.push(config.mobile)
  if (config.tablet) classes.push(`md:${config.tablet}`)
  if (config.desktop) classes.push(`lg:${config.desktop}`)
  if (config.wide) classes.push(`xl:${config.wide}`)
  if (config.ultrawide) classes.push(`2xl:${config.ultrawide}`)
  
  return classes.join(' ')
}

/**
 * Get responsive grid classes
 */
export function getResponsiveGridClasses(columns: {
  mobile?: number
  tablet?: number
  desktop?: number
  wide?: number
  ultrawide?: number
}): string {
  return getResponsiveClasses({
    mobile: columns.mobile ? `grid-cols-${columns.mobile}` : undefined,
    tablet: columns.tablet ? `grid-cols-${columns.tablet}` : undefined,
    desktop: columns.desktop ? `grid-cols-${columns.desktop}` : undefined,
    wide: columns.wide ? `grid-cols-${columns.wide}` : undefined,
    ultrawide: columns.ultrawide ? `grid-cols-${columns.ultrawide}` : undefined
  })
}

/**
 * Get responsive text size classes
 */
export function getResponsiveTextClasses(sizes: {
  mobile?: string
  tablet?: string
  desktop?: string
  wide?: string
  ultrawide?: string
}): string {
  return getResponsiveClasses({
    mobile: sizes.mobile ? `text-${sizes.mobile}` : undefined,
    tablet: sizes.tablet ? `text-${sizes.tablet}` : undefined,
    desktop: sizes.desktop ? `text-${sizes.desktop}` : undefined,
    wide: sizes.wide ? `text-${sizes.wide}` : undefined,
    ultrawide: sizes.ultrawide ? `text-${sizes.ultrawide}` : undefined
  })
}

/**
 * Get responsive spacing classes
 */
export function getResponsiveSpacingClasses(
  property: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr',
  sizes: {
    mobile?: string | number
    tablet?: string | number
    desktop?: string | number
    wide?: string | number
    ultrawide?: string | number
  }
): string {
  return getResponsiveClasses({
    mobile: sizes.mobile ? `${property}-${sizes.mobile}` : undefined,
    tablet: sizes.tablet ? `${property}-${sizes.tablet}` : undefined,
    desktop: sizes.desktop ? `${property}-${sizes.desktop}` : undefined,
    wide: sizes.wide ? `${property}-${sizes.wide}` : undefined,
    ultrawide: sizes.ultrawide ? `${property}-${sizes.ultrawide}` : undefined
  })
}

/**
 * Check if element meets responsive design requirements
 */
export function validateResponsiveElement(element: HTMLElement): {
  isValid: boolean
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  
  const rect = element.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(element)
  
  // Check font size for text elements
  const fontSize = parseFloat(computedStyle.fontSize)
  if (element.textContent && fontSize < 16) {
    issues.push('Font size may be too small for mobile devices')
    recommendations.push('Use minimum 16px font size for body text on mobile')
  }
  
  // Check for horizontal overflow
  if (element.scrollWidth > element.clientWidth) {
    issues.push('Element has horizontal overflow')
    recommendations.push('Ensure content fits within viewport width')
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  }
}