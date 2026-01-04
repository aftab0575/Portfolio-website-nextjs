import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { Experience, ExperienceFormData } from '@/types/experience'
import apiClient from '@/services/apiClient'
import type { RootState } from '../store'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Cache utility functions
const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false
  return Date.now() - timestamp < CACHE_DURATION
}

const shouldFetchFromCache = (state: ExperienceState): boolean => {
  return isCacheValid(state.cache.timestamp) && 
         state.cache.data.length > 0
}

interface ExperienceState {
  experiences: Experience[]
  currentExperience: Experience | null
  isLoading: boolean
  error: string | null
  cache: {
    data: Experience[]
    timestamp: number | null
  }
}

const initialState: ExperienceState = {
  experiences: [],
  currentExperience: null,
  isLoading: false,
  error: null,
  cache: {
    data: [],
    timestamp: null
  }
}

export const fetchExperiences = createAsyncThunk(
  'experience/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const experienceState = state.experience
      
      // Check if we can use cached data
      if (shouldFetchFromCache(experienceState)) {
        return experienceState.cache.data
      }

      const response = await apiClient.get<Experience[]>('/api/experience')
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch experiences')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch experiences')
    }
  }
)

export const fetchExperienceById = createAsyncThunk(
  'experience/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Experience>(`/api/experience/${id}`)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch experience')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch experience')
    }
  }
)

export const createExperience = createAsyncThunk(
  'experience/create',
  async (data: ExperienceFormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Experience>('/api/experience', data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to create experience')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create experience')
    }
  }
)

export const updateExperience = createAsyncThunk(
  'experience/update',
  async ({ id, data }: { id: string; data: Partial<ExperienceFormData> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Experience>(`/api/experience/${id}`, data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to update experience')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update experience')
    }
  }
)

export const deleteExperience = createAsyncThunk(
  'experience/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/experience/${id}`)
      if (response.success) {
        return id
      }
      throw new Error(response.message || 'Failed to delete experience')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete experience')
    }
  }
)

const experienceSlice = createSlice({
  name: 'experience',
  initialState,
  reducers: {
    setCurrentExperience: (state, action: PayloadAction<Experience | null>) => {
      state.currentExperience = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    invalidateCache: (state) => {
      state.cache.timestamp = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperiences.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.isLoading = false
        state.experiences = action.payload
        
        // Update cache with fresh data
        state.cache = {
          data: action.payload,
          timestamp: Date.now()
        }
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchExperienceById.fulfilled, (state, action) => {
        state.currentExperience = action.payload
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.experiences.unshift(action.payload)
        // Invalidate cache when new experience is created
        state.cache.timestamp = null
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.experiences.findIndex((e) => e._id === action.payload._id)
        if (index !== -1) {
          state.experiences[index] = action.payload
        }
        if (state.currentExperience?._id === action.payload._id) {
          state.currentExperience = action.payload
        }
        
        // Update cached data if it exists
        const cacheIndex = state.cache.data.findIndex(e => e._id === action.payload._id)
        if (cacheIndex !== -1) {
          state.cache.data[cacheIndex] = action.payload
        }
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter((e) => e._id !== action.payload)
        if (state.currentExperience?._id === action.payload) {
          state.currentExperience = null
        }
        
        // Remove from cached data
        state.cache.data = state.cache.data.filter(e => e._id !== action.payload)
      })
  },
})

export const { 
  setCurrentExperience, 
  clearError, 
  invalidateCache 
} = experienceSlice.actions

// Selectors for cached data
export const selectExperiences = (state: RootState) => state.experience.experiences
export const selectCachedExperiences = (state: RootState) => 
  state.experience.cache
export const selectIsLoading = (state: RootState) => state.experience.isLoading
export const selectError = (state: RootState) => state.experience.error

// Selector to check if data should be fetched
export const selectShouldFetchExperiences = (state: RootState) => 
  !shouldFetchFromCache(state.experience)

export default experienceSlice.reducer

