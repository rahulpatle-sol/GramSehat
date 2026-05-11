import { apiClient } from './index';
import type { OutbreakAlert } from '../types';

export const outbreakApi = {
  getNearby: async (pincode: string): Promise<{ outbreaks: OutbreakAlert[] }> => {
    const response = await apiClient.get(`/outbreak/nearby?pincode=${pincode}`);
    return response as { outbreaks: OutbreakAlert[] };
  },

  getHistory: async (pincode: string, limit: number = 20): Promise<{ outbreaks: OutbreakAlert[] }> => {
    const response = await apiClient.get(`/outbreak/history?pincode=${pincode}&limit=${limit}`);
    return response as { outbreaks: OutbreakAlert[] };
  },
};

export default outbreakApi;