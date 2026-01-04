/**
 * Responsive Testing Utilities
 * 
 * Utilities for testing responsive behavior, viewport simulation,
 * and responsive component validation.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { 
  BREAKPOINTS, 
  VIEWPORT_SIZES, 
  TOUCH_TARGET,
  type BreakpointName 
} from '@/constants/responsive'
import { getTestViewportSizes, simulateViewport } from './viewport'

export interface ResponsiveTestCase {
  name: string
  width: number
  height: number
  breakpoint: BreakpointName
  orientation: 'portrait' | 'landscape'
  deviceType: 'mobile' | 'tablet' | 'desktop'
}

export interface TouchTargetTestResult {
  element: string
  width: number
  height: number
  isCompliant: boolean
  issues: string[]
}

export interface ResponsiveTestResult {
  testCase: ResponsiveTestCase
  passed: boolean
  issues: string[]
  touchTargets?: TouchTargetTestResult[]
  layoutShifts?: number
  performanceMetrics?: {
    renderTime: number
    layoutTime: number
  }
}

/**
 * Generate comprehensive test cases for responsive testing
 */
export function generateResponsiveTestCases(): ResponsiveTestCase[] {
  const testCases: ResponsiveTestCase[] = []
  
  // Add predefined viewport sizes
  const viewportSizes = getTestViewportSizes()
  
  viewportSizes.forEach(size => {
    const orientation = size.height > size.width ? 'portrait' : 'landscape'
    let deviceType: 'mobile' | 'tablet' | 'desktop'
    
    if (size.breakpoint === 'mobile') deviceType = 'mobile'
    else if (size.breakpoint === 'tablet') deviceType = 'tablet'
    else deviceType = 'desktop'
    
    testCases.push({
      name: size.name,
      width: size.width,
      height: size.height,
      breakpoint: size.breakpoint,
      orientation,
      deviceType
    })
    
    // Add rotated version for mobile and tablet
    if (deviceType !== 'desktop') {
      testCases.push({
        name: `${size.name} (rotated)`,
        width: size.height,
        height: size.width,
        breakpoint: size.breakpoint,
        orientation: orientation === 'portrait' ? 'landscape' : 'portrait',
        deviceType
      })
    }
  })
  
  // Add edge cases around breakpoints
  const edgeCases = [
    { width: BREAKPOINTS.tablet - 1, height: 600, name: 'Mobile edge (767px)' },
    { width: BREAKPOINTS.tablet, height: 600, name: 'Tablet start (768px)' },
    { width: BREAKPOINTS.desktop - 1, height: 600, name: 'Tablet edge (1023px)' },
    { width: BREAKPOINTS.desktop, height: 600, name: 'Desktop start (1024px)' },
    { width: BREAKPOINTS.wide - 1, height: 600, name: 'Desktop edge (1279px)' },
    { width: BREAKPOINTS.wide, height: 600, name: 'Wide start (1280px)' }
  ]
  
  edgeCases.forEach(edgeCase => {
    testCases.push({
      name: edgeCase.name,
      width: edgeCase.width,
      height: edgeCase.height,
      breakpoint: getBreakpointFromWidth(edgeCase.width),
      orientation: 'landscape',
      deviceType: edgeCase.width < BREAKPOINTS.tablet ? 'mobile' : 
                  edgeCase.width < BREAKPOINTS.desktop ? 'tablet' : 'desktop'
    })
  })
  
  return testCases
}

/**
 * Test touch target compliance for elements
 */
export function testTouchTargets(container: HTMLElement): TouchTargetTestResult[] {
  const results: TouchTargetTestResult[] = []
  
  // Find all interactive elements
  const interactiveSelectors = [
    'button',
    'a[href]',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[tabindex]:not([tabindex="-1"])',
    '[onclick]'
  ]
  
  const interactiveElements = container.querySelectorAll(interactiveSelectors.join(', '))
  
  interactiveElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const isCompliant = width >= TOUCH_TARGET.minSize && height >= TOUCH_TARGET.minSize
    
    const issues: string[] = []
    if (width < TOUCH_TARGET.minSize) {
      issues.push(`Width ${Math.round(width)}px is below minimum ${TOUCH_TARGET.minSize}px`)
    }
    if (height < TOUCH_TARGET.minSize) {
      issues.push(`Height ${Math.round(height)}px is below minimum ${TOUCH_TARGET.minSize}px`)
    }
    
    // Check spacing between adjacent touch targets
    const siblings = Array.from(interactiveElements).filter(el => el !== element)
    siblings.forEach(sibling => {
      const siblingRect = sibling.getBoundingClientRect()
      const distance = Math.min(
        Math.abs(rect.left - siblingRect.right),
        Math.abs(rect.right - siblingRect.left),
        Math.abs(rect.top - siblingRect.bottom),
        Math.abs(rect.bottom - siblingRect.top)
      )
      
      if (distance < TOUCH_TARGET.minSpacing) {
        issues.push(`Too close to adjacent touch target (${Math.round(distance)}px < ${TOUCH_TARGET.minSpacing}px)`)
      }
    })
    
    results.push({
      element: element.tagName.toLowerCase() + (element.id ? `#${element.id}` : '') + 
               (element.className ? `.${Array.from(element.classList).join('.')}` : ''),
      width: Math.round(width),
      height: Math.round(height),
      isCompliant: isCompliant && issues.length === 0,
      issues
    })
  })
  
  return results
}

/**
 * Measure layout stability during viewport changes
 */
export function measureLayoutStability(
  container: HTMLElement,
  testCase: ResponsiveTestCase
): Promise<{ layoutShifts: number; renderTime: number }> {
  return new Promise((resolve) => {
    let layoutShifts = 0
    const startTime = performance.now()
    
    // Set up layout shift observer
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          layoutShifts += (entry as any).value
        }
      }
    })
    
    try {
      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // Layout shift API not supported
    }
    
    // Simulate viewport change
    simulateViewport(testCase.width, testCase.height)
    
    // Wait for layout to settle
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderTime = performance.now() - startTime
        observer.disconnect()
        resolve({ layoutShifts, renderTime })
      })
    })
  })
}

/**
 * Run comprehensive responsive test on a component
 */
export async function runResponsiveTest(
  container: HTMLElement,
  testCase: ResponsiveTestCase,
  options: {
    testTouchTargets?: boolean
    measurePerformance?: boolean
    customValidations?: Array<(container: HTMLElement, testCase: ResponsiveTestCase) => string[]>
  } = {}
): Promise<ResponsiveTestResult> {
  const { testTouchTargets: shouldTestTouchTargets = true, measurePerformance = true, customValidations = [] } = options
  
  const issues: string[] = []
  let touchTargets: TouchTargetTestResult[] | undefined
  let layoutShifts: number | undefined
  let performanceMetrics: { renderTime: number; layoutTime: number } | undefined
  
  try {
    // Simulate the viewport
    simulateViewport(testCase.width, testCase.height)
    
    // Wait for layout to settle
    await new Promise(resolve => requestAnimationFrame(resolve))
    
    // Test touch targets if requested
    if (shouldTestTouchTargets && (testCase.deviceType === 'mobile' || testCase.deviceType === 'tablet')) {
      touchTargets = testTouchTargets(container)
      const failedTargets = touchTargets.filter(target => !target.isCompliant)
      if (failedTargets.length > 0) {
        issues.push(`${failedTargets.length} touch targets are not compliant`)
      }
    }
    
    // Measure performance if requested
    if (measurePerformance) {
      const stability = await measureLayoutStability(container, testCase)
      layoutShifts = stability.layoutShifts
      performanceMetrics = {
        renderTime: stability.renderTime,
        layoutTime: 0 // Would need more sophisticated measurement
      }
      
      if (layoutShifts > 0.1) {
        issues.push(`High layout shift detected: ${layoutShifts.toFixed(3)}`)
      }
    }
    
    // Run custom validations
    customValidations.forEach(validation => {
      const validationIssues = validation(container, testCase)
      issues.push(...validationIssues)
    })
    
    // Basic responsive checks
    const computedStyle = window.getComputedStyle(container)
    const containerWidth = container.getBoundingClientRect().width
    
    // Check if container adapts to viewport
    if (containerWidth > testCase.width) {
      issues.push(`Container width (${Math.round(containerWidth)}px) exceeds viewport width (${testCase.width}px)`)
    }
    
    // Check for horizontal scrolling
    if (container.scrollWidth > container.clientWidth) {
      issues.push('Horizontal scrolling detected')
    }
    
  } catch (error) {
    issues.push(`Test execution error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  return {
    testCase,
    passed: issues.length === 0,
    issues,
    touchTargets,
    layoutShifts,
    performanceMetrics
  }
}

/**
 * Run responsive tests across multiple test cases
 */
export async function runResponsiveTestSuite(
  container: HTMLElement,
  testCases: ResponsiveTestCase[] = generateResponsiveTestCases(),
  options?: Parameters<typeof runResponsiveTest>[2]
): Promise<ResponsiveTestResult[]> {
  const results: ResponsiveTestResult[] = []
  
  for (const testCase of testCases) {
    const result = await runResponsiveTest(container, testCase, options)
    results.push(result)
    
    // Small delay between tests to allow cleanup
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  
  return results
}

/**
 * Generate a test report from responsive test results
 */
export function generateTestReport(results: ResponsiveTestResult[]): {
  summary: {
    total: number
    passed: number
    failed: number
    passRate: number
  }
  failedTests: ResponsiveTestResult[]
  commonIssues: Array<{ issue: string; count: number }>
  recommendations: string[]
} {
  const total = results.length
  const passed = results.filter(r => r.passed).length
  const failed = total - passed
  const passRate = total > 0 ? (passed / total) * 100 : 0
  
  const failedTests = results.filter(r => !r.passed)
  
  // Analyze common issues
  const issueMap = new Map<string, number>()
  results.forEach(result => {
    result.issues.forEach(issue => {
      issueMap.set(issue, (issueMap.get(issue) || 0) + 1)
    })
  })
  
  const commonIssues = Array.from(issueMap.entries())
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count)
  
  // Generate recommendations
  const recommendations: string[] = []
  
  if (commonIssues.some(issue => issue.issue.includes('touch target'))) {
    recommendations.push('Increase touch target sizes to meet accessibility guidelines (minimum 44px)')
  }
  
  if (commonIssues.some(issue => issue.issue.includes('layout shift'))) {
    recommendations.push('Implement skeleton loading states to prevent layout shifts')
  }
  
  if (commonIssues.some(issue => issue.issue.includes('horizontal scrolling'))) {
    recommendations.push('Review responsive breakpoints and container max-widths')
  }
  
  if (passRate < 80) {
    recommendations.push('Consider implementing a mobile-first responsive design approach')
  }
  
  return {
    summary: { total, passed, failed, passRate },
    failedTests,
    commonIssues,
    recommendations
  }
}

function getBreakpointFromWidth(width: number): BreakpointName {
  if (width >= BREAKPOINTS.ultrawide) return 'ultrawide'
  if (width >= BREAKPOINTS.wide) return 'wide'
  if (width >= BREAKPOINTS.desktop) return 'desktop'
  if (width >= BREAKPOINTS.tablet) return 'tablet'
  return 'mobile'
}