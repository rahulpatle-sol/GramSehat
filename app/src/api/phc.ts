import { apiClient } from './client';
import type { PhcCenter } from '../types';

export const phcApi = {
  getNearby: async (lat: number, lng: number, radius: number = 20): Promise<{ centers: PhcCenter[] }> => {
    const response = await apiClient.get(`/phc/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return response as { centers: PhcCenter[] };
  },

  getByPincode: async (pincode: string): Promise<{ centers: PhcCenter[] }> => {
    const response = await apiClient.get(`/phc/nearby?pincode=${pincode}`);
    return response as { centers: PhcCenter[] };
  },

  search: async (q: string, type?: string): Promise<{ centers: PhcCenter[] }> => {
    const params = new URLSearchParams({ q });
    if (type) params.append('type', type);
    const response = await apiClient.get(`/phc/search?${params.toString()}`);
    return response as { centers: PhcCenter[] };
  },

  getDetails: async (id: number): Promise<{ center: PhcCenter }> => {
    const response = await apiClient.get(`/phc/${id}`);
    return response as { center: PhcCenter };
  },
};

export default phcApi;
