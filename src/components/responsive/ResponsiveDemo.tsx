/**
 * Responsive Demo Component
 * 
 * A demonstration component that showcases the responsive utilities
 * and hooks in action. Useful for testing and validation.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

'use client'

import React from 'react'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { 
  getResponsiveClasses, 
  getResponsiveGridClasses,
  getResponsiveTextClasses,
  getResponsiveSpacingClasses 
} from '@/utils/responsive'

export function ResponsiveDemo(): JSX.Element {
  const {
    currentBreakpoint,
    viewport,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isTouchDevice,
    isRetina
  } = useBreakpoint()

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Responsive Utilities Demo</h2>
        
        {/* Viewport Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Current Breakpoint</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentBreakpoint}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">Viewport Size</h3>
            <p className="text-lg font-mono text-green-600 dark:text-green-400">
              {viewport.width} × {viewport.height}
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">Device Type</h3>
            <p className="text-lg text-purple-600 dark:text-purple-400">
              {isMobile && 'Mobile'}
              {isTablet && 'Tablet'}
              {isDesktop && 'Desktop'}
            </p>
          </div>
        </div>

        {/* Device Capabilities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-3 rounded-lg text-center ${isPortrait ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            <div className="text-sm font-medium">Portrait</div>
            <div className="text-xs">{isPortrait ? '✓' : '✗'}</div>
          </div>
          
          <div className={`p-3 rounded-lg text-center ${isLandscape ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            <div className="text-sm font-medium">Landscape</div>
            <div className="text-xs">{isLandscape ? '✓' : '✗'}</div>
          </div>
          
          <div className={`p-3 rounded-lg text-center ${isTouchDevice ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            <div className="text-sm font-medium">Touch</div>
            <div className="text-xs">{isTouchDevice ? '✓' : '✗'}</div>
          </div>
          
          <div className={`p-3 rounded-lg text-center ${isRetina ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            <div className="text-sm font-medium">Retina</div>
            <div className="text-xs">{isRetina ? '✓' : '✗'}</div>
          </div>
        </div>

        {/* Responsive Grid Demo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Responsive Grid</h3>
          <div className={`grid gap-4 ${getResponsiveGridClasses({
            mobile: 1,
            tablet: 2,
            desktop: 3,
            wide: 4
          })}`}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg text-center">
                <div className="font-semibold">Card {i}</div>
                <div className="text-sm opacity-90">
                  {isMobile && 'Mobile: 1 col'}
                  {isTablet && 'Tablet: 2 cols'}
                  {isDesktop && 'Desktop: 3+ cols'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Typography Demo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Responsive Typography</h3>
          <div className="space-y-2">
            <p className={getResponsiveTextClasses({
              mobile: 'sm',
              tablet: 'base',
              desktop: 'lg'
            })}>
              This text scales with viewport size
            </p>
            <p className={getResponsiveTextClasses({
              mobile: 'base',
              tablet: 'lg',
              desktop: 'xl'
            })}>
              This text also scales responsively
            </p>
          </div>
        </div>

        {/* Touch Target Demo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Touch Targets</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg min-w-[44px] min-h-[44px] touch-manipulation">
              Compliant Button
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">
              Small Button
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg min-w-[48px] min-h-[48px] touch-manipulation">
              Large Touch Target
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {isTouchDevice ? 'Touch device detected - buttons should be at least 44px' : 'Mouse device - smaller targets acceptable'}
          </p>
        </div>

        {/* Responsive Spacing Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Responsive Spacing</h3>
          <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg ${getResponsiveSpacingClasses('p', {
            mobile: '4',
            tablet: '6',
            desktop: '8'
          })}`}>
            <p>This container has responsive padding that increases with screen size.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveDemo