/**
 * Responsive Utilities Tests
 * 
 * Basic tests for responsive utilities and hooks functionality.
 * These tests validate the core responsive behavior without requiring
 * a full testing framework setup.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { 
  BREAKPOINTS, 
  getBreakpointFromWidth, 
  isTouchTargetCompliant,
  getResponsiveColumns 
} from '@/constants/responsive'

import {
  getViewportInfo,
  getResponsiveValue,
  validateTouchTarget
} from '@/utils/viewport'

import {
  generateResponsiveTestCases,
  testTouchTargets
} from '@/utils/responsiveTesting'

/**
 * Simple test runner for environments without Jest/Vitest
 */
function runTests() {
  const results: Array<{ name: string; passed: boolean; error?: string }> = []
  
  function test(name: string, testFn: () => void | Promise<void>) {
    try {
      const result = testFn()
      if (result instanceof Promise) {
        result
          .then(() => results.push({ name, passed: true }))
          .catch(error => results.push({ name, passed: false, error: error.message }))
      } else {
        results.push({ name, passed: true })
      }
    } catch (error) {
      results.push({ 
        name, 
        passed: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }
  
  function expect(actual: any) {
    return {
      toBe: (expected: any) => {
        if (actual !== expected) {
          throw new Error(`Expected ${expected}, got ${actual}`)
        }
      },
      toEqual: (expected: any) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected truthy value, got ${actual}`)
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected falsy value, got ${actual}`)
        }
      },
      toBeGreaterThan: (expected: number) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`)
        }
      },
      toBeGreaterThanOrEqual: (expected: number) => {
        if (actual < expected) {
          throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`)
        }
      }
    }
  }
  
  // Test breakpoint detection
  test('getBreakpointFromWidth - mobile', () => {
    expect(getBreakpointFromWidth(320)).toBe('mobile')
    expect(getBreakpointFromWidth(767)).toBe('mobile')
  })
  
  test('getBreakpointFromWidth - tablet', () => {
    expect(getBreakpointFromWidth(768)).toBe('tablet')
    expect(getBreakpointFromWidth(1023)).toBe('tablet')
  })
  
  test('getBreakpointFromWidth - desktop', () => {
    expect(getBreakpointFromWidth(1024)).toBe('desktop')
    expect(getBreakpointFromWidth(1279)).toBe('desktop')
  })
  
  test('getBreakpointFromWidth - wide', () => {
    expect(getBreakpointFromWidth(1280)).toBe('wide')
    expect(getBreakpointFromWidth(1535)).toBe('wide')
  })
  
  test('getBreakpointFromWidth - ultrawide', () => {
    expect(getBreakpointFromWidth(1536)).toBe('ultrawide')
    expect(getBreakpointFromWidth(2560)).toBe('ultrawide')
  })
  
  // Test touch target compliance
  test('isTouchTargetCompliant - compliant sizes', () => {
    expect(isTouchTargetCompliant(44, 44)).toBeTruthy()
    expect(isTouchTargetCompliant(48, 48)).toBeTruthy()
    expect(isTouchTargetCompliant(50, 44)).toBeTruthy()
  })
  
  test('isTouchTargetCompliant - non-compliant sizes', () => {
    expect(isTouchTargetCompliant(40, 40)).toBeFalsy()
    expect(isTouchTargetCompliant(44, 40)).toBeFalsy()
    expect(isTouchTargetCompliant(40, 44)).toBeFalsy()
  })
  
  // Test responsive columns
  test('getResponsiveColumns', () => {
    expect(getResponsiveColumns('mobile')).toBe(1)
    expect(getResponsiveColumns('tablet')).toBe(2)
    expect(getResponsiveColumns('desktop')).toBe(3)
    expect(getResponsiveColumns('wide')).toBe(4)
    expect(getResponsiveColumns('ultrawide')).toBe(5)
  })
  
  // Test responsive value selection
  test('getResponsiveValue - exact match', () => {
    const values = { mobile: 'small', tablet: 'medium', desktop: 'large' }
    
    // Mock viewport info for testing
    const originalGetViewportInfo = getViewportInfo
    
    // Test mobile
    ;(global as any).window = {
      innerWidth: 320,
      innerHeight: 568,
      devicePixelRatio: 1
    }
    
    const mobileValue = getResponsiveValue(values)
    expect(mobileValue).toBe('small')
  })
  
  // Test responsive test case generation
  test('generateResponsiveTestCases - generates test cases', () => {
    const testCases = generateResponsiveTestCases()
    expect(testCases.length).toBeGreaterThan(0)
    
    // Check that we have mobile, tablet, and desktop cases
    const mobileCase = testCases.find(tc => tc.breakpoint === 'mobile')
    const tabletCase = testCases.find(tc => tc.breakpoint === 'tablet')
    const desktopCase = testCases.find(tc => tc.breakpoint === 'desktop')
    
    expect(mobileCase).toBeTruthy()
    expect(tabletCase).toBeTruthy()
    expect(desktopCase).toBeTruthy()
  })
  
  // Test touch target validation with mock element
  test('validateTouchTarget - compliant element', () => {
    const mockElement = {
      width: 48,
      height: 48
    }
    
    const result = validateTouchTarget(mockElement)
    expect(result.isCompliant).toBeTruthy()
    expect(result.width).toBe(48)
    expect(result.height).toBe(48)
  })
  
  test('validateTouchTarget - non-compliant element', () => {
    const mockElement = {
      width: 30,
      height: 30
    }
    
    const result = validateTouchTarget(mockElement)
    expect(result.isCompliant).toBeFalsy()
    expect(result.recommendations).toBeTruthy()
    expect(result.recommendations!.length).toBeGreaterThan(0)
  })
  
  // Return results for reporting
  return results
}

/**
 * Run tests and log results
 */
export function runResponsiveTests(): void {
  console.log('🧪 Running Responsive Utilities Tests...')
  
  const results = runTests()
  
  // Wait for async tests to complete
  setTimeout(() => {
    const passed = results.filter(r => r.passed).length
    const failed = results.filter(r => !r.passed).length
    const total = results.length
    
    console.log(`\n📊 Test Results:`)
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📈 Total: ${total}`)
    console.log(`🎯 Pass Rate: ${((passed / total) * 100).toFixed(1)}%`)
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:')
      results.filter(r => !r.passed).forEach(result => {
        console.log(`  - ${result.name}: ${result.error}`)
      })
    }
    
    console.log('\n✨ Responsive utilities tests completed!')
  }, 100)
}

// Export for manual testing
if (typeof window !== 'undefined' && (window as any).runResponsiveTests) {
  (window as any).runResponsiveTests = runResponsiveTests
}