/**
 * API Guard Middleware
 * 
 * Redux middleware that integrates API call completion guards with async thunks
 * to prevent cascading API calls and ensure proper request management.
 * 
 * Requirements: 1.4, 4.3
 */

import { Middleware, isAsyncThunkAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { 
  generateRequestKey, 
  shouldAllowRequest, 
  registerOngoingRequest, 
  registerCompletedRequest,
  isRequestOngoing
} from '@/utils/apiGuards'

// Track thunk types that should be guarded
const GUARDED_THUNK_TYPES = new Set([
  'projects/fetchAll',
  'experience/fetchAll',
  'skills/fetchAll',
  'projects/fetchById',
  'projects/fetchBySlug',
  'experience/fetchById',
  'skills/fetchById'
])

/**
 * Generate request key for different thunk types
 */
function generateThunkRequestKey(action: any): string {
  const { type, meta } = action
  
  switch (type) {
    case 'projects/fetchAll/pending':
    case 'projects/fetchAll/fulfilled':
    case 'projects/fetchAll/rejected':
      return generateRequestKey('projects/fetchAll', meta?.arg)
    
    case 'experience/fetchAll/pending':
    case 'experience/fetchAll/fulfilled':
    case 'experience/fetchAll/rejected':
      return generateRequestKey('experience/fetchAll', meta?.arg)
    
    case 'skills/fetchAll/pending':
    case 'skills/fetchAll/fulfilled':
    case 'skills/fetchAll/rejected':
      return generateRequestKey('skills/fetchAll', meta?.arg)
    
    case 'projects/fetchById/pending':
    case 'projects/fetchById/fulfilled':
    case 'projects/fetchById/rejected':
      return generateRequestKey('projects/fetchById', { id: meta?.arg })
    
    case 'projects/fetchBySlug/pending':
    case 'projects/fetchBySlug/fulfilled':
    case 'projects/fetchBySlug/rejected':
      return generateRequestKey('projects/fetchBySlug', { slug: meta?.arg })
    
    case 'experience/fetchById/pending':
    case 'experience/fetchById/fulfilled':
    case 'experience/fetchById/rejected':
      return generateRequestKey('experience/fetchById', { id: meta?.arg })
    
    case 'skills/fetchById/pending':
    case 'skills/fetchById/fulfilled':
    case 'skills/fetchById/rejected':
      return generateRequestKey('skills/fetchById', { id: meta?.arg })
    
    default:
      return generateRequestKey(type, meta?.arg)
  }
}

/**
 * Check if an action should be guarded
 */
function shouldGuardAction(action: any): boolean {
  if (!isAsyncThunkAction(action)) return false
  
  const baseType = action.type.replace(/\/(pending|fulfilled|rejected)$/, '')
  return GUARDED_THUNK_TYPES.has(baseType)
}

/**
 * API Guard Middleware
 */
export const apiGuardMiddleware: Middleware = 
  (store) => (next) => (action: any) => {
    
    // Only process guarded async thunk actions
    if (!shouldGuardAction(action)) {
      return next(action)
    }
    
    const requestKey = generateThunkRequestKey(action)
    const actionType = action.type
    
    // Handle pending actions (request start)
    if (actionType.endsWith('/pending')) {
      const guardResult = shouldAllowRequest(requestKey, {
        respectCooldown: true,
        respectOngoing: true,
        respectCompleted: false // Allow new requests even if we have cached data
      })
      
      if (!guardResult.allowed) {
        // Block the action if it's not allowed
        console.log(`[API Guard] Blocked request: ${requestKey} - ${guardResult.reason}`)
        
        // If there's an ongoing request, we could potentially wait for it
        // For now, we'll just block the duplicate request
        return
      }
      
      console.log(`[API Guard] Allowing request: ${requestKey}`)
    }
    
    // Handle fulfilled actions (request success)
    if (actionType.endsWith('/fulfilled')) {
      // Register the completed request with its result
      registerCompletedRequest(requestKey, action.payload)
      console.log(`[API Guard] Registered completed request: ${requestKey}`)
    }
    
    // Handle rejected actions (request failure)
    if (actionType.endsWith('/rejected')) {
      // Don't cache failed requests, but log them
      console.log(`[API Guard] Request failed: ${requestKey}`)
    }
    
    // Continue with the action
    return next(action)
  }

/**
 * Enhanced thunk guard that can be used to wrap individual thunks
 */
export function createGuardedThunk<Args extends any[], Return>(
  thunkCreator: (args: Args) => any,
  keyGenerator: (args: Args) => string
) {
  return (args: Args) => {
    return async (dispatch: any, getState: any) => {
      const requestKey = keyGenerator(args)
      
      // Check if we should allow this request
      const guardResult = shouldAllowRequest(requestKey, {
        respectCooldown: true,
        respectOngoing: true,
        respectCompleted: true
      })
      
      if (!guardResult.allowed) {
        // If we have cached result, return it
        if (guardResult.cachedResult !== undefined) {
          return guardResult.cachedResult
        }
        
        // If request is ongoing, wait for it
        if (isRequestOngoing(requestKey)) {
          // This is a simplified approach - in a real implementation,
          // you might want to return the ongoing promise
          throw new Error(`Request already in progress: ${requestKey}`)
        }
        
        throw new Error(`Request blocked: ${guardResult.reason}`)
      }
      
      // Execute the original thunk
      const originalThunk = thunkCreator(args)
      const promise = originalThunk(dispatch, getState)
      
      // Register as ongoing
      registerOngoingRequest(requestKey, promise)
      
      try {
        const result = await promise
        registerCompletedRequest(requestKey, result)
        return result
      } catch (error) {
        // Don't cache errors
        throw error
      }
    }
  }
}