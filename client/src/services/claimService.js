import api from './api';
import { ENDPOINTS } from '../config/api';

export const claimService = {
  async requestClaim(claimData) {
    return await api.post(ENDPOINTS.CLAIMS.REQUEST, claimData);
  },

  async getClaimHistory() {
    return await api.get(ENDPOINTS.CLAIMS.HISTORY);
  },
};