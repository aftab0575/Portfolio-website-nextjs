'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn, smoothScrollToElement } from '@/lib/utils'
import ThemeSwitcher from '../theme/ThemeSwitcher'

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

interface MobileNavigationProps {
  isOpen: boolean
  onToggle: () => void
  menuItems: NavigationItem[]
  className?: string
}

export default function MobileNavigation({
  isOpen,
  onToggle,
  menuItems,
  className
}: MobileNavigationProps) {
  const pathname = usePathname()
  const [activeHash, setActiveHash] = useState<string>('')

  // Close menu when route changes
  useEffect(() => {
    if (isOpen) {
      onToggle()
    }
  }, [pathname])

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== '/' || !href.includes('#')) return
    const hash = href.split('#')[1]
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      e.preventDefault()
      smoothScrollToElement(el)
      window.history.pushState(null, '', `/#${hash}`)
      setActiveHash(`#${hash}`)
      onToggle()
    }
  }

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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Hamburger Menu Button - Touch-friendly 44px minimum */}
      <button
        className={cn(
          'md:hidden flex items-center justify-center',
          'w-11 h-11 rounded-lg', // 44px touch target
          'transition-colors duration-200',
          'hover:bg-foreground/10 active:bg-foreground/20',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          className
        )}
        onClick={onToggle}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 md:hidden backdrop-blur-sm"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw]',
          'bg-background/90 backdrop-blur-xl border-l border-border shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          'md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
          <button
            className={cn(
              'flex items-center justify-center',
              'w-11 h-11 rounded-lg', // 44px touch target
              'transition-colors duration-200',
              'hover:bg-foreground/10 active:bg-foreground/20',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
            onClick={onToggle}
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6 text-foreground" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const normalizedHash = activeHash || '#hero'
              const itemHash = item.href.includes('#') ? `#${item.href.split('#')[1]}` : ''
              const isHashLink = itemHash.startsWith('#')
              const isActive = isHashLink
                ? pathname === '/' && normalizedHash === itemHash
                : pathname === item.href
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleHashClick(e, item.href)}
                    className={cn(
                      'flex items-center px-4 py-4', // 44px+ touch target height
                      'text-base font-medium rounded-lg',
                      'transition-colors duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      isActive
                        ? 'text-foreground font-semibold border-0 border-b-2 border-primary'
                        : 'text-foreground hover:bg-foreground/10 active:bg-foreground/20'
                    )}
                  >
                    {Icon && (
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
          
          {/* Theme Switcher for Mobile */}
          <div className="mt-6 pt-6 border-t border-border">
            <ThemeSwitcher variant="grid" showLabel={true} />
          </div>
        </nav>
      </div>
    </>
  )
}