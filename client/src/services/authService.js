import api from './api';
import { ENDPOINTS } from '../config/api';

export const authService = {
  async login(email, password) {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async register(userData) {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async getProfile() {
    return await api.get(ENDPOINTS.AUTH.ME);
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
};