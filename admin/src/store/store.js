import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import consultationReducer from './slices/consultationSlice'
import heroReducer from './slices/heroSlice'
import profileReducer from './slices/profileSlice'
import serviceReducer from './slices/serviceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    consultations: consultationReducer,
    hero: heroReducer,
    profile: profileReducer,
    services: serviceReducer,
  },
})

export default store
