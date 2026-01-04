/**
 * Responsive Layout Usage Examples
 * 
 * Demonstrates how to use the new ResponsiveContainer and ResponsiveGrid
 * components for building mobile-first responsive layouts.
 */

'use client'

import React from 'react'
import { 
  ResponsiveContainer, 
  ResponsiveGrid, 
  ResponsiveGridItem,
  CardGrid,
  FeatureGrid,
  GalleryGrid 
} from '@/components/responsive'

export function ResponsiveLayoutUsage(): JSX.Element {
  return (
    <div className="space-y-12 py-8">
      {/* ResponsiveContainer Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6">ResponsiveContainer Examples</h2>
        
        {/* Default container */}
        <ResponsiveContainer className="bg-blue-50 dark:bg-blue-900/20 mb-4">
          <h3 className="text-lg font-semibold mb-2">Default Container</h3>
          <p>This container has default max-width (xl) and medium padding that adapts to screen size.</p>
        </ResponsiveContainer>

        {/* Large container with extra padding */}
        <ResponsiveContainer 
          maxWidth="2xl" 
          padding="lg"
          className="bg-green-50 dark:bg-green-900/20 mb-4"
        >
          <h3 className="text-lg font-semibold mb-2">Large Container</h3>
          <p>This container has 2xl max-width and large responsive padding.</p>
        </ResponsiveContainer>

        {/* Small container with minimal padding */}
        <ResponsiveContainer 
          maxWidth="md" 
          padding="sm"
          className="bg-purple-50 dark:bg-purple-900/20"
        >
          <h3 className="text-lg font-semibold mb-2">Compact Container</h3>
          <p>This container has medium max-width and small padding for compact layouts.</p>
        </ResponsiveContainer>
      </section>

      {/* ResponsiveGrid Examples */}
      <section>
        <ResponsiveContainer>
          <h2 className="text-2xl font-bold mb-6">ResponsiveGrid Examples</h2>
          
          {/* Custom grid configuration */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Custom Grid Configuration</h3>
            <ResponsiveGrid
              columns={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
                wide: 4
              }}
              gap="lg"
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div 
                  key={i}
                  className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg text-center"
                >
                  <h4 className="font-semibold text-lg">Item {i}</h4>
                  <p className="text-sm opacity-90 mt-2">
                    Responsive grid item that adapts to screen size
                  </p>
                </div>
              ))}
            </ResponsiveGrid>
          </div>

          {/* Grid with spanning items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Grid with Spanning Items</h3>
            <ResponsiveGrid
              columns={{
                mobile: 2,
                tablet: 4,
                desktop: 6
              }}
              gap="md"
            >
              <ResponsiveGridItem 
                span={{
                  mobile: 2,
                  tablet: 2,
                  desktop: 3
                }}
                className="bg-red-500 text-white p-4 rounded-lg text-center"
              >
                <h4 className="font-semibold">Spanning Item</h4>
                <p className="text-sm mt-1">Spans multiple columns</p>
              </ResponsiveGridItem>
              
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg text-center"
                >
                  <span className="font-medium">Item {i}</span>
                </div>
              ))}
            </ResponsiveGrid>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Preset Grid Examples */}
      <section>
        <ResponsiveContainer>
          <h2 className="text-2xl font-bold mb-6">Preset Grid Examples</h2>
          
          {/* Card Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Card Grid (1→2→3→4 columns)</h3>
            <CardGrid>
              {[
                { title: 'Project Alpha', desc: 'A modern web application' },
                { title: 'Project Beta', desc: 'Mobile-first design system' },
                { title: 'Project Gamma', desc: 'E-commerce platform' },
                { title: 'Project Delta', desc: 'Data visualization tool' }
              ].map((project, i) => (
                <div 
                  key={i}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-lg mb-2">{project.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{project.desc}</p>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Learn More
                  </button>
                </div>
              ))}
            </CardGrid>
          </div>

          {/* Feature Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Feature Grid (1→2→3 columns)</h3>
            <FeatureGrid>
              {[
                { icon: '🚀', title: 'Fast Performance', desc: 'Optimized for speed' },
                { icon: '📱', title: 'Mobile First', desc: 'Responsive design' },
                { icon: '🔒', title: 'Secure', desc: 'Built with security in mind' }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </FeatureGrid>
          </div>

          {/* Gallery Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Gallery Grid (2→3→4→5→6 columns)</h3>
            <GalleryGrid gap="sm">
              {Array.from({ length: 12 }, (_, i) => (
                <div 
                  key={i}
                  className="aspect-square bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold"
                >
                  {i + 1}
                </div>
              ))}
            </GalleryGrid>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Nested Layout Example */}
      <section>
        <ResponsiveContainer maxWidth="2xl" padding="lg">
          <h2 className="text-2xl font-bold mb-6">Nested Layout Example</h2>
          
          <ResponsiveGrid
            columns={{
              mobile: 1,
              desktop: 3
            }}
            gap="xl"
          >
            {/* Main content area */}
            <ResponsiveGridItem 
              span={{
                desktop: 2
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Main Content</h3>
                
                {/* Nested grid inside main content */}
                <ResponsiveGrid
                  columns={{
                    mobile: 1,
                    tablet: 2
                  }}
                  gap="md"
                >
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Article 1</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Article 2</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sed do eiusmod tempor incididunt ut labore et dolore magna.
                    </p>
                  </div>
                </ResponsiveGrid>
              </div>
            </ResponsiveGridItem>

            {/* Sidebar */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sidebar</h3>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="font-medium text-sm">Widget 1</h4>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="font-medium text-sm">Widget 2</h4>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-md">
                  <h4 className="font-medium text-sm">Widget 3</h4>
                </div>
              </div>
            </div>
          </ResponsiveGrid>
        </ResponsiveContainer>
      </section>
    </div>
  )
}

export default ResponsiveLayoutUsage