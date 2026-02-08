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

/** Parse computed color string (e.g. "rgb(9, 9, 11)") to hex. */
export function computedColorToHex(computedColor: string): string {
  const m = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return '#18181b'
  const r = parseInt(m[1], 10)
  const g = parseInt(m[2], 10)
  const b = parseInt(m[3], 10)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

/** Get theme foreground color as hex from an element that has text-foreground (same theme context). */
export function getThemeForegroundHex(): string {
  if (typeof document === 'undefined') return '#18181b'
  const el = document.createElement('span')
  el.className = 'text-foreground'
  el.style.setProperty('position', 'absolute')
  el.style.setProperty('visibility', 'hidden')
  document.body.appendChild(el)
  const color = getComputedStyle(el).getPropertyValue('color')
  document.body.removeChild(el)
  return computedColorToHex(color)
}
