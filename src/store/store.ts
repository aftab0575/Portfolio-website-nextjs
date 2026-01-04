import { configureStore } from '@reduxjs/toolkit'
// Import slices
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'
import projectsReducer from './slices/projectsSlice'
import skillsReducer from './slices/skillsSlice'
import experienceReducer from './slices/experienceSlice'
import themeReducer from './slices/themeSlice'
// Import middleware
import { apiGuardMiddleware } from './middleware/apiGuardMiddleware'

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      projects: projectsReducer,
      skills: skillsReducer,
      experience: experienceReducer,
      theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [],
        },
      }).concat(apiGuardMiddleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

