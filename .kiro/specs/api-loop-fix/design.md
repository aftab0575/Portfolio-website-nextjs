# Design Document: API Loop Fix

## Overview

This design addresses the infinite API loop issue in the portfolio website where `/api/projects?isFeatured=true` is called continuously. The root cause is improper useEffect dependency arrays in React components that trigger re-renders and subsequent API calls. The solution involves refactoring data fetching logic to prevent unnecessary re-fetches while maintaining proper React patterns.

## Architecture

The current architecture uses Redux Toolkit for state management with async thunks for API calls. Components use useEffect hooks to trigger data fetching, but the dependency arrays include state values that change when the API calls complete, creating infinite loops.

### Current Problematic Flow
```
Component mounts → useEffect triggers → API call → Redux state updates → 
Component re-renders → useEffect triggers again → Infinite loop
```

### Proposed Fixed Flow
```
Component mounts → useEffect triggers once → API call → Redux state updates → 
Component re-renders → useEffect does NOT trigger again
```

## Components and Interfaces

### Affected Components

1. **Home Page (`src/app/(public)/page.tsx`)**
   - Currently: useEffect with `[dispatch, projects.length, isLoading]` dependencies
   - Issue: `projects.length` changes when data loads, triggering re-fetch

2. **Projects Page (`src/app/(public)/projects/page.tsx`)**
   - Currently: useEffect with `[dispatch, projects.length, isLoading]` dependencies
   - Issue: Same as home page

3. **Admin Dashboard (`src/app/admin/dashboard/page.tsx`)**
   - Currently: Uses empty dependency array with eslint-disable
   - Issue: Code smell, but functionally correct

4. **Admin Projects Page (`src/app/admin/projects/page.tsx`)**
   - Currently: Uses empty dependency array with eslint-disable
   - Issue: Code smell, but functionally correct

### Redux State Management

The Redux slice (`src/store/slices/projectsSlice.ts`) correctly handles async thunks and state updates. No changes needed to the Redux logic.

## Data Models

No changes to existing data models. The issue is purely in the component data fetching logic.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing the acceptance criteria, several properties can be consolidated to avoid redundancy:
- Properties 1.3 and 2.3 both test caching behavior during navigation - can be combined
- Properties 1.2 and 1.5 both test preventing refetches on state changes - can be combined  
- Properties 2.1 and 2.2 follow the same pattern for different data types - can be generalized
- Properties 1.4 and 4.3 both test preventing unintended API calls - can be combined

### Core Properties

**Property 1: Single fetch per component mount**
*For any* React component that fetches data on mount, mounting the component should trigger exactly one API call regardless of subsequent state updates or re-renders
**Validates: Requirements 1.1, 1.2, 1.5**

**Property 2: Session-level data caching**
*For any* data fetching operation within a session, the same data should be fetched at most once per session, with subsequent requests using cached data
**Validates: Requirements 2.1, 2.2, 2.5**

**Property 3: Navigation caching efficiency**
*For any* navigation between pages that use the same data, cached data should be reused instead of making new API calls
**Validates: Requirements 1.3, 2.3**

**Property 4: API call completion without cascading**
*For any* API call that completes successfully, the completion should not trigger additional API calls for the same data
**Validates: Requirements 1.4, 4.3**

**Property 5: Render count optimization**
*For any* component that fetches data, the number of renders should not exceed a reasonable threshold (initial + loading + success states)
**Validates: Requirements 3.5, 4.5**

**Property 6: Redux state consistency**
*For any* data fetching operation, the Redux state should remain consistent and not trigger unintended side effects
**Validates: Requirements 2.4, 4.5**

<function_calls>
<invoke name="prework">
<parameter name="featureName">api-loop-fix

## Error Handling

### Current Error Handling
The existing Redux async thunks already handle errors appropriately with try-catch blocks and `rejectWithValue`. No changes needed to error handling logic.

### Additional Considerations
- Ensure that failed API calls don't trigger infinite retry loops
- Maintain error states in Redux without causing re-fetches
- Handle network failures gracefully without breaking the caching logic

## Testing Strategy

### Dual Testing Approach
This fix requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**
- Test specific useEffect dependency arrays
- Test component mounting behavior
- Test Redux state transitions
- Test error scenarios and edge cases

**Property-Based Tests:**
- Test API call frequency across random component interactions
- Test caching behavior with various navigation patterns
- Test state consistency across random state updates
- Minimum 100 iterations per property test

### Property Test Configuration
Each property test will be tagged with:
**Feature: api-loop-fix, Property {number}: {property_text}**

### Testing Tools
- **Jest** for unit testing
- **React Testing Library** for component testing
- **MSW (Mock Service Worker)** for API mocking
- **fast-check** for property-based testing in TypeScript

### Implementation Strategy

#### Phase 1: Fix useEffect Dependencies
1. Replace problematic dependency arrays with refs or empty arrays
2. Use `useRef` to track fetch status and prevent duplicate calls
3. Implement proper cleanup in useEffect return functions

#### Phase 2: Add Fetch Guards
1. Add guards in components to check if data already exists
2. Implement proper loading states that don't trigger re-fetches
3. Add debug logging to track API call patterns

#### Phase 3: Optimize Redux Selectors
1. Use memoized selectors to prevent unnecessary re-renders
2. Implement proper state normalization if needed
3. Add caching timestamps for data freshness checks

#### Phase 4: Testing and Validation
1. Implement comprehensive test suite
2. Add performance monitoring
3. Validate fix in development and staging environments

### Solution Patterns

#### Pattern 1: useRef for Fetch Tracking
```typescript
const hasFetched = useRef(false)

useEffect(() => {
  if (!hasFetched.current && projects.length === 0 && !isLoading) {
    hasFetched.current = true
    dispatch(fetchProjects({ isFeatured: true }))
  }
}, []) // Empty dependency array
```

#### Pattern 2: Conditional Fetching with State Checks
```typescript
useEffect(() => {
  const shouldFetch = projects.length === 0 && !isLoading && !error
  if (shouldFetch) {
    dispatch(fetchProjects({ isFeatured: true }))
  }
}, []) // Empty dependency array, all conditions checked inside
```

#### Pattern 3: Custom Hook for Data Fetching
```typescript
const useFeaturedProjects = () => {
  const dispatch = useAppDispatch()
  const { projects, isLoading, error } = useAppSelector(state => state.projects)
  
  useEffect(() => {
    if (projects.length === 0 && !isLoading && !error) {
      dispatch(fetchProjects({ isFeatured: true }))
    }
  }, []) // Empty dependency array
  
  return { featuredProjects: projects.filter(p => p.isFeatured), isLoading, error }
}
```

This design ensures that the API loop issue is resolved while maintaining proper React patterns and comprehensive testing coverage.