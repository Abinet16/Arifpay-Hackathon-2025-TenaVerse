import api from './api';
import { ENDPOINTS } from '../config/api';

export const adminService = {
  async getOverview() {
    return await api.get(ENDPOINTS.ADMIN.OVERVIEW);
  },

  async getUsers() {
    return await api.get(ENDPOINTS.ADMIN.USERS);
  },

  async getUserDetails(userId) {
    return await api.get(`${ENDPOINTS.ADMIN.USER_DETAILS}/${userId}`);
  },

  async getAuditLogs() {
    return await api.get(ENDPOINTS.ADMIN.AUDITS);
  },
};