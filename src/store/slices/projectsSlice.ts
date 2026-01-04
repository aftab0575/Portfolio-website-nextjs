import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { Project, ProjectFormData } from '@/types/project'
import apiClient from '@/services/apiClient'
import type { RootState } from '../store'

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Cache utility functions
const generateCacheKey = (filters?: { isFeatured?: boolean; category?: string }): string => {
  if (!filters) return 'all'
  const parts = []
  if (filters.isFeatured !== undefined) parts.push(`featured:${filters.isFeatured}`)
  if (filters.category) parts.push(`category:${filters.category}`)
  return parts.length > 0 ? parts.join('|') : 'all'
}

const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false
  return Date.now() - timestamp < CACHE_DURATION
}

const shouldFetchFromCache = (
  state: ProjectsState,
  filters?: { isFeatured?: boolean; category?: string }
): boolean => {
  const cacheKey = generateCacheKey(filters)
  
  // Check if we have cached data for this specific request
  if (filters?.isFeatured === true) {
    return isCacheValid(state.cache.featuredProjects.timestamp) && 
           state.cache.featuredProjects.data.length > 0
  }
  
  if (!filters || cacheKey === 'all') {
    return isCacheValid(state.cache.allProjects.timestamp) && 
           state.cache.allProjects.data.length > 0
  }
  
  // For other filters, check if we have recent all projects data that can be filtered
  return isCacheValid(state.cache.allProjects.timestamp) && 
         state.cache.allProjects.data.length > 0
}

interface CacheMetadata {
  timestamp: number
  filters?: { isFeatured?: boolean; category?: string }
  key: string
}

interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
  cache: {
    lastFetch: CacheMetadata | null
    featuredProjects: {
      data: Project[]
      timestamp: number | null
    }
    allProjects: {
      data: Project[]
      timestamp: number | null
    }
  }
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  cache: {
    lastFetch: null,
    featuredProjects: {
      data: [],
      timestamp: null
    },
    allProjects: {
      data: [],
      timestamp: null
    }
  }
}

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (filters: { isFeatured?: boolean; category?: string } | undefined, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const projectsState = state.projects
      
      // Check if we can use cached data
      if (shouldFetchFromCache(projectsState, filters)) {
        // Return cached data based on the filter type
        if (filters?.isFeatured === true) {
          return projectsState.cache.featuredProjects.data
        }
        
        if (!filters || generateCacheKey(filters) === 'all') {
          return projectsState.cache.allProjects.data
        }
        
        // For other filters, filter the cached all projects data
        let cachedData = projectsState.cache.allProjects.data
        if (filters?.category) {
          cachedData = cachedData.filter(project => project.category === filters.category)
        }
        return cachedData
      }

      // If no valid cache, fetch from API
      const queryParams = new URLSearchParams()
      if (filters?.isFeatured !== undefined) {
        queryParams.append('isFeatured', filters.isFeatured.toString())
      }
      if (filters?.category) {
        queryParams.append('category', filters.category)
      }

      const url = `/api/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get<Project[]>(url)
      if (response.success && response.data) {
        return { data: response.data, filters, cacheKey: generateCacheKey(filters) }
      }
      throw new Error(response.message || 'Failed to fetch projects')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch projects')
    }
  }
)

export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Project>(`/api/projects/${id}`)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch project')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch project')
    }
  }
)

export const fetchProjectBySlug = createAsyncThunk(
  'projects/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Project>(`/api/projects/${slug}`)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch project')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch project')
    }
  }
)

export const createProject = createAsyncThunk(
  'projects/create',
  async (data: ProjectFormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Project>('/api/projects', data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to create project')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create project')
    }
  }
)

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }: { id: string; data: Partial<ProjectFormData> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Project>(`/api/projects/${id}`, data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to update project')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update project')
    }
  }
)

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/projects/${id}`)
      if (response.success) {
        return id
      }
      throw new Error(response.message || 'Failed to delete project')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete project')
    }
  }
)

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    invalidateCache: (state) => {
      state.cache.lastFetch = null
      state.cache.featuredProjects.timestamp = null
      state.cache.allProjects.timestamp = null
    },
    invalidateFeaturedCache: (state) => {
      state.cache.featuredProjects.timestamp = null
    },
    invalidateAllProjectsCache: (state) => {
      state.cache.allProjects.timestamp = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        const timestamp = Date.now()
        
        // Handle cached data return (no API call made)
        if (Array.isArray(action.payload)) {
          state.projects = action.payload
          return
        }
        
        // Handle fresh API data
        const { data, filters, cacheKey } = action.payload as { 
          data: Project[], 
          filters?: { isFeatured?: boolean; category?: string },
          cacheKey: string 
        }
        
        state.projects = data
        
        // Update appropriate cache based on the request type
        if (filters?.isFeatured === true) {
          state.cache.featuredProjects = {
            data: data,
            timestamp: timestamp
          }
        } else if (!filters || cacheKey === 'all') {
          state.cache.allProjects = {
            data: data,
            timestamp: timestamp
          }
        }
        
        // Update last fetch metadata
        state.cache.lastFetch = {
          timestamp: timestamp,
          filters: filters,
          key: cacheKey
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchProjectBySlug.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProjectBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload)
        // Invalidate cache when new project is created
        state.cache.lastFetch = null
        state.cache.featuredProjects.timestamp = null
        state.cache.allProjects.timestamp = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p._id === action.payload._id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload
        }
        
        // Update cached data if it exists
        const updatedProject = action.payload
        
        // Update in featured cache if exists
        const featuredIndex = state.cache.featuredProjects.data.findIndex(p => p._id === updatedProject._id)
        if (featuredIndex !== -1) {
          if (updatedProject.isFeatured) {
            state.cache.featuredProjects.data[featuredIndex] = updatedProject
          } else {
            // Remove from featured cache if no longer featured
            state.cache.featuredProjects.data.splice(featuredIndex, 1)
          }
        } else if (updatedProject.isFeatured) {
          // Add to featured cache if now featured
          state.cache.featuredProjects.data.push(updatedProject)
        }
        
        // Update in all projects cache if exists
        const allIndex = state.cache.allProjects.data.findIndex(p => p._id === updatedProject._id)
        if (allIndex !== -1) {
          state.cache.allProjects.data[allIndex] = updatedProject
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload)
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null
        }
        
        // Remove from cached data
        state.cache.featuredProjects.data = state.cache.featuredProjects.data.filter(p => p._id !== action.payload)
        state.cache.allProjects.data = state.cache.allProjects.data.filter(p => p._id !== action.payload)
      })
  },
})

export const { 
  setCurrentProject, 
  clearError, 
  invalidateCache, 
  invalidateFeaturedCache, 
  invalidateAllProjectsCache 
} = projectsSlice.actions

// Selectors for cached data
export const selectProjects = (state: RootState) => state.projects.projects
export const selectFeaturedProjects = (state: RootState) => 
  state.projects.projects.filter(p => p.isFeatured)
export const selectCachedFeaturedProjects = (state: RootState) => 
  state.projects.cache.featuredProjects
export const selectCachedAllProjects = (state: RootState) => 
  state.projects.cache.allProjects
export const selectCacheMetadata = (state: RootState) => 
  state.projects.cache.lastFetch
export const selectIsLoading = (state: RootState) => state.projects.isLoading
export const selectError = (state: RootState) => state.projects.error

// Selector to check if data should be fetched
export const selectShouldFetch = (filters?: { isFeatured?: boolean; category?: string }) => 
  (state: RootState) => !shouldFetchFromCache(state.projects, filters)

export default projectsSlice.reducer

