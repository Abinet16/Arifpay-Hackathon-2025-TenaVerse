export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    ME: '/users/me',
  },
  PAYMENTS: {
    CHECKOUT: '/payments/checkout',
    TRANSFER: '/payments/telebirr/transfer',
  },
  CLAIMS: {
    REQUEST: '/claims/request',
    HISTORY: '/claims/history',
  },
  ADMIN: {
    OVERVIEW: '/admin/overview',
    USERS: '/admin/users',
    USER_DETAILS: '/admin/user',
    AUDITS: '/admin/audits',
  },
  NOTIFICATIONS: '/notifications',
};