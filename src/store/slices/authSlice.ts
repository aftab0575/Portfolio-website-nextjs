import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { AuthState, PublicUser } from '@/modules/auth/types'
import { LoginCredentials, AuthResponse } from '@/types/user'
import apiClient from '@/services/apiClient'

const getInitialState = (): AuthState => {
  // Always return the same initial state to prevent hydration mismatches
  // The client will check localStorage and update state after hydration
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start with loading to match server render
  }
}

const initialState: AuthState = getInitialState()

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials)
      if (response.success && response.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token)
        }
        return response.data
      }
      throw new Error(response.message || 'Login failed')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
  try {
    await apiClient.post('/api/auth/logout')
  } catch (error) {
    // Ignore logout errors
  }
})

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ user: PublicUser }>('/api/auth/me')
      if (response.success && response.data) {
        return response.data.user
      }
      throw new Error('Failed to get user')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<PublicUser | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload
      state.isAuthenticated = !!action.payload
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('token', action.payload)
        } else {
          localStorage.removeItem('token')
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.token = null
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
      })
  },
})

export const { setUser, setToken, setLoading, clearAuth } = authSlice.actions
export default authSlice.reducer

