import { configureStore } from '@reduxjs/toolkit'
import partnerReducer from './slices/partnerSlice'
import profileReducer from './slices/profileSlice'

export const store = configureStore({
  reducer: {
    partners: partnerReducer,
    profile: profileReducer,
  },
})
