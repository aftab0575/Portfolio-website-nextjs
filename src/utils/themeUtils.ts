/**
 * Utility functions for theme color conversions
 */

/**
 * Convert hex color to HSL format for CSS variables
 * @param hex - Hex color string (e.g., "#0D1B2A")
 * @returns HSL string in format "210 100% 12%"
 */
export function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace('#', '')
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  // Convert to degrees and percentages
  const hDeg = Math.round(h * 360)
  const sPercent = Math.round(s * 100)
  const lPercent = Math.round(l * 100)

  return `${hDeg} ${sPercent}% ${lPercent}%`
}

/**
 * Determine if a color is light or dark based on luminance
 * @param hex - Hex color string (e.g., "#0D1B2A")
 * @returns true if the color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance using standard formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

/**
 * Get appropriate foreground color for a given background color
 * @param backgroundColor - Hex color string for background
 * @returns HSL string for appropriate foreground color
 */
export function getForegroundColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '0 0% 9%' : '0 0% 98%'
}

/**
 * Get muted colors based on background color
 * @param backgroundColor - Hex color string for background
 * @returns Object with muted and muted-foreground HSL strings
 */
export function getMutedColors(backgroundColor: string): {
  muted: string
  mutedForeground: string
} {
  const isLight = isLightColor(backgroundColor)
  return {
    muted: isLight ? '0 0% 96.1%' : '0 0% 14.9%',
    mutedForeground: isLight ? '0 0% 45.1%' : '0 0% 63.9%'
  }
}

/**
 * Apply theme colors to CSS variables
 * @param theme - Theme object with variables
 */
export function applyThemeColors(theme: {
  variables: {
    primary: string
    secondary: string
    background: string
    foreground: string
    accent: string
    border: string
  }
}): void {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  
  // Convert theme colors to HSL format for shadcn/ui compatibility
  const primaryHsl = hexToHsl(theme.variables.primary)
  const secondaryHsl = hexToHsl(theme.variables.secondary)
  const backgroundHsl = hexToHsl(theme.variables.background)
  const foregroundHsl = hexToHsl(theme.variables.foreground)
  const accentHsl = hexToHsl(theme.variables.accent)
  const borderHsl = hexToHsl(theme.variables.border)
  
  // Determine appropriate foreground colors
  const primaryForegroundHsl = getForegroundColor(theme.variables.primary)
  const secondaryForegroundHsl = getForegroundColor(theme.variables.secondary)
  const accentForegroundHsl = getForegroundColor(theme.variables.accent)
  
  // Get muted colors
  const { muted: mutedHsl, mutedForeground: mutedForegroundHsl } = getMutedColors(theme.variables.background)
  
  // Set shadcn/ui compatible CSS variables
  root.style.setProperty('--primary', primaryHsl)
  root.style.setProperty('--primary-foreground', primaryForegroundHsl)
  root.style.setProperty('--secondary', secondaryHsl)
  root.style.setProperty('--secondary-foreground', secondaryForegroundHsl)
  root.style.setProperty('--background', backgroundHsl)
  root.style.setProperty('--foreground', foregroundHsl)
  root.style.setProperty('--accent', accentHsl)
  root.style.setProperty('--accent-foreground', accentForegroundHsl)
  root.style.setProperty('--border', borderHsl)
  root.style.setProperty('--input', borderHsl)
  
  // Set card colors based on background
  root.style.setProperty('--card', backgroundHsl)
  root.style.setProperty('--card-foreground', foregroundHsl)
  
  // Set popover colors
  root.style.setProperty('--popover', backgroundHsl)
  root.style.setProperty('--popover-foreground', foregroundHsl)
  
  // Set muted colors
  root.style.setProperty('--muted', mutedHsl)
  root.style.setProperty('--muted-foreground', mutedForegroundHsl)
  
  // Keep legacy variables for backward compatibility
  root.style.setProperty('--color-primary', theme.variables.primary)
  root.style.setProperty('--color-secondary', theme.variables.secondary)
  root.style.setProperty('--color-bg', theme.variables.background)
  root.style.setProperty('--color-text', theme.variables.foreground)
  root.style.setProperty('--color-accent', theme.variables.accent)
  root.style.setProperty('--color-border', theme.variables.border)
}