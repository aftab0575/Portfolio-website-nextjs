'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { smoothScrollToElement } from '@/lib/utils'

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (!el) return false

  requestAnimationFrame(() => {
    smoothScrollToElement(el)
  })

  return true
}

export default function HashScrollHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== '/') return
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    const sectionFromQuery = searchParams.get('section')

    const sectionId = hash ? hash.slice(1) : sectionFromQuery || ''
    if (!sectionId) return

    const scrolled = scrollToSection(sectionId)

    // If we came in via ?section=..., normalize URL to /#section.
    if (!hash && sectionFromQuery && scrolled) {
      router.replace(`/#${sectionId}`)
    }
  }, [pathname, searchParams, router])

  return null
}

