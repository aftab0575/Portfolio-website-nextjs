/**
 * Responsive Components Index
 * 
 * Central export point for all responsive layout components.
 * Provides clean imports for responsive functionality.
 */

// Layout components
export { 
  ResponsiveContainer,
  type ResponsiveContainerProps 
} from './ResponsiveContainer'

export { 
  ResponsiveGrid,
  ResponsiveGridItem,
  CardGrid,
  FeatureGrid,
  GalleryGrid,
  GRID_PRESETS,
  type ResponsiveGridProps,
  type ResponsiveGridItemProps 
} from './ResponsiveGrid'

// Demo component
export { ResponsiveDemo } from './ResponsiveDemo'

// Re-export responsive utilities for convenience
export {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTouchDevice,
  getResponsiveClasses,
  getResponsiveGridClasses,
  getResponsiveTextClasses,
  getResponsiveSpacingClasses
} from '@/utils/responsive'