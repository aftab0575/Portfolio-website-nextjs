# Theme System

This directory contains the theme system components that allow users to switch between different visual themes created by administrators.

## Components

### ThemeProvider
- Manages theme state and applies CSS variables
- Automatically converts hex colors to HSL format for shadcn/ui compatibility
- Handles both server-side and client-side theme application

### ThemeSwitcher
- User interface for selecting and activating themes
- Available in two variants: `dropdown` and `grid`
- Supports both desktop and mobile layouts
- Includes loading states and error handling
- Optional toast notifications for user feedback

## Usage

### Basic Theme Switcher (Dropdown)
```tsx
import { ThemeSwitcher } from '@/components/theme'

<ThemeSwitcher variant="dropdown" showLabel={true} />
```

### Grid Layout Theme Switcher
```tsx
import { ThemeSwitcher } from '@/components/theme'

<ThemeSwitcher variant="grid" showLabel={false} />
```

### With Custom Callback
```tsx
import { ThemeSwitcher } from '@/components/theme'

<ThemeSwitcher 
  variant="dropdown"
  onThemeChange={(theme) => console.log('Theme changed to:', theme.name)}
  showToast={true}
/>
```

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/themes` - Fetch all available themes
- `GET /api/themes/active` - Get currently active theme
- `PUT /api/themes/[id]/activate-public` - Activate a theme (public users)

### Admin Endpoints (Authentication Required)
- `POST /api/themes` - Create new theme
- `PUT /api/themes/[id]` - Update theme
- `PUT /api/themes/[id]/activate` - Activate theme (admin only)
- `DELETE /api/themes/[id]` - Delete theme

## Theme Structure

```typescript
interface Theme {
  _id: string
  name: string
  isActive: boolean
  variables: {
    primary: string    // Hex color (e.g., "#0D1B2A")
    secondary: string  // Hex color
    background: string // Hex color
    foreground: string // Hex color
    accent: string     // Hex color
    border: string     // Hex color
  }
}
```

## Color Conversion

The system automatically converts hex colors to HSL format for CSS variables:
- `#0D1B2A` → `210 100% 12%`
- Calculates appropriate foreground colors based on background lightness
- Generates muted color variants automatically

## Integration

The theme switcher is integrated into:
- **Navbar** - Dropdown variant for desktop, hidden on mobile
- **Mobile Navigation** - Grid variant in mobile menu
- **Dedicated Themes Page** - Full grid layout at `/themes`

## Toast Notifications

Optional toast notifications provide user feedback:
- Success: "Theme Changed" with theme name
- Error: "Theme Change Failed" with retry suggestion
- Auto-dismiss after 3-5 seconds
- Gracefully degrades if toast system is not available