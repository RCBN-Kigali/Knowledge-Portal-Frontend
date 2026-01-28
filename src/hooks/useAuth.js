import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authAPI } from '../api/auth';
import { ROUTES, STORAGE_KEYS } from '../utils/constants';
import { setStoredValue, getStoredValue } from '../utils/helpers';

const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setTokens, logout: logoutStore, setLoading } = useAuthStore();
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Login attempt with:', { email, passwordLength: password.length });
      const data = await authAPI.login(email, password);

      // Store tokens first
      setTokens(data.access_token, data.refresh_token);

      // Fetch user info after login
      const user = await authAPI.getCurrentUser();
      setUser(user);

      if (rememberMe) {
        setStoredValue(STORAGE_KEYS.REMEMBER_EMAIL, email);
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
      }

      navigate(ROUTES.DASHBOARD);
      return { success: true };
    } catch (err) {
      console.error('Login error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });

      let errorMessage = 'Login failed. Please check your credentials.';

      if (err.response?.status === 400) {
        errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Invalid email or password format. Please check your input.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate, setUser, setTokens, setLoading]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logoutStore();
      setLoading(false);
      navigate(ROUTES.LOGIN);
    }
  }, [navigate, logoutStore, setLoading]);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const user = await authAPI.getCurrentUser();
      setUser(user);
      return { success: true, user };
    } catch (err) {
      logoutStore();
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [setUser, logoutStore, setLoading]);

  const getRememberedEmail = () => {
    return getStoredValue(STORAGE_KEYS.REMEMBER_EMAIL);
  };

  return {
    login,
    logout,
    checkAuth,
    getRememberedEmail,
    error,
    setError
  };
};

export default useAuth;
