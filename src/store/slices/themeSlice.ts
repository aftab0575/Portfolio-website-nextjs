import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { Theme, ThemeFormData } from '@/types/theme'
import apiClient from '@/services/apiClient'

interface ThemeState {
  themes: Theme[]
  activeTheme: Theme | null
  isLoading: boolean
  error: string | null
}

const initialState: ThemeState = {
  themes: [],
  activeTheme: null,
  isLoading: false,
  error: null,
}

export const fetchThemes = createAsyncThunk('theme/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<Theme[]>('/api/themes')
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || 'Failed to fetch themes')
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch themes')
  }
})

export const fetchActiveTheme = createAsyncThunk(
  'theme/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<Theme>('/api/themes/active')
      if (response.success && response.data) {
        return response.data
      }
      return null
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch active theme')
    }
  }
)

export const createTheme = createAsyncThunk(
  'theme/create',
  async (data: ThemeFormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Theme>('/api/themes', data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to create theme')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create theme')
    }
  }
)

export const updateTheme = createAsyncThunk(
  'theme/update',
  async ({ id, data }: { id: string; data: Partial<ThemeFormData> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Theme>(`/api/themes/${id}`, data)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to update theme')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update theme')
    }
  }
)

export const activateTheme = createAsyncThunk(
  'theme/activate',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Theme>(`/api/themes/${id}/activate`)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to activate theme')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to activate theme')
    }
  }
)

export const activateThemePublic = createAsyncThunk(
  'theme/activatePublic',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Theme>(`/api/themes/${id}/activate-public`)
      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.message || 'Failed to activate theme')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to activate theme')
    }
  }
)

export const deleteTheme = createAsyncThunk(
  'theme/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/themes/${id}`)
      if (response.success) {
        return id
      }
      throw new Error(response.message || 'Failed to delete theme')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete theme')
    }
  }
)

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setActiveTheme: (state, action: PayloadAction<Theme | null>) => {
      state.activeTheme = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.isLoading = false
        state.themes = action.payload
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchActiveTheme.fulfilled, (state, action) => {
        state.activeTheme = action.payload
      })
      .addCase(createTheme.fulfilled, (state, action) => {
        state.themes.push(action.payload)
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        const index = state.themes.findIndex((t) => t._id === action.payload._id)
        if (index !== -1) {
          state.themes[index] = action.payload
        }
      })
      .addCase(activateTheme.fulfilled, (state, action) => {
        state.activeTheme = action.payload
        state.themes = state.themes.map((t) => ({
          ...t,
          isActive: t._id === action.payload._id,
        }))
      })
      .addCase(activateThemePublic.fulfilled, (state, action) => {
        state.activeTheme = action.payload
        state.themes = state.themes.map((t) => ({
          ...t,
          isActive: t._id === action.payload._id,
        }))
      })
      .addCase(deleteTheme.fulfilled, (state, action) => {
        state.themes = state.themes.filter((t) => t._id !== action.payload)
        if (state.activeTheme?._id === action.payload) {
          state.activeTheme = null
        }
      })
  },
})

export const { setActiveTheme, clearError } = themeSlice.actions
export default themeSlice.reducer

