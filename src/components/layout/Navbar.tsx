'use client'

import { routes } from '@/constants/routes'
import { siteConfig } from '@/constants/site'
import ResponsiveNavigation from './ResponsiveNavigation'
import { NavigationItem } from './MobileNavigation'

export default function Navbar() {
  const navItems: NavigationItem[] = [
    { label: 'Home', href: routes.home },
    { label: 'About', href: routes.about },
    { label: 'Projects', href: routes.projects },
    { label: 'Skills', href: routes.skills },
    { label: 'Experience', href: routes.experience },
    { label: 'Contact', href: routes.contact },
    { label: 'Themes', href: routes.themes },
  ]

  return (
    <ResponsiveNavigation
      menuItems={navItems}
      brandName={siteConfig.name}
      brandHref={routes.home}
    />
  )
}

