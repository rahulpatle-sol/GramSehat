import { apiClient } from '../../app/src/api/client';
import type { HealthRecord, HealthRecordData } from '../types';

export const recordApi = {
  getAll: async (memberId?: number): Promise<{ records: HealthRecord[] }> => {
    const endpoint = memberId ? `/records?memberId=${memberId}` : '/records';
    const response = await apiClient.get<{ records: HealthRecord[] }>(endpoint);
    return response;
  },

  get: async (id: number): Promise<{ record: HealthRecord }> => {
    const response = await apiClient.get<{ record: HealthRecord }>(`/records/${id}`);
    return response;
  },

  add: async (data: HealthRecordData): Promise<{ record: HealthRecord }> => {
    const response = await apiClient.post<{ record: HealthRecord }>('/records', data);
    return response;
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/records/${id}`);
    return response;
  },
};