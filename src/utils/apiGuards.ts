/**
 * API Call Completion Guards
 * 
 * This module provides utilities to prevent cascading API calls and ensure
 * that completed API calls don't trigger additional requests.
 * 
 * Requirements: 1.4, 4.3
 */

// Track ongoing requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<any>>()

// Track completed requests with timestamps
const completedRequests = new Map<string, { timestamp: number; result: any }>()

// Configuration
const REQUEST_COOLDOWN = 1000 // 1 second cooldown between identical requests
const COMPLETION_CACHE_DURATION = 30000 // 30 seconds to remember completed requests

/**
 * Generate a unique key for a request based on its parameters
 */
export function generateRequestKey(
  endpoint: string, 
  params?: Record<string, any>
): string {
  const paramString = params ? JSON.stringify(params) : ''
  return `${endpoint}:${paramString}`
}

/**
 * Check if a request is currently ongoing
 */
export function isRequestOngoing(requestKey: string): boolean {
  return ongoingRequests.has(requestKey)
}

/**
 * Check if a request was recently completed and is still in cooldown
 */
export function isRequestInCooldown(requestKey: string): boolean {
  const completed = completedRequests.get(requestKey)
  if (!completed) return false
  
  const timeSinceCompletion = Date.now() - completed.timestamp
  return timeSinceCompletion < REQUEST_COOLDOWN
}

/**
 * Check if a request was recently completed and cached result is still valid
 */
export function hasValidCompletedRequest(requestKey: string): { isValid: boolean; result?: any } {
  const completed = completedRequests.get(requestKey)
  if (!completed) return { isValid: false }
  
  const timeSinceCompletion = Date.now() - completed.timestamp
  const isValid = timeSinceCompletion < COMPLETION_CACHE_DURATION
  
  return { isValid, result: isValid ? completed.result : undefined }
}

/**
 * Guard function to prevent cascading API calls
 * Returns true if the request should proceed, false if it should be blocked
 */
export function shouldAllowRequest(
  requestKey: string,
  options: {
    respectCooldown?: boolean
    respectOngoing?: boolean
    respectCompleted?: boolean
  } = {}
): { allowed: boolean; reason?: string; cachedResult?: any } {
  const {
    respectCooldown = true,
    respectOngoing = true,
    respectCompleted = true
  } = options

  // Check if request is currently ongoing
  if (respectOngoing && isRequestOngoing(requestKey)) {
    return { 
      allowed: false, 
      reason: 'Request already in progress' 
    }
  }

  // Check if request is in cooldown period
  if (respectCooldown && isRequestInCooldown(requestKey)) {
    return { 
      allowed: false, 
      reason: 'Request in cooldown period' 
    }
  }

  // Check if we have a valid cached result
  if (respectCompleted) {
    const { isValid, result } = hasValidCompletedRequest(requestKey)
    if (isValid) {
      return { 
        allowed: false, 
        reason: 'Valid cached result available',
        cachedResult: result
      }
    }
  }

  return { allowed: true }
}

/**
 * Register an ongoing request
 */
export function registerOngoingRequest(requestKey: string, promise: Promise<any>): Promise<any> {
  ongoingRequests.set(requestKey, promise)
  
  // Clean up when request completes (success or failure)
  promise.finally(() => {
    ongoingRequests.delete(requestKey)
  })
  
  return promise
}

/**
 * Register a completed request with its result
 */
export function registerCompletedRequest(requestKey: string, result: any): void {
  completedRequests.set(requestKey, {
    timestamp: Date.now(),
    result
  })
  
  // Clean up old completed requests periodically
  cleanupCompletedRequests()
}

/**
 * Clean up old completed requests to prevent memory leaks
 */
function cleanupCompletedRequests(): void {
  const now = Date.now()
  const keysToDelete: string[] = []
  
  completedRequests.forEach((value, key) => {
    if (now - value.timestamp > COMPLETION_CACHE_DURATION) {
      keysToDelete.push(key)
    }
  })
  
  keysToDelete.forEach(key => completedRequests.delete(key))
}

/**
 * Clear all request tracking (useful for testing or manual reset)
 */
export function clearAllRequestTracking(): void {
  ongoingRequests.clear()
  completedRequests.clear()
}

/**
 * Get current request tracking status (useful for debugging)
 */
export function getRequestTrackingStatus(): {
  ongoingCount: number
  completedCount: number
  ongoingRequests: string[]
  completedRequests: Array<{ key: string; timestamp: number; age: number }>
} {
  const now = Date.now()
  
  return {
    ongoingCount: ongoingRequests.size,
    completedCount: completedRequests.size,
    ongoingRequests: Array.from(ongoingRequests.keys()),
    completedRequests: Array.from(completedRequests.entries()).map(([key, value]) => ({
      key,
      timestamp: value.timestamp,
      age: now - value.timestamp
    }))
  }
}

/**
 * Higher-order function to wrap async thunks with API guards
 */
export function withApiGuards<T extends any[], R>(
  requestKeyGenerator: (...args: T) => string,
  originalThunk: (...args: T) => Promise<R>,
  options?: {
    respectCooldown?: boolean
    respectOngoing?: boolean
    respectCompleted?: boolean
  }
) {
  return async (...args: T): Promise<R> => {
    const requestKey = requestKeyGenerator(...args)
    const guardResult = shouldAllowRequest(requestKey, options)
    
    if (!guardResult.allowed) {
      // If we have a cached result, return it
      if (guardResult.cachedResult !== undefined) {
        return guardResult.cachedResult
      }
      
      // If request is ongoing, wait for it
      if (isRequestOngoing(requestKey)) {
        return await ongoingRequests.get(requestKey)!
      }
      
      // Otherwise, throw an error or return a default value
      throw new Error(`Request blocked: ${guardResult.reason}`)
    }
    
    // Execute the original thunk with tracking
    const promise = originalThunk(...args)
    registerOngoingRequest(requestKey, promise)
    
    try {
      const result = await promise
      registerCompletedRequest(requestKey, result)
      return result
    } catch (error) {
      // Don't cache errors, but still clean up ongoing tracking
      throw error
    }
  }
}