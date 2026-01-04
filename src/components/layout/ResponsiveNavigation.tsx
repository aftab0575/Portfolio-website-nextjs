'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import MobileNavigation, { NavigationItem } from './MobileNavigation'
import ThemeSwitcher from '../theme/ThemeSwitcher'

interface ResponsiveNavigationProps {
  menuItems: NavigationItem[]
  logo?: React.ReactNode
  className?: string
  brandName?: string
  brandHref?: string
}

interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isSwipping: boolean
}

export default function ResponsiveNavigation({
  menuItems,
  logo,
  className,
  brandName,
  brandHref = '/'
}: ResponsiveNavigationProps) {
  const pathname = usePathname()
  const { isMobile } = useBreakpoint()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const swipeRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwipping: false
  })

  // Swipe gesture configuration
  const SWIPE_THRESHOLD = 50 // Minimum distance for swipe
  const SWIPE_VELOCITY_THRESHOLD = 0.3 // Minimum velocity
  const MAX_VERTICAL_DEVIATION = 100 // Maximum vertical movement allowed

  // Handle touch start for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    
    const touch = e.touches[0]
    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwipping: true
    }
  }

  // Handle touch move for swipe gestures
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !swipeRef.current.isSwipping) return
    
    const touch = e.touches[0]
    swipeRef.current.currentX = touch.clientX
    swipeRef.current.currentY = touch.clientY
  }

  // Handle touch end for swipe gestures
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || !swipeRef.current.isSwipping) return
    
    const { startX, startY, currentX, currentY } = swipeRef.current
    const deltaX = currentX - startX
    const deltaY = Math.abs(currentY - startY)
    const distance = Math.abs(deltaX)
    
    // Reset swipe state
    swipeRef.current.isSwipping = false
    
    // Check if it's a valid horizontal swipe
    if (
      distance > SWIPE_THRESHOLD &&
      deltaY < MAX_VERTICAL_DEVIATION
    ) {
      // Swipe right to open menu (from left edge)
      if (deltaX > 0 && startX < 50 && !mobileMenuOpen) {
        setMobileMenuOpen(true)
      }
      // Swipe left to close menu
      else if (deltaX < 0 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
  }

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [isMobile, mobileMenuOpen])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav 
      className={cn(
        'bg-white border-b border-gray-200 sticky top-0 z-40',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand/Logo */}
          <Link 
            href={brandHref} 
            className={cn(
              'text-xl font-bold text-primary',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1'
            )}
          >
            {logo || brandName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            {/* Theme Switcher for Desktop */}
            <ThemeSwitcher variant="dropdown" showLabel={false} />
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation
            isOpen={mobileMenuOpen}
            onToggle={toggleMobileMenu}
            menuItems={menuItems}
          />
        </div>
      </div>

      {/* Swipe indicator for mobile (subtle visual cue) */}
      {isMobile && !mobileMenuOpen && (
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary/20 rounded-r-full md:hidden"
          aria-hidden="true"
        />
      )}
    </nav>
  )
}