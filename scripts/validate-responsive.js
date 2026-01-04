/**
 * Responsive Utilities Validation Script
 * 
 * Simple Node.js script to validate that responsive utilities
 * are properly set up and working correctly.
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Validating Responsive Utilities Setup...\n')

// Check if all required files exist
const requiredFiles = [
  'src/constants/responsive.ts',
  'src/hooks/useBreakpoint.ts',
  'src/utils/viewport.ts',
  'src/utils/responsiveTesting.ts',
  'src/utils/responsive.ts',
  'src/components/responsive/ResponsiveDemo.tsx'
]

let allFilesExist = true

console.log('📁 Checking required files:')
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file)
  console.log(`   ${exists ? '✅' : '❌'} ${file}`)
  if (!exists) allFilesExist = false
})

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing!')
  process.exit(1)
}

// Check file contents for key exports
console.log('\n🔧 Checking exports:')

const checks = [
  {
    file: 'src/constants/responsive.ts',
    exports: ['BREAKPOINTS', 'TOUCH_TARGET', 'getBreakpointFromWidth']
  },
  {
    file: 'src/hooks/useBreakpoint.ts',
    exports: ['useBreakpoint', 'useIsMobile', 'useIsDesktop']
  },
  {
    file: 'src/utils/viewport.ts',
    exports: ['getViewportInfo', 'validateTouchTarget', 'simulateViewport']
  },
  {
    file: 'src/utils/responsiveTesting.ts',
    exports: ['generateResponsiveTestCases', 'runResponsiveTest']
  }
]

let allExportsFound = true

checks.forEach(check => {
  const content = fs.readFileSync(check.file, 'utf8')
  console.log(`   📄 ${check.file}:`)
  
  check.exports.forEach(exportName => {
    const hasExport = content.includes(`export function ${exportName}`) || 
                     content.includes(`export const ${exportName}`) ||
                     content.includes(`export async function ${exportName}`) ||
                     (content.includes(`export {`) && content.includes(exportName))
    console.log(`      ${hasExport ? '✅' : '❌'} ${exportName}`)
    if (!hasExport) allExportsFound = false
  })
})

if (!allExportsFound) {
  console.log('\n❌ Some required exports are missing!')
  process.exit(1)
}

// Check TypeScript compilation
console.log('\n🔨 Checking TypeScript compilation...')
try {
  const { execSync } = require('child_process')
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' })
  console.log('   ✅ TypeScript compilation successful')
} catch (error) {
  console.log('   ❌ TypeScript compilation failed')
  console.log('   Error:', error.message)
  allExportsFound = false
}

// Final validation
console.log('\n📊 Validation Summary:')
console.log(`   Files: ${allFilesExist ? '✅' : '❌'}`)
console.log(`   Exports: ${allExportsFound ? '✅' : '❌'}`)

const overallSuccess = allFilesExist && allExportsFound

console.log(`\n🎯 Overall Status: ${overallSuccess ? '✅ SUCCESS' : '❌ FAILED'}`)

if (overallSuccess) {
  console.log('\n🚀 Responsive utilities are properly set up!')
  console.log('\n📋 Next Steps:')
  console.log('   1. Import responsive utilities in your components')
  console.log('   2. Use useBreakpoint() hook for responsive behavior')
  console.log('   3. Test with ResponsiveDemo component')
  console.log('   4. Run responsive tests with testing utilities')
} else {
  console.log('\n🔧 Please fix the issues above before proceeding.')
  process.exit(1)
}