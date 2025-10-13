import api from './api';
import { ENDPOINTS } from '../config/api';

export const paymentService = {
  async createCheckout(checkoutData) {
    return await api.post(ENDPOINTS.PAYMENTS.CHECKOUT, checkoutData);
  },

  async processTransfer(transferData) {
    return await api.post(ENDPOINTS.PAYMENTS.TRANSFER, transferData);
  },
};