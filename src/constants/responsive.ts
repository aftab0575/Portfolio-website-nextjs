/**
 * Responsive Design Constants
 * 
 * Defines breakpoints, touch targets, and responsive configuration
 * for the mobile-first responsive design system.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultrawide: 1536
} as const

export const BREAKPOINT_NAMES = ['mobile', 'tablet', 'desktop', 'wide', 'ultrawide'] as const

export type BreakpointName = typeof BREAKPOINT_NAMES[number]

export const TOUCH_TARGET = {
  minSize: 44, // Minimum touch target size in pixels (WCAG AA)
  minSpacing: 8, // Minimum spacing between touch targets
  recommendedSize: 48 // Recommended touch target size
} as const

export const RESPONSIVE_CONFIG = {
  breakpoints: BREAKPOINTS,
  touchTargetMinSize: TOUCH_TARGET.minSize,
  fontSizes: {
    mobile: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px - minimum for mobile body text
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem'     // 48px
    },
    tablet: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    desktop: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    }
  },
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem'   // 48px
  }
} as const

export const VIEWPORT_SIZES = {
  // Common mobile device sizes
  mobile: {
    small: { width: 320, height: 568 },   // iPhone SE
    medium: { width: 375, height: 667 },  // iPhone 8
    large: { width: 414, height: 896 }    // iPhone 11 Pro Max
  },
  // Common tablet sizes
  tablet: {
    small: { width: 768, height: 1024 },  // iPad Mini
    medium: { width: 820, height: 1180 }, // iPad Air
    large: { width: 1024, height: 1366 } // iPad Pro 12.9"
  },
  // Common desktop sizes
  desktop: {
    small: { width: 1280, height: 720 },  // HD
    medium: { width: 1920, height: 1080 }, // Full HD
    large: { width: 2560, height: 1440 }  // QHD
  }
} as const

/**
 * Media query strings for programmatic use
 */
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.tablet - 1}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
  wide: `(min-width: ${BREAKPOINTS.wide}px)`,
  ultrawide: `(min-width: ${BREAKPOINTS.ultrawide}px)`,
  
  // Orientation queries
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Touch capability
  touch: '(pointer: coarse)',
  mouse: '(pointer: fine)',
  
  // High DPI displays
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
} as const

/**
 * Utility function to get breakpoint name from width
 */
export function getBreakpointFromWidth(width: number): BreakpointName {
  if (width >= BREAKPOINTS.ultrawide) return 'ultrawide'
  if (width >= BREAKPOINTS.wide) return 'wide'
  if (width >= BREAKPOINTS.desktop) return 'desktop'
  if (width >= BREAKPOINTS.tablet) return 'tablet'
  return 'mobile'
}

/**
 * Utility function to check if a size meets touch target requirements
 */
export function isTouchTargetCompliant(width: number, height: number): boolean {
  return width >= TOUCH_TARGET.minSize && height >= TOUCH_TARGET.minSize
}

/**
 * Utility function to get responsive grid columns based on breakpoint
 */
export function getResponsiveColumns(breakpoint: BreakpointName): number {
  switch (breakpoint) {
    case 'mobile':
      return 1
    case 'tablet':
      return 2
    case 'desktop':
      return 3
    case 'wide':
      return 4
    case 'ultrawide':
      return 5
    default:
      return 1
  }
}