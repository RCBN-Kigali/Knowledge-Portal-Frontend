import { create } from 'zustand';
import { STORAGE_KEYS } from '../utils/constants';
import { getStoredValue, setStoredValue, removeStoredValue } from '../utils/helpers';

const useAuthStore = create((set, get) => ({
  user: getStoredValue(STORAGE_KEYS.USER),
  accessToken: getStoredValue(STORAGE_KEYS.ACCESS_TOKEN),
  refreshToken: getStoredValue(STORAGE_KEYS.REFRESH_TOKEN),
  isAuthenticated: !!getStoredValue(STORAGE_KEYS.ACCESS_TOKEN),
  isLoading: false,

  setUser: (user) => {
    setStoredValue(STORAGE_KEYS.USER, user);
    set({ user, isAuthenticated: true });
  },

  setTokens: (accessToken, refreshToken) => {
    setStoredValue(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      setStoredValue(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    set({
      accessToken,
      refreshToken: refreshToken || get().refreshToken,
      isAuthenticated: true
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  logout: () => {
    removeStoredValue(STORAGE_KEYS.USER);
    removeStoredValue(STORAGE_KEYS.ACCESS_TOKEN);
    removeStoredValue(STORAGE_KEYS.REFRESH_TOKEN);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false
    });
  },

  clearAuth: () => {
    get().logout();
  }
}));

export default useAuthStore;
