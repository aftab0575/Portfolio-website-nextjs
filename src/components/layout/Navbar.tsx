'use client'

import Image from 'next/image'
import { routes } from '@/constants/routes'
import { siteConfig } from '@/constants/site'
import ResponsiveNavigation from './ResponsiveNavigation'
import { NavigationItem } from './MobileNavigation'

export default function Navbar() {
  const navItems: NavigationItem[] = [
    { label: 'Home', href: routes.sections.hero },
    { label: 'About', href: routes.sections.about },
    { label: 'Projects', href: routes.sections.projects },
    { label: 'Skills', href: routes.sections.skills },
    { label: 'Experience', href: routes.sections.experience },
    { label: 'Contact', href: routes.sections.contact },
    // { label: 'Themes', href: routes.themes },
  ]

  return (
    <ResponsiveNavigation
      menuItems={navItems}
      brandName={siteConfig.name}
      brandHref={routes.sections.hero}
      logo={
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={96}
          height={96}
          className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20"
          priority
        />
      }
    />
  )
}

