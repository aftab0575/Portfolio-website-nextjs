/**
 * useApiGuards Hook
 * 
 * Custom React hook that provides API call completion guards for components.
 * Prevents cascading API calls and ensures proper request management.
 * 
 * Requirements: 1.4, 4.3
 */

import { useCallback, useRef, useEffect } from 'react'
import { useAppSelector } from '@/store/hooks'
import { 
  generateRequestKey, 
  shouldAllowRequest, 
  isRequestOngoing,
  hasValidCompletedRequest,
  getRequestTrackingStatus
} from '@/utils/apiGuards'

interface UseApiGuardsOptions {
  /**
   * Cooldown period between identical requests (ms)
   */
  cooldownPeriod?: number
  
  /**
   * Whether to respect ongoing requests
   */
  respectOngoing?: boolean
  
  /**
   * Whether to respect completed requests cache
   */
  respectCompleted?: boolean
  
  /**
   * Whether to respect cooldown periods
   */
  respectCooldown?: boolean
  
  /**
   * Enable debug logging
   */
  debug?: boolean
}

interface ApiGuardResult {
  /**
   * Whether the API call should be allowed
   */
  allowed: boolean
  
  /**
   * Reason why the call was blocked (if blocked)
   */
  reason?: string
  
  /**
   * Cached result if available
   */
  cachedResult?: any
  
  /**
   * Whether there's an ongoing request for this key
   */
  isOngoing: boolean
  
  /**
   * Whether there's a valid completed request
   */
  hasCompleted: boolean
}

/**
 * Hook for managing API call guards
 */
export function useApiGuards(options: UseApiGuardsOptions = {}) {
  const {
    cooldownPeriod = 1000,
    respectOngoing = true,
    respectCompleted = true,
    respectCooldown = true,
    debug = false
  } = options
  
  const componentMountTime = useRef(Date.now())
  const lastRequestTimes = useRef<Map<string, number>>(new Map())
  
  /**
   * Check if an API call should be allowed
   */
  const checkApiCall = useCallback((
    endpoint: string,
    params?: Record<string, any>
  ): ApiGuardResult => {
    const requestKey = generateRequestKey(endpoint, params)
    
    // Check ongoing requests
    const isOngoing = isRequestOngoing(requestKey)
    
    // Check completed requests
    const { isValid: hasCompleted, result: cachedResult } = hasValidCompletedRequest(requestKey)
    
    // Check guard conditions
    const guardResult = shouldAllowRequest(requestKey, {
      respectOngoing,
      respectCompleted,
      respectCooldown
    })
    
    // Additional component-level cooldown check
    let componentCooldownBlocked = false
    if (respectCooldown) {
      const lastRequestTime = lastRequestTimes.current.get(requestKey)
      if (lastRequestTime && Date.now() - lastRequestTime < cooldownPeriod) {
        componentCooldownBlocked = true
      }
    }
    
    const finalAllowed = guardResult.allowed && !componentCooldownBlocked
    const finalReason = componentCooldownBlocked 
      ? 'Component-level cooldown active'
      : guardResult.reason
    
    if (debug) {
      console.log(`[useApiGuards] ${requestKey}:`, {
        allowed: finalAllowed,
        reason: finalReason,
        isOngoing,
        hasCompleted,
        cachedResult: !!cachedResult
      })
    }
    
    return {
      allowed: finalAllowed,
      reason: finalReason,
      cachedResult,
      isOngoing,
      hasCompleted
    }
  }, [cooldownPeriod, respectOngoing, respectCompleted, respectCooldown, debug])
  
  /**
   * Register that an API call was made
   */
  const registerApiCall = useCallback((
    endpoint: string,
    params?: Record<string, any>
  ): void => {
    const requestKey = generateRequestKey(endpoint, params)
    lastRequestTimes.current.set(requestKey, Date.now())
    
    if (debug) {
      console.log(`[useApiGuards] Registered API call: ${requestKey}`)
    }
  }, [debug])
  
  /**
   * Get a guarded version of a dispatch function
   */
  const createGuardedDispatch = useCallback(<T extends any[], R>(
    endpoint: string,
    dispatchFn: (...args: T) => Promise<R>,
    paramsExtractor?: (...args: T) => Record<string, any>
  ) => {
    return async (...args: T): Promise<R | null> => {
      const params = paramsExtractor ? paramsExtractor(...args) : undefined
      const guardResult = checkApiCall(endpoint, params)
      
      if (!guardResult.allowed) {
        if (debug) {
          console.log(`[useApiGuards] Blocked dispatch for ${endpoint}:`, guardResult.reason)
        }
        
        // Return cached result if available
        if (guardResult.cachedResult !== undefined) {
          return guardResult.cachedResult
        }
        
        // Return null if blocked
        return null
      }
      
      // Register the call and execute
      registerApiCall(endpoint, params)
      return await dispatchFn(...args)
    }
  }, [checkApiCall, registerApiCall, debug])
  
  /**
   * Get current API guard status for debugging
   */
  const getGuardStatus = useCallback(() => {
    const globalStatus = getRequestTrackingStatus()
    const componentAge = Date.now() - componentMountTime.current
    
    return {
      ...globalStatus,
      componentAge,
      componentRequests: Array.from(lastRequestTimes.current.entries()).map(([key, time]) => ({
        key,
        time,
        age: Date.now() - time
      }))
    }
  }, [])
  
  /**
   * Clear component-level request tracking
   */
  const clearComponentTracking = useCallback(() => {
    lastRequestTimes.current.clear()
    if (debug) {
      console.log('[useApiGuards] Cleared component tracking')
    }
  }, [debug])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debug) {
        console.log('[useApiGuards] Component unmounting, clearing tracking')
      }
      clearComponentTracking()
    }
  }, [clearComponentTracking, debug])
  
  return {
    checkApiCall,
    registerApiCall,
    createGuardedDispatch,
    getGuardStatus,
    clearComponentTracking
  }
}

/**
 * Hook specifically for projects API calls
 */
export function useProjectsApiGuards(options?: UseApiGuardsOptions) {
  const guards = useApiGuards(options)
  
  const checkFetchProjects = useCallback((filters?: { isFeatured?: boolean }) => {
    return guards.checkApiCall('projects/fetchAll', filters)
  }, [guards])
  
  const checkFetchProjectById = useCallback((id: string) => {
    return guards.checkApiCall('projects/fetchById', { id })
  }, [guards])
  
  const checkFetchProjectBySlug = useCallback((slug: string) => {
    return guards.checkApiCall('projects/fetchBySlug', { slug })
  }, [guards])
  
  return {
    ...guards,
    checkFetchProjects,
    checkFetchProjectById,
    checkFetchProjectBySlug
  }
}

/**
 * Hook specifically for skills API calls
 */
export function useSkillsApiGuards(options?: UseApiGuardsOptions) {
  const guards = useApiGuards(options)
  
  const checkFetchSkills = useCallback((activeOnly: boolean = false) => {
    return guards.checkApiCall('skills/fetchAll', { activeOnly })
  }, [guards])
  
  const checkFetchSkillById = useCallback((id: string) => {
    return guards.checkApiCall('skills/fetchById', { id })
  }, [guards])
  
  return {
    ...guards,
    checkFetchSkills,
    checkFetchSkillById
  }
}

/**
 * Hook specifically for experience API calls
 */
export function useExperienceApiGuards(options?: UseApiGuardsOptions) {
  const guards = useApiGuards(options)
  
  const checkFetchExperiences = useCallback(() => {
    return guards.checkApiCall('experience/fetchAll')
  }, [guards])
  
  const checkFetchExperienceById = useCallback((id: string) => {
    return guards.checkApiCall('experience/fetchById', { id })
  }, [guards])
  
  return {
    ...guards,
    checkFetchExperiences,
    checkFetchExperienceById
  }
}