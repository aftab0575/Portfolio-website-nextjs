import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Smoothly scroll element into view. Uses manual RAF animation so it works even when prefers-reduced-motion overrides scrollIntoView. */
export function smoothScrollToElement(el: HTMLElement, duration = 400): void {
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  const start = window.scrollY ?? document.documentElement.scrollTop
  const rect = el.getBoundingClientRect()
  const target = rect.top + start
  const distance = target - start
  const startTime = performance.now()
  function step(now: number) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 // ease-in-out
    window.scrollTo(0, start + distance * eased)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
