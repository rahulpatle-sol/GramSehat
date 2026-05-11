import { apiClient } from '../../app/src/api/client';
import type { PhcCenter } from '../types';

export const phcApi = {
  getNearby: async (lat: number, lng: number, radius: number = 20): Promise<{ centers: PhcCenter[] }> => {
    const response = await apiClient.get<{ centers: PhcCenter[] }>(`/phc/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return response;
  },

  getByPincode: async (pincode: string): Promise<{ centers: PhcCenter[] }> => {
    const response = await apiClient.get<{ centers: PhcCenter[] }>(`/phc/nearby?pincode=${pincode}`);
    return response;
  },

  search: async (q: string, type?: string): Promise<{ centers: PhcCenter[] }> => {
    const params = new URLSearchParams({ q });
    if (type) params.append('type', type);
    const response = await apiClient.get<{ centers: PhcCenter[] }>(`/phc/search?${params.toString()}`);
    return response;
  },

  getDetails: async (id: number): Promise<{ center: PhcCenter }> => {
    const response = await apiClient.get<{ center: PhcCenter }>(`/phc/${id}`);
    return response;
  },
};