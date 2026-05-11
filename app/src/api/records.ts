import { apiClient } from './index';
import type { HealthRecord, HealthRecordData } from '../types';

export const recordApi = {
  getAll: async (memberId?: number): Promise<{ records: HealthRecord[] }> => {
    const endpoint = memberId ? `/records?memberId=${memberId}` : '/records';
    const response = await apiClient.get(endpoint);
    return response as { records: HealthRecord[] };
  },

  get: async (id: number): Promise<{ record: HealthRecord }> => {
    const response = await apiClient.get(`/records/${id}`);
    return response as { record: HealthRecord };
  },

  add: async (data: HealthRecordData): Promise<{ record: HealthRecord }> => {
    const response = await apiClient.post('/records', data);
    return response as { record: HealthRecord };
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/records/${id}`);
    return response as { success: boolean; message: string };
  },
};

export default recordApi;