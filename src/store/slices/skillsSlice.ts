import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { Skill, SkillFormData } from '@/types/skill'
import apiClient from '@/services/apiClient'
import type { RootState } from '../store'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Cache utility functions
const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false
  return Date.now() - timestamp < CACHE_DURATION
}

const shouldFetchFromCache = (
  state: SkillsState,
  activeOnly: boolean = false
): boolean => {
  if (activeOnly) {
    return isCacheValid(state.cache.activeSkills.timestamp) && 
           state.cache.activeSkills.data.length > 0
  }
  
  return isCacheValid(state.cache.allSkills.timestamp) && 
         state.cache.allSkills.data.length > 0
}

interface SkillsState {
  skills: Skill[]
  currentSkill: Skill | null
  isLoading: boolean
  error: string | null
  cache: {
    allSkills: {
      data: Skill[]
      timestamp: number | null
    }
    activeSkills: {
      data: Skill[]
      timestamp: number | null
    }
  }
}

const initialState: SkillsState = {
  skills: [],
  currentSkill: null,
  isLoading: false,
  error: null,
  cache: {
    allSkills: {
      data: [],
      timestamp: null
    },
    activeSkills: {
      data: [],
      timestamp: null
    }
  }
}

export const fetchSkills = createAsyncThunk(
  'skills/fetchAll',
  async (activeOnly: boolean = false, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const skillsState = state.skills
      
      // Check if we can use cached data
      if (shouldFetchFromCache(skillsState, activeOnly)) {
        if (activeOnly) {
          return skillsState.cache.activeSkills.data
        }
        return skillsState.cache.allSkills.data
      }

      const url = `/api/skills${activeOnly ? '?activeOnly=true' : ''}`
      const response = await apiClient.get<Skill[]>(url)
      if (response.success && response.data) {
        return { data: response.data, activeOnly }
      }
      throw new Error(response.message || 'Failed to fetch skills')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch skills')
    }
  }
)

export const fetchSkillById = createAsyncThunk(
  'skills/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Skill>(`/api/skills/${id}`)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch skill')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch skill')
    }
  }
)

export const createSkill = createAsyncThunk(
  'skills/create',
  async (data: SkillFormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Skill>('/api/skills', data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to create skill')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create skill')
    }
  }
)

export const updateSkill = createAsyncThunk(
  'skills/update',
  async ({ id, data }: { id: string; data: Partial<SkillFormData> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Skill>(`/api/skills/${id}`, data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to update skill')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update skill')
    }
  }
)

export const deleteSkill = createAsyncThunk(
  'skills/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/skills/${id}`)
      if (response.success) {
        return id
      }
      throw new Error(response.message || 'Failed to delete skill')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete skill')
    }
  }
)

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setCurrentSkill: (state, action: PayloadAction<Skill | null>) => {
      state.currentSkill = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    invalidateCache: (state) => {
      state.cache.allSkills.timestamp = null
      state.cache.activeSkills.timestamp = null
    },
    invalidateActiveCache: (state) => {
      state.cache.activeSkills.timestamp = null
    },
    invalidateAllCache: (state) => {
      state.cache.allSkills.timestamp = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.isLoading = false
        const timestamp = Date.now()
        
        // Handle cached data return (no API call made)
        if (Array.isArray(action.payload)) {
          state.skills = action.payload
          return
        }
        
        // Handle fresh API data
        const { data, activeOnly } = action.payload as { 
          data: Skill[], 
          activeOnly: boolean 
        }
        
        state.skills = data
        
        // Update appropriate cache based on the request type
        if (activeOnly) {
          state.cache.activeSkills = {
            data: data,
            timestamp: timestamp
          }
        } else {
          state.cache.allSkills = {
            data: data,
            timestamp: timestamp
          }
          // Also update active skills cache if we have all skills
          state.cache.activeSkills = {
            data: data.filter(skill => skill.isActive),
            timestamp: timestamp
          }
        }
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.currentSkill = action.payload
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload)
        // Invalidate cache when new skill is created
        state.cache.allSkills.timestamp = null
        state.cache.activeSkills.timestamp = null
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        const index = state.skills.findIndex((s) => s._id === action.payload._id)
        if (index !== -1) {
          state.skills[index] = action.payload
        }
        if (state.currentSkill?._id === action.payload._id) {
          state.currentSkill = action.payload
        }
        
        // Update cached data if it exists
        const updatedSkill = action.payload
        
        // Update in all skills cache if exists
        const allIndex = state.cache.allSkills.data.findIndex(s => s._id === updatedSkill._id)
        if (allIndex !== -1) {
          state.cache.allSkills.data[allIndex] = updatedSkill
        }
        
        // Update in active skills cache if exists
        const activeIndex = state.cache.activeSkills.data.findIndex(s => s._id === updatedSkill._id)
        if (activeIndex !== -1) {
          if (updatedSkill.isActive) {
            state.cache.activeSkills.data[activeIndex] = updatedSkill
          } else {
            // Remove from active cache if no longer active
            state.cache.activeSkills.data.splice(activeIndex, 1)
          }
        } else if (updatedSkill.isActive) {
          // Add to active cache if now active
          state.cache.activeSkills.data.push(updatedSkill)
        }
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter((s) => s._id !== action.payload)
        if (state.currentSkill?._id === action.payload) {
          state.currentSkill = null
        }
        
        // Remove from cached data
        state.cache.allSkills.data = state.cache.allSkills.data.filter(s => s._id !== action.payload)
        state.cache.activeSkills.data = state.cache.activeSkills.data.filter(s => s._id !== action.payload)
      })
  },
})

export const { 
  setCurrentSkill, 
  clearError, 
  invalidateCache, 
  invalidateActiveCache, 
  invalidateAllCache 
} = skillsSlice.actions

// Selectors for cached data
export const selectSkills = (state: RootState) => state.skills.skills
export const selectActiveSkills = (state: RootState) => 
  state.skills.skills.filter(s => s.isActive)
export const selectCachedAllSkills = (state: RootState) => 
  state.skills.cache.allSkills
export const selectCachedActiveSkills = (state: RootState) => 
  state.skills.cache.activeSkills
export const selectIsLoading = (state: RootState) => state.skills.isLoading
export const selectError = (state: RootState) => state.skills.error

// Selector to check if data should be fetched
export const selectShouldFetchSkills = (activeOnly: boolean = false) => 
  (state: RootState) => !shouldFetchFromCache(state.skills, activeOnly)

export default skillsSlice.reducer

