import apiClient from './client';

export const authAPI = {
  login: async (email, password) => {
    const payload = { email, password };
    console.log('API Login request:', { endpoint: '/api/auth/login', payload: { email, passwordLength: password.length } });
    const response = await apiClient.post('/api/auth/login', payload);
    console.log('API Login success:', { user: response.data.user });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/api/auth/refresh', {
      refresh_token: refreshToken
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.put('/api/auth/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  }
};
