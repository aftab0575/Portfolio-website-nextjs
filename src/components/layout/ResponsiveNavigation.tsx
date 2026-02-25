'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn, smoothScrollToElement } from '@/lib/utils'
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
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState<string>('')
  const [hasMounted, setHasMounted] = useState(false)
  const swipeRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwipping: false
  })

  // Track when component has mounted so we don't render
  // client-only UI (like the swipe indicator) during SSR hydration.
  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const syncIsMobile = () => setIsMobile(mediaQuery.matches)
    syncIsMobile()
    mediaQuery.addEventListener('change', syncIsMobile)
    return () => mediaQuery.removeEventListener('change', syncIsMobile)
  }, [])

  // Swipe gesture configuration
  const SWIPE_THRESHOLD = 50 // Minimum distance for swipe
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

  // Track hash for single-page section navigation
  useEffect(() => {
    const updateHash = () => {
      if (typeof window === 'undefined') return
      setActiveHash(window.location.hash || '')
    }

    updateHash()
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== '/' || !href.includes('#')) return
    const hash = href.split('#')[1]
    if (!hash) return
    const el = document.getElementById(hash)
    if (!el) return
    e.preventDefault()
    smoothScrollToElement(el)
    window.history.pushState(null, '', `/#${hash}`)
    setActiveHash(`#${hash}`)
  }

  return (
    <div className="sticky top-0 z-40 pt-4 px-4 md:px-6">
      <nav 
        className={cn(
          'max-w-6xl mx-auto rounded-2xl',
          'bg-background md:bg-background/40 border border-border/50',
          'md:backdrop-blur-xl md:supports-[backdrop-filter]:bg-background/30',
          'shadow-lg shadow-foreground/5',
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-between items-center h-14 md:h-16 px-4 md:px-6 text-foreground">
          {/* Brand/Logo */}
          <Link 
            href={brandHref} 
            onClick={(e) => {
              if (pathname === '/' && brandHref?.includes('#hero')) {
                const el = document.getElementById('hero')
                if (el) {
                  e.preventDefault()
                  smoothScrollToElement(el)
                  window.history.pushState(null, '', '/#hero')
                  setActiveHash('#hero')
                }
              }
            }}
            className={cn(
              'text-xl font-bold text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-md px-2 py-1'
            )}
          >
            {logo || brandName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {menuItems.map((item) => {
              const normalizedHash = activeHash || '#hero'
              const itemHash = item.href.includes('#') ? `#${item.href.split('#')[1]}` : ''
              const isHashLink = itemHash.startsWith('#')
              const isActive = isHashLink
                ? pathname === '/' && normalizedHash === itemHash
                : pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleHashClick(e, item.href)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl',
                    'transition-colors duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive
                      ? 'text-foreground font-semibold border-0 border-b-2 border-primary rounded-xl'
                      : 'text-foreground/90 hover:text-accent hover:bg-foreground/5 rounded-xl'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              )
            })}
            
            {/* Theme Switcher for Desktop */}
            <div className="ml-2 pl-2 border-l border-border/50">
              <ThemeSwitcher variant="dropdown" showLabel={false} />
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation
            isOpen={mobileMenuOpen}
            onToggle={toggleMobileMenu}
            menuItems={menuItems}
          />
        </div>
      </nav>

      {/* Swipe indicator for mobile (subtle visual cue) */}
      {hasMounted && isMobile && !mobileMenuOpen && (
        <div 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary/20 rounded-r-full md:hidden pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  )
}