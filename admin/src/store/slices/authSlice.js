import { createSlice } from '@reduxjs/toolkit'
import { loginUser, registerUser, fetchMe } from '../thunks/authThunks'

const tokenFromStorage =
  typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

const initialState = {
  user: null,
  token: tokenFromStorage,
  status: 'idle',
  error: null,
  mode: 'login',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'login' ? 'signup' : 'login'
      state.error = null
    },
    setMode(state, action) {
      state.mode = action.payload
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Login failed'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Signup failed'
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = 'idle'
        state.user = null
        state.token = null
        state.error = action.payload || null
      })
  },
})

export const { toggleMode, setMode, clearError, logout } = authSlice.actions

export default authSlice.reducer
