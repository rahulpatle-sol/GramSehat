import { apiClient } from '../../app/src/api/client';
import type { OutbreakAlert } from '../types';

export const outbreakApi = {
  getNearby: async (pincode: string): Promise<{ outbreaks: OutbreakAlert[] }> => {
    const response = await apiClient.get<{ outbreaks: OutbreakAlert[] }>(`/outbreak/nearby?pincode=${pincode}`);
    return response;
  },

  getHistory: async (pincode: string, limit: number = 20): Promise<{ outbreaks: OutbreakAlert[] }> => {
    const response = await apiClient.get<{ outbreaks: OutbreakAlert[] }>(`/outbreak/history?pincode=${pincode}&limit=${limit}`);
    return response;
  },
};