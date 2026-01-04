/**
 * ResponsiveGrid Component
 * 
 * A grid system component with responsive column counts and adaptive spacing.
 * Implements mobile-first responsive design with flexible grid configurations.
 * 
 * Requirements: 3.5
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { getResponsiveGridClasses, getResponsiveSpacingClasses } from '@/utils/responsive'

export interface ResponsiveGridProps {
  children: React.ReactNode
  columns: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
    ultrawide?: number
  }
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * ResponsiveGrid provides a flexible grid system that adapts column counts
 * and spacing based on viewport breakpoints
 */
export function ResponsiveGrid({
  children,
  columns,
  gap = 'md',
  className,
  as: Component = 'div'
}: ResponsiveGridProps): JSX.Element {
  // Gap size mappings to Tailwind classes
  const gapClasses = {
    xs: 'gap-2',    // 8px
    sm: 'gap-3',    // 12px
    md: 'gap-4',    // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
    '2xl': 'gap-12' // 48px
  }

  // Generate responsive grid column classes
  const gridClasses = getResponsiveGridClasses(columns)

  // Combine all classes
  const containerClasses = cn(
    // Base grid styles
    'grid',
    
    // Responsive columns
    gridClasses,
    
    // Gap spacing
    gapClasses[gap],
    
    // Custom classes
    className
  )

  return (
    <Component className={containerClasses}>
      {children}
    </Component>
  )
}

/**
 * ResponsiveGridItem - Optional wrapper for grid items with responsive behavior
 */
export interface ResponsiveGridItemProps {
  children: React.ReactNode
  span?: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
    ultrawide?: number
  }
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function ResponsiveGridItem({
  children,
  span,
  className,
  as: Component = 'div'
}: ResponsiveGridItemProps): JSX.Element {
  // Generate responsive column span classes
  const spanClasses = span ? (() => {
    const classes: string[] = []
    
    if (span.mobile) classes.push(`col-span-${span.mobile}`)
    if (span.tablet) classes.push(`md:col-span-${span.tablet}`)
    if (span.desktop) classes.push(`lg:col-span-${span.desktop}`)
    if (span.wide) classes.push(`xl:col-span-${span.wide}`)
    if (span.ultrawide) classes.push(`2xl:col-span-${span.ultrawide}`)
    
    return classes.join(' ')
  })() : ''

  const itemClasses = cn(
    spanClasses,
    className
  )

  return (
    <Component className={itemClasses}>
      {children}
    </Component>
  )
}

/**
 * Preset grid configurations for common layouts
 */
export const GRID_PRESETS = {
  // Card layouts
  cards: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4
  },
  
  // Feature grids
  features: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  
  // Gallery layouts
  gallery: {
    mobile: 2,
    tablet: 3,
    desktop: 4,
    wide: 5,
    ultrawide: 6
  },
  
  // Dashboard widgets
  dashboard: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
    wide: 6
  },
  
  // Two-column layouts
  twoColumn: {
    mobile: 1,
    tablet: 2,
    desktop: 2
  },
  
  // Three-column layouts
  threeColumn: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
} as const

/**
 * Convenience components for common grid patterns
 */
export function CardGrid({ children, className, gap = 'lg' }: Omit<ResponsiveGridProps, 'columns'>) {
  return (
    <ResponsiveGrid 
      columns={GRID_PRESETS.cards} 
      gap={gap}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  )
}

export function FeatureGrid({ children, className, gap = 'lg' }: Omit<ResponsiveGridProps, 'columns'>) {
  return (
    <ResponsiveGrid 
      columns={GRID_PRESETS.features} 
      gap={gap}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  )
}

export function GalleryGrid({ children, className, gap = 'md' }: Omit<ResponsiveGridProps, 'columns'>) {
  return (
    <ResponsiveGrid 
      columns={GRID_PRESETS.gallery} 
      gap={gap}
      className={className}
    >
      {children}
    </ResponsiveGrid>
  )
}

export default ResponsiveGrid