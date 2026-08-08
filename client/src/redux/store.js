import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';
import { getStoredUser, getStoredToken, persistSession, clearSession } from '../utils/storage.js';

// ---------- AUTH SLICE ----------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    token: getStoredToken(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null; state.token = null; state.status = 'idle'; state.error = null;
      clearSession();
    },
    clearError(state) { state.error = null; },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      persistSession({ user: state.user });
    },
  },
  extraReducers: (b) => b
    .addCase(loginAsync.pending, (s) => { s.status = 'loading'; s.error = null; })
    .addCase(loginAsync.fulfilled, (s, a) => {
      s.status = 'succeeded';
      s.user = a.payload.user;
      s.token = a.payload.accessToken;
      persistSession(a.payload);
    })
    .addCase(loginAsync.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || a.error.message; })
    .addCase(googleAuthAsync.pending, (s) => { s.status = 'loading'; s.error = null; })
    .addCase(googleAuthAsync.fulfilled, (s, a) => {
      s.status = 'succeeded';
      s.user = a.payload.user;
      s.token = a.payload.accessToken;
      persistSession(a.payload);
    })
    .addCase(googleAuthAsync.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || a.error.message; }),
});

export const loginAsync = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const res = await api.login(creds);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

// Google OAuth — verifies the Google ID token through our own backend and
// receives the same JWT access/refresh pair as email/password sign-in.
export const googleAuthAsync = createAsyncThunk('auth/google', async (payload, { rejectWithValue }) => {
  try {
    return await api.googleLogin(payload);
  } catch (err) {
    return rejectWithValue(err.message || 'Google sign-in failed');
  }
});

export const { logout, clearError, updateUser } = authSlice.actions;

// ---------- UI SLICE ----------
const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarCollapsed: false, mobileSidebarOpen: false },
  reducers: {
    toggleSidebar: (s) => { s.sidebarCollapsed = !s.sidebarCollapsed; },
    toggleMobileSidebar: (s) => { s.mobileSidebarOpen = !s.mobileSidebarOpen; },
    setMobileSidebar: (s, a) => { s.mobileSidebarOpen = a.payload; },
  },
});
export const { toggleSidebar, toggleMobileSidebar, setMobileSidebar } = uiSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer, ui: uiSlice.reducer },
  middleware: (g) => g({ serializableCheck: false }),
});
