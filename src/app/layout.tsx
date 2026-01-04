import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import StoreProvider from '@/lib/StoreProvider'
import ThemeProvider from '@/components/theme/ThemeProvider'
import { ToastProvider } from '@/hooks/useToast'
import { loadActiveTheme } from '@/lib/ThemeLoader'
import { defaultMetadata } from '@/constants/seo'
import { hexToHsl, getForegroundColor, getMutedColors } from '@/utils/themeUtils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = await loadActiveTheme()

  let themeStyles = ''
  if (theme) {
    const primaryHsl = hexToHsl(theme.variables.primary)
    const secondaryHsl = hexToHsl(theme.variables.secondary)
    const backgroundHsl = hexToHsl(theme.variables.background)
    const foregroundHsl = hexToHsl(theme.variables.foreground)
    const accentHsl = hexToHsl(theme.variables.accent)
    const borderHsl = hexToHsl(theme.variables.border)
    
    const primaryForegroundHsl = getForegroundColor(theme.variables.primary)
    const secondaryForegroundHsl = getForegroundColor(theme.variables.secondary)
    const accentForegroundHsl = getForegroundColor(theme.variables.accent)
    
    const { muted: mutedHsl, mutedForeground: mutedForegroundHsl } = getMutedColors(theme.variables.background)

    themeStyles = `
      :root {
        --primary: ${primaryHsl};
        --primary-foreground: ${primaryForegroundHsl};
        --secondary: ${secondaryHsl};
        --secondary-foreground: ${secondaryForegroundHsl};
        --background: ${backgroundHsl};
        --foreground: ${foregroundHsl};
        --accent: ${accentHsl};
        --accent-foreground: ${accentForegroundHsl};
        --border: ${borderHsl};
        --input: ${borderHsl};
        --card: ${backgroundHsl};
        --card-foreground: ${foregroundHsl};
        --popover: ${backgroundHsl};
        --popover-foreground: ${foregroundHsl};
        --muted: ${mutedHsl};
        --muted-foreground: ${mutedForegroundHsl};
        --color-primary: ${theme.variables.primary};
        --color-secondary: ${theme.variables.secondary};
        --color-bg: ${theme.variables.background};
        --color-text: ${theme.variables.foreground};
        --color-accent: ${theme.variables.accent};
        --color-border: ${theme.variables.border};
      }
    `
  }

  return (
    <html lang="en">
      <head>
        {themeStyles && (
          <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        )}
      </head>
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

