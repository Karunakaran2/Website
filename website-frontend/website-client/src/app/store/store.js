import { configureStore } from '@reduxjs/toolkit'
import { getDefaultMiddlewareConfig } from './middleware'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddlewareConfig,
  devTools: import.meta.env.DEV,
})
