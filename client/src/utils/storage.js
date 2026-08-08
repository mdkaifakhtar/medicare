// Shared browser-storage helpers for auth persistence.
const USER_KEY = 'medcare_user';
const TOKEN_KEY = 'medcare_token';
const REFRESH_KEY = 'medcare_refresh_token';

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const persistSession = ({ user, accessToken, refreshToken }) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export { USER_KEY, TOKEN_KEY, REFRESH_KEY };
