/**
 * Responsive Usage Examples
 * 
 * Examples demonstrating how to use the responsive utilities
 * in real components and applications.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

'use client'

import React from 'react'
import { useBreakpoint, useIsMobile } from '@/hooks/useBreakpoint'
import { 
  getResponsiveGridClasses,
  getResponsiveTextClasses,
  getResponsiveSpacingClasses,
  TOUCH_TARGET
} from '@/utils/responsive'

/**
 * Example 1: Simple responsive component using useBreakpoint hook
 */
export function ResponsiveNavigation() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  
  if (isMobile) {
    return (
      <nav className="p-4">
        <button className="w-full bg-blue-500 text-white py-3 rounded-lg min-h-[44px] touch-manipulation">
          ☰ Menu
        </button>
      </nav>
    )
  }
  
  return (
    <nav className="flex items-center space-x-6 p-4">
      <a href="#" className="hover:text-blue-500">Home</a>
      <a href="#" className="hover:text-blue-500">About</a>
      <a href="#" className="hover:text-blue-500">Projects</a>
      <a href="#" className="hover:text-blue-500">Contact</a>
    </nav>
  )
}

/**
 * Example 2: Responsive grid using utility classes
 */
export function ResponsiveProjectGrid({ projects }: { projects: Array<{ id: string; title: string; image: string }> }) {
  return (
    <div className={`grid gap-6 ${getResponsiveGridClasses({
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4
    })}`}>
      {projects.map(project => (
        <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-48 object-cover"
          />
          <div className={getResponsiveSpacingClasses('p', {
            mobile: '4',
            tablet: '6',
            desktop: '6'
          })}>
            <h3 className={getResponsiveTextClasses({
              mobile: 'lg',
              tablet: 'xl',
              desktop: 'xl'
            })}>
              {project.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Example 3: Touch-friendly button component
 */
export function TouchFriendlyButton({ 
  children, 
  onClick, 
  variant = 'primary' 
}: { 
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}) {
  const isMobile = useIsMobile()
  
  const baseClasses = `
    rounded-lg font-medium transition-colors touch-manipulation
    ${isMobile ? 'min-w-[44px] min-h-[44px] px-6 py-3' : 'px-4 py-2'}
  `
  
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      style={{
        minWidth: isMobile ? TOUCH_TARGET.minSize : 'auto',
        minHeight: isMobile ? TOUCH_TARGET.minSize : 'auto'
      }}
    >
      {children}
    </button>
  )
}

/**
 * Example 4: Responsive typography component
 */
export function ResponsiveHero({ title, subtitle }: { title: string; subtitle: string }) {
  const { currentBreakpoint } = useBreakpoint()
  
  return (
    <div className={getResponsiveSpacingClasses('py', {
      mobile: '12',
      tablet: '16',
      desktop: '20'
    })}>
      <h1 className={getResponsiveTextClasses({
        mobile: '3xl',
        tablet: '4xl',
        desktop: '5xl'
      })}>
        {title}
      </h1>
      <p className={`mt-4 ${getResponsiveTextClasses({
        mobile: 'lg',
        tablet: 'xl',
        desktop: 'xl'
      })} text-gray-600`}>
        {subtitle}
      </p>
      <div className="mt-2 text-sm text-gray-400">
        Current breakpoint: {currentBreakpoint}
      </div>
    </div>
  )
}

/**
 * Example 5: Responsive form layout
 */
export function ResponsiveContactForm() {
  const { isMobile } = useBreakpoint()
  
  return (
    <form className="space-y-6">
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input 
            type="text"
            className={`w-full border rounded-lg px-3 ${isMobile ? 'py-3 text-base' : 'py-2'}`}
            style={{ minHeight: isMobile ? TOUCH_TARGET.minSize : 'auto' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input 
            type="text"
            className={`w-full border rounded-lg px-3 ${isMobile ? 'py-3 text-base' : 'py-2'}`}
            style={{ minHeight: isMobile ? TOUCH_TARGET.minSize : 'auto' }}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input 
          type="email"
          className={`w-full border rounded-lg px-3 ${isMobile ? 'py-3 text-base' : 'py-2'}`}
          style={{ minHeight: isMobile ? TOUCH_TARGET.minSize : 'auto' }}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea 
          rows={isMobile ? 4 : 6}
          className={`w-full border rounded-lg px-3 ${isMobile ? 'py-3 text-base' : 'py-2'}`}
        />
      </div>
      
      <TouchFriendlyButton onClick={() => console.log('Form submitted')}>
        Send Message
      </TouchFriendlyButton>
    </form>
  )
}

/**
 * Example 6: Responsive image component
 */
export function ResponsiveImage({ 
  src, 
  alt, 
  aspectRatio = 'video' 
}: { 
  src: string
  alt: string
  aspectRatio?: 'square' | 'video' | 'portrait'
}) {
  const { currentBreakpoint } = useBreakpoint()
  
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]'
  }
  
  // Responsive image sizing based on breakpoint
  const maxWidth = {
    mobile: '100%',
    tablet: '80%',
    desktop: '60%',
    wide: '50%',
    ultrawide: '40%'
  }
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${aspectRatioClasses[aspectRatio]}`}
      style={{ maxWidth: maxWidth[currentBreakpoint] }}
    >
      <img 
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}

export default {
  ResponsiveNavigation,
  ResponsiveProjectGrid,
  TouchFriendlyButton,
  ResponsiveHero,
  ResponsiveContactForm,
  ResponsiveImage
}