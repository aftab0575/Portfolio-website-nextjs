import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isLoading: boolean
  theme: 'light' | 'dark'
}

const initialState: UiState = {
  isLoading: false,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
  },
})

export const { setLoading, setTheme } = uiSlice.actions
export default uiSlice.reducer

