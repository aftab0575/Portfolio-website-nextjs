/**
 * ResponsiveContainer Component
 * 
 * A container component that provides responsive padding and max-widths
 * following mobile-first responsive design principles.
 * 
 * Requirements: 1.1, 1.2, 1.3
 */

'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { getResponsiveSpacingClasses } from '@/utils/responsive'

export interface ResponsiveContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  as?: keyof JSX.IntrinsicElements
}

/**
 * ResponsiveContainer provides consistent responsive layout patterns
 * with mobile-first padding and max-width constraints
 */
export function ResponsiveContainer({
  children,
  maxWidth = 'xl',
  padding = 'md',
  className,
  as: Component = 'div'
}: ResponsiveContainerProps): JSX.Element {
  // Max-width classes based on Tailwind's container system
  const maxWidthClasses = {
    sm: 'max-w-sm',      // 384px
    md: 'max-w-md',      // 448px
    lg: 'max-w-lg',      // 512px
    xl: 'max-w-xl',      // 576px
    '2xl': 'max-w-2xl',  // 672px
    full: 'max-w-full'   // 100%
  }

  // Responsive padding configurations
  const paddingConfigs = {
    none: {},
    sm: {
      mobile: '2',    // 8px
      tablet: '3',    // 12px
      desktop: '4'    // 16px
    },
    md: {
      mobile: '4',    // 16px
      tablet: '6',    // 24px
      desktop: '8'    // 32px
    },
    lg: {
      mobile: '6',    // 24px
      tablet: '8',    // 32px
      desktop: '12'   // 48px
    },
    xl: {
      mobile: '8',    // 32px
      tablet: '12',   // 48px
      desktop: '16'   // 64px
    }
  }

  // Generate responsive padding classes
  const paddingClasses = padding !== 'none' 
    ? getResponsiveSpacingClasses('px', paddingConfigs[padding])
    : ''

  // Combine all classes
  const containerClasses = cn(
    // Base container styles
    'w-full mx-auto',
    
    // Max-width constraint
    maxWidthClasses[maxWidth],
    
    // Responsive padding
    paddingClasses,
    
    // Custom classes
    className
  )

  return (
    <Component className={containerClasses}>
      {children}
    </Component>
  )
}

export default ResponsiveContainer